// Weergave-helpers voor video's in de 2006-stijl.

export function cleanTitle(title: string): string {
  return title.replace(/#\S+/g, "").replace(/\|\s*Mertabi Sketch/i, "").trim() || title;
}

export function tagsFrom(title: string): string[] {
  const tags = [...title.matchAll(/#(\S+)/g)].map((m) => m[1].toLowerCase());
  return [...new Set(tags.length ? tags : ["mertabi", "sketch"])];
}

// Decoratieve 2006-sterren: per video vast 4 of 5, afgeleid van het video-id.
export function starsFor(id: string): string {
  const sum = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return sum % 2 ? "★★★★★" : "★★★★☆";
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}
