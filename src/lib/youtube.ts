import { site } from "../data/site";

export type YoutubeVideo = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
};

const CHANNEL_ID = site.youtube.channelId;
const UPLOADS_PLAYLIST = `UU${CHANNEL_ID.slice(2)}`;

export async function getLatestVideos(limit = 20): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();

  if (apiKey) {
    try {
      const videos = await fetchFromApi(apiKey, limit);
      if (videos.length) return videos.slice(0, limit);
    } catch (error) {
      console.warn("YouTube API mislukt, val terug op RSS.", error);
    }
  }

  return (await fetchFromRss()).slice(0, limit);
}

async function fetchFromApi(apiKey: string, limit: number): Promise<YoutubeVideo[]> {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("maxResults", String(Math.min(limit, 50)));
  url.searchParams.set("playlistId", UPLOADS_PLAYLIST);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API ${response.status}`);
  }

  const data = (await response.json()) as {
    items?: Array<{
      snippet?: {
        title?: string;
        publishedAt?: string;
        resourceId?: { videoId?: string };
        thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
      };
    }>;
  };

  return (data.items ?? [])
    .map((item) => {
      const id = item.snippet?.resourceId?.videoId ?? "";
      return {
        id,
        title: item.snippet?.title ?? "Video",
        published: item.snippet?.publishedAt ?? "",
        thumbnail:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          thumbnailFor(id),
      };
    })
    .filter((video) => video.id);
}

async function fetchFromRss(): Promise<YoutubeVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.warn(`YouTube RSS ${response.status}`);
    return [];
  }

  const xml = await response.text();
  return parseRss(xml);
}

function parseRss(xml: string): YoutubeVideo[] {
  return xml
    .split("<entry>")
    .slice(1)
    .map((entry) => {
      const id = match(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/);
      return {
        id,
        title: decodeXml(match(entry, /<title>([^<]+)<\/title>/) || "Video"),
        published: match(entry, /<published>([^<]+)<\/published>/),
        thumbnail:
          match(entry, /<media:thumbnail[^>]*url="([^"]+)"/) || thumbnailFor(id),
      };
    })
    .filter((video) => video.id);
}

function match(value: string, pattern: RegExp): string {
  return value.match(pattern)?.[1] ?? "";
}

function decodeXml(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function thumbnailFor(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
