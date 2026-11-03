import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const [galleries, users, submissions, images, selections] = await Promise.all([
      base44.asServiceRole.entities.Gallery.list('-updated_date', 200),
      base44.asServiceRole.entities.User.list('-created_date', 200),
      base44.asServiceRole.entities.GallerySubmission.list('-submitted_at', 200),
      base44.asServiceRole.entities.GalleryImage.list('-created_date', 50),
      base44.asServiceRole.entities.ImageSelection.list('-created_date', 200),
    ]);

    const clients = users.filter(u => u.role === 'user');

    const stats = {
      total_clients: clients.length,
      total_galleries: galleries.length,
      total_images_uploaded: images.length,
      total_submissions: submissions.length,
      galleries_by_status: {
        draft: galleries.filter(g => g.gallery_status === 'Draft').length,
        awaiting_selections: galleries.filter(g => g.gallery_status === 'Awaiting Selections').length,
        selections_received: galleries.filter(g => g.gallery_status === 'Selections Received').length,
        in_editing: galleries.filter(g => g.gallery_status === 'In Editing').length,
        final_ready: galleries.filter(g => g.gallery_status === 'Final Ready').length,
        delivered: galleries.filter(g => g.gallery_status === 'Delivered').length,
      },
      recent_submissions: submissions.slice(0, 10).map(sub => {
        const gallery = galleries.find(g => g.id === sub.gallery_id);
        const client = clients.find(c => c.id === sub.client_id);
        return {
          id: sub.id,
          gallery_title: gallery?.title || 'Unknown Gallery',
          client_name: client?.full_name || client?.email || 'Unknown Client',
          total_selected: sub.total_selected,
          submitted_at: sub.submitted_at,
          status: sub.submission_status,
        };
      }),
      active_galleries: galleries
        .filter(g => !['Draft', 'Delivered'].includes(g.gallery_status))
        .map(g => {
          const client = clients.find(c => c.id === g.client_id);
          return {
            id: g.id,
            title: g.title,
            client_name: client?.full_name || client?.email || 'Unknown',
            status: g.gallery_status,
            shoot_type: g.shoot_type,
            event_date: g.event_date,
          };
        }),
    };

    return Response.json(stats);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});