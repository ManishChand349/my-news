import Parser from "rss-parser";
import { NextResponse } from "next/server";

interface FeedItem {
  id: string;
  title: string;
  content: string;
  pubDate?: string;
  image?: string;
  link?: string;
}

interface CustomFeedItem {
  enclosure?: { url?: string };
  media?: { url?: string };
  thumbnail?: { url?: string };
  title?: string;
  contentSnippet?: string;
  content?: string;
  pubDate?: string;
  link?: string;
  ["content:encoded"]?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const feedUrl = searchParams.get("url");

  if (!feedUrl) {
    return NextResponse.json({ error: "Feed URL is required" }, { status: 400 });
  }

  try {
    const parser = new Parser<unknown, CustomFeedItem>({
      customFields: {
        item: [["media:content", "media"], ["media:thumbnail", "thumbnail"]],
      },
    });

    const feed = await parser.parseURL(feedUrl);

    const items: FeedItem[] = feed.items.map((item, index) => {
      const image =
        item.enclosure?.url ||
        item.media?.url ||
        item.thumbnail?.url ||
        extractImageFromContent(item["content:encoded"]) ||
        "/placeholder.png";

      return {
        id: index.toString(),
        title: item.title || "No Title",
        content: item.contentSnippet || item.content || "Content not available",
        pubDate: item.pubDate,
        image,
        link: item.link,
      };
    });

    return NextResponse.json({ items });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// helper: extract first <img> from HTML string
function extractImageFromContent(content?: string): string | null {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}
