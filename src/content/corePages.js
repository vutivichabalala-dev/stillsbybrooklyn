// SEO settings and keyword copy for the site's existing pages.
// Copy comes from the "Stills by Brooklyn — On-Page SEO Spec" doc.

const QUOTE = 'Every package is tailored to your day — [request a quote](/contact) and we\'ll send the options that fit.';

export const corePages = {
  home: {
    path: '/',
    title: 'Photographer in Johannesburg | Stills by Brooklyn',
    description: 'Johannesburg photographer and videographer since 2018. Weddings, lobola, graduations, matric dances, headshots and events across Gauteng. Book now.',
    keywords: ['photographer johannesburg', 'photographer near me', 'photoshoot johannesburg', 'photographer and videographer johannesburg'],
    h1: 'Photographer & Videographer in Johannesburg',
  },

  weddings: {
    path: '/wedding-photographer-johannesburg',
    title: 'Wedding Photographer Johannesburg | Stills by Brooklyn',
    description: 'Johannesburg wedding photographer and videographer. Full-day stills, drone aerials and behind-the-scenes reels for weddings across Gauteng and SA.',
    keywords: ['wedding photographer johannesburg', 'johannesburg wedding photographer', 'wedding photographer pretoria', 'wedding photographer gauteng', 'wedding videographer johannesburg', 'wedding photographer price'],
    eyebrow: 'Weddings',
    h1: 'Wedding Photographer in Johannesburg',
    intro: 'Stills by Brooklyn is a Johannesburg wedding photographer and videographer, covering weddings across Gauteng and South Africa since 2018. One booking gets you stills, film, drone aerials and a behind-the-scenes reel, all shot in one consistent style.',
    sections: [
      { h2: 'Wedding photography and video across Gauteng', body: ['From venue weddings in Johannesburg and Pretoria to intimate ceremonies at home, the approach is the same. We plan carefully beforehand, guide you gently on the day, and catch the moments nobody posed for.'] },
      { h2: 'Your wedding day, hour by hour', body: ['Coverage follows your real timeline:', { ol: ['**Getting ready:** dresses, details, nerves and laughter with the bridal party', '**Ceremony:** the walk down the aisle, the vows, and both families\' reactions', '**Family and group photos:** organised with a list, so no one is missed', '**Couple portraits:** planned around the best light at your venue', '**Reception:** entrances, speeches, first dance and the dance floor'] }] },
      { h2: 'Drone and aerial wedding coverage', body: ['Aerial shots show what ground cameras can\'t: the venue\'s setting, the ceremony layout and the full crowd. Drone coverage is available where the venue and the weather allow it.'] },
      { h2: 'Behind-the-scenes reels', body: ['A short, vertical, social-ready reel of the day, made for Instagram and TikTok. Most couples share it before the full gallery is even delivered. See [videography](/videographer-johannesburg).'] },
      { h2: 'Wedding collections and prices', body: ['Collections are priced by hours of coverage and by whether you add video. ' + QUOTE] },
      { h2: 'Weddings in Johannesburg, Pretoria and beyond', body: ['Marrying in Pretoria? See [Photographer in Pretoria](/photographer-pretoria). Having a traditional ceremony too? See [traditional wedding photography](/traditional-wedding-photographer).'] },
    ],
    faqs: [
      { q: 'Do you shoot both photos and video?', a: 'Yes. Most collections include both, shot by one team in one style.' },
      { q: 'Do you travel for weddings outside Gauteng?', a: 'Yes, nationwide. Travel and accommodation are quoted upfront.' },
      { q: 'Can you cover the traditional ceremony and the white wedding?', a: 'Yes. Many couples book both, as a combined package or on separate days.' },
      { q: 'How do we secure our date?', a: 'A deposit confirms your booking. Send us your date to check availability.' },
    ],
    galleryHeading: 'Weddings we\'ve shot',
  },

  headshots: {
    path: '/corporate-headshots-johannesburg',
    title: 'Professional Headshots Johannesburg | Stills by Brooklyn',
    description: 'Professional and corporate headshots in Johannesburg, Sandton and Midrand. Studio sessions or on-site team shoots with studio lighting, ready for LinkedIn.',
    keywords: ['professional headshots', 'corporate headshots', 'headshots corporate', 'corporate headshots johannesburg', 'corporate photographer johannesburg', 'linkedin headshots'],
    eyebrow: 'Corporate & Headshots',
    h1: 'Professional & Corporate Headshots in Johannesburg',
    intro: 'Stills by Brooklyn takes professional and corporate headshots in Johannesburg, Sandton and Midrand, either in studio or on-site at your office. Your headshot is often a client\'s first impression, so it should look like you on your best day, not a passport photo.',
    sections: [
      { h2: 'Individual professional headshots', body: ['Individual sessions suit consultants, executives, realtors, speakers and anyone updating their LinkedIn. We coach expression and posture throughout, so you leave with images you\'re happy to use everywhere.'] },
      { h2: 'On-site team headshots for companies', body: ['We bring a portable studio, with Godox strobes and a backdrop, to your office in Sandton, Midrand, Rosebank or anywhere in Johannesburg. Every team member gets the same lighting and background, so your website and company profile look consistent.'] },
      { h2: 'LinkedIn and personal branding headshots', body: ['Personal branding shoots go beyond a single headshot. You get a set of images for your website, speaker profile and social media, at your desk, in conversation and in a few outfits.'] },
      { h2: 'What to wear', body: [{ ul: ['Solid colours photograph better than busy prints', 'Bring one formal and one smart-casual option', 'Wear glasses if you normally wear them; we\'ll manage the glare'] }] },
      { h2: 'Packages and turnaround', body: ['Individual sessions, or team rates per person or per half day. Edited galleries are typically delivered within five to seven business days. ' + QUOTE] },
    ],
    faqs: [
      { q: 'Can you match our existing company headshots?', a: 'Yes. Send us examples and we\'ll match the lighting and background.' },
      { q: 'Do you come to our office?', a: 'Yes. We set up a portable studio at offices in Sandton, Midrand and across Johannesburg.' },
      { q: 'Do you shoot corporate events too?', a: 'Yes. We cover conferences, launches and corporate functions.' },
    ],
    galleryHeading: 'Corporate and headshot work',
  },

  studio: {
    path: '/photography-studio-johannesburg',
    title: 'Photography Studio Johannesburg | Stills by Brooklyn',
    description: 'Book a studio photoshoot in Johannesburg: portraits, couples, family, birthday and branding shoots under professional strobes. View studio packages.',
    keywords: ['photoshoot johannesburg', 'photography studio johannesburg', 'portrait photographer johannesburg', 'family photographer johannesburg', 'studio photoshoot johannesburg'],
    eyebrow: 'Studio & Portraits',
    h1: 'Photography Studio & Photoshoots in Johannesburg',
    intro: 'Stills by Brooklyn hosts portrait, couples, family, birthday and branding photoshoots in Johannesburg, all under professional strobe lighting. Whatever the weather outside, the light is always right.',
    sections: [
      { h2: 'Portrait and personal shoots', body: ['These are solo shoots for a new profile picture, a confidence boost, or simply because you deserve good photos. We\'ll help you plan a concept, from clean and timeless to bold and editorial.'] },
      { h2: 'Couples and family shoots', body: ['Anniversaries, engagements, new-baby announcements and family portraits with the grandparents. Studio shoots keep everyone comfortable and the backgrounds consistent.'] },
      { h2: 'Personal branding and content shoots', body: ['Creators, coaches and small-business owners get a batch of on-brand images for a month of posts, in multiple outfits and setups in one session.'] },
      { h2: 'Studio packages', body: [QUOTE] },
    ],
    faqs: [
      { q: 'Can I bring my own props or outfits?', a: 'Yes. Bring as many as you like, and we\'ll help you pick what works on camera.' },
      { q: 'Can I shoot on location instead?', a: 'Yes. We shoot anywhere in Johannesburg and Gauteng.' },
    ],
    galleryHeading: 'Portrait and studio work',
  },

  services: {
    path: '/services',
    title: 'Photography Services Johannesburg | Stills by Brooklyn',
    description: 'Wedding, lobola, graduation, matric dance, birthday, headshot, event and video services in Johannesburg, Pretoria and across Gauteng. Find your shoot.',
    keywords: ['photography services johannesburg', 'photographer johannesburg', 'photographer and videographer johannesburg'],
    h1: 'Photography & Video Services in Johannesburg',
  },

  about: {
    path: '/about',
    title: 'About Brooklyn | Johannesburg Photographer Since 2018',
    description: 'Meet Brooklyn, the photographer and cinematographer behind Stills by Brooklyn. Shooting weddings, ceremonies and portraits across South Africa since 2018.',
    keywords: ['about stills by brooklyn', 'johannesburg photographer', 'photographer and cinematographer johannesburg'],
    h1: 'Meet Brooklyn, Johannesburg Photographer & Cinematographer',
  },

  contact: {
    path: '/contact',
    title: 'Book a Photographer in Johannesburg | Stills by Brooklyn',
    description: 'Check your date and book a photographer in Johannesburg, Pretoria or anywhere in SA. Call or WhatsApp 067 786 0702, or send an enquiry form.',
    keywords: ['book a photographer johannesburg', 'hire a photographer near me', 'photographer contact johannesburg'],
    h1: 'Book Your Shoot',
  },

  portfolio: {
    path: '/portfolio',
    title: 'Photography Portfolio Johannesburg | Stills by Brooklyn',
    description: 'Wedding, traditional ceremony, graduation, portrait and corporate photography from Johannesburg, Pretoria and across South Africa by Stills by Brooklyn.',
    keywords: ['photography portfolio johannesburg', 'wedding photos johannesburg', 'graduation photos johannesburg'],
    h1: 'Photography Portfolio',
  },

  booking: {
    path: '/booking',
    title: 'Book a Photoshoot in Johannesburg | Stills by Brooklyn',
    description: 'Book your photoshoot online: weddings, lobola, graduations, birthdays, headshots and events in Johannesburg, Pretoria and across Gauteng.',
    keywords: ['book a photoshoot johannesburg', 'photoshoot johannesburg', 'book a photographer near me'],
    h1: 'Book a Photoshoot',
  },

  reels: {
    path: '/reels',
    title: 'Wedding & Event Video Reels | Stills by Brooklyn',
    description: 'Watch wedding, traditional ceremony and event reels filmed by Stills by Brooklyn, a Johannesburg photographer and videographer.',
    keywords: ['videographer johannesburg', 'wedding video reels', 'event video johannesburg'],
  },
};

// Old URLs → new keyword URLs (also mirrored as 301s in vercel.json)
export const redirects = [
  { from: '/services/weddings', to: '/wedding-photographer-johannesburg' },
  { from: '/services/corporate', to: '/corporate-headshots-johannesburg' },
  { from: '/services/portraits', to: '/photography-studio-johannesburg' },
  { from: '/photographersinjohannesburg', to: '/' },
  { from: '/corporatephotographer', to: '/corporate-headshots-johannesburg' },
  { from: '/photographersinsandton', to: '/photographer-sandton' },
];
