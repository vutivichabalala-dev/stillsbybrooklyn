import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

  // Get user ID
  const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
  const me = await meRes.json();

  if (!me.id) {
    return Response.json({ error: 'Could not fetch Instagram user', details: me }, { status: 500 });
  }

  // Get recent media
  const mediaRes = await fetch(
    `https://graph.instagram.com/${me.id}/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=12&access_token=${accessToken}`
  );
  const media = await mediaRes.json();

  const posts = (media.data || [])
    .filter(p => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM')
    .map(p => ({
      id: p.id,
      url: p.media_url,
      permalink: p.permalink,
      caption: p.caption || '',
      timestamp: p.timestamp,
    }));

  return Response.json({ username: me.username, posts });
});