"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  pubDate?: string;
  image?: string;
  link?: string;
}

interface RssFeedProps {
  feedUrl: string;
  limit?: number;
}

export default function RssFeed({ feedUrl, limit = 6 }: RssFeedProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(limit);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      try {
        const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
        const data = await res.json();
        const news: NewsItem[] = data.items || [];
        setItems(news);
      } catch (err) {
        console.error("Failed to fetch feed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, [feedUrl]);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        {items.slice(0, visibleCount).map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border rounded-lg shadow-sm p-3 hover:shadow-md transition"
          >
            {/* Image fixed width/height */}
            <div className="flex-shrink-0 w-32 h-24 relative">
              {item.image ? (
                <Image
                  src={item.image}
                  alt="img"
                  width={128}   // fixed width
                  height={96}   // fixed height
                  className="object-cover rounded-md"
                  unoptimized    // optional: bypass Next.js optimization
                />
              ) : (
                <div className="w-32 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-md">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between">
              <Link
                href={`/news/${item.id}`}
                className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2"
              >
                {item.title}
              </Link>
              <p className="text-xs text-gray-500">{item.pubDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {visibleCount < items.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
