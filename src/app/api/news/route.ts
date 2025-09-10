/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const API_KEY = "2510ff464b1a2ef51e229a63d07d779a";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const query = searchParams.get("q") || "technology";

    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&country=us&max=10&apikey=${API_KEY}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error(`Failed to fetch GNews: ${res.statusText}`);

    const data = await res.json();

    const items = (data.articles || []).map((article: any, index: number) => ({
      id: index.toString(),
      title: article.title,
      content: article.description || article.content || "Content not available",
      pubDate: article.publishedAt,
      image: article.image || "/placeholder.jpg",
      link: article.url,
      source: article.source?.name,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
