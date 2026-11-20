// Reels shipped with the site itself (files live in /public/reels).
// They always show on the Reels page, even if the Base44 reel list is empty or unreachable.
// Encode new reels as 1080x1920 H.264 MP4 with +faststart so they stream on every browser.
export const staticReels = [
  {
    id: 'static-sphe-lobola-luncheon',
    title: "S'phe's Lobola Luncheon",
    description: 'A garden lobola luncheon in Johannesburg — décor, family and the couple.',
    category: 'Weddings',
    is_featured: true,
    video_url: '/reels/sphe-lobola-luncheon.mp4',
    // lighter 720p copy for the full-screen autoplaying hero on /reels
    hero_url: '/reels/sphe-lobola-luncheon-720.mp4',
    thumbnail_url: '/reels/sphe-lobola-luncheon.jpg',
    isStatic: true,
  },
];
