export const site = {
  name: "Mertabi",
  url: "https://mertabi.nl",
  email: "mail@mertabi.nl",
  tagline: "Comedy sketches, vers van YouTube.",
  description:
    "Mertabi maakt Nederlandse comedy sketches. Bekijk de nieuwste sketches en alle video's van het YouTube-kanaal.",
  youtube: {
    handle: "mertabi",
    channelId: "UCrVPdFrjQ4MJOAKmJX81IJg",
    url: "https://www.youtube.com/@mertabi",
    // Totaal kanaalweergaven voor de bezoekersteller, gebruikt zolang er geen YOUTUBE_API_KEY is.
    totalViews: 183_429_596,
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/videos", label: "Video's" },
    { href: "/social", label: "Social media" },
    { href: "/contact", label: "Contact" },
  ],
  socials: [
    { name: "YouTube", url: "https://www.youtube.com/@mertabi" },
    { name: "TikTok", url: "https://www.tiktok.com/@mertabi" },
    { name: "Instagram", url: "https://www.instagram.com/mertabimert" },
    { name: "Facebook", url: "https://www.facebook.com/mertsketches" },
  ],
} as const;

export type Social = (typeof site.socials)[number];
