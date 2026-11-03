import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Runs from the weekly schedule (as an app admin); direct callers must be an admin too.
  const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  // Compute date range: last 7 days
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoISO = weekAgo.toISOString();

  // Fetch all page visits from the last 7 days
  const allVisits = await base44.asServiceRole.entities.PageVisit.list('-visited_at', 2000);
  const recentVisits = allVisits.filter(v => v.visited_at && v.visited_at >= weekAgoISO);

  // Count visits per page
  const pageCounts = {};
  for (const visit of recentVisits) {
    const page = visit.page || 'unknown';
    pageCounts[page] = (pageCounts[page] || 0) + 1;
  }

  // Fetch all galleries for display names
  const galleries = await base44.asServiceRole.entities.Gallery.list();
  const galleryMap = {};
  for (const g of galleries) {
    galleryMap[g.id] = g.title || g.id;
  }

  // Build report rows — match gallery IDs found in page paths
  const galleryRows = galleries.map(g => {
    const matchKey = Object.keys(pageCounts).find(p => p.includes(g.id));
    return {
      gallery_id: g.id,
      gallery_title: g.title || 'Untitled',
      shoot_type: g.shoot_type || '-',
      visit_count: matchKey ? pageCounts[matchKey] : 0,
    };
  }).sort((a, b) => b.visit_count - a.visit_count);

  // Build full page breakdown
  const pageBreakdown = Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);

  const report = {
    period: {
      from: weekAgoISO,
      to: now.toISOString(),
    },
    total_visits: recentVisits.length,
    unique_pages: Object.keys(pageCounts).length,
    gallery_visit_summary: galleryRows,
    all_pages_breakdown: pageBreakdown,
  };

  // Send email summary to admin
  const emailBody = `
Weekly Visit Summary Report
Period: ${weekAgo.toDateString()} – ${now.toDateString()}

Total Visits: ${report.total_visits}
Unique Pages: ${report.unique_pages}

--- Gallery Visit Counts ---
${galleryRows.length > 0
  ? galleryRows.map(r => `${r.gallery_title} (${r.shoot_type}): ${r.visit_count} visits`).join('\n')
  : 'No gallery page visits recorded.'}

--- Top Pages ---
${pageBreakdown.slice(0, 10).map(p => `${p.page}: ${p.count} visits`).join('\n')}
  `.trim();

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: 'brooklyn@stillsbybrooklyn.co.za',
    subject: `📊 Weekly Visit Report — ${weekAgo.toDateString()} to ${now.toDateString()}`,
    body: emailBody,
  });

  return Response.json({ success: true });
});