"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  pubDate?: string;
  image?: string;
  link?: string;
}

const categories = ["All", "World", "Technology", "Business", "Health"];

export default function NewsPage() {
  const params = useParams();
  const newsId = params.id;

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // Fetch main news
  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const feedUrl = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml";
        const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
        const data = await res.json();
        const item = data.items.find((i: NewsItem) => i.id === newsId);
        setNews(item || null);
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [newsId]);

  // Fetch related news by category
  useEffect(() => {
    async function fetchRelated() {
      setRelatedLoading(true);
      try {
        const feedUrls: Record<string, string> = {
          All: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
          World: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
          Technology: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
          Sports: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
          Business: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
          Health: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
        };

        const feedUrl = feedUrls[selectedCategory];
        const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
        const data = await res.json();
        const filtered = (data.items as NewsItem[])
          .filter((i) => i.id !== newsId)
          .slice(0, 6);
        setRelatedNews(filtered);
      } catch (err) {
        console.error("Failed to fetch related news", err);
      } finally {
        setRelatedLoading(false);
      }
    }
    fetchRelated();
  }, [selectedCategory, newsId]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main News */}
      {loading ? (
        <div className="animate-pulse mt-6">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-64 md:h-96 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      ) : news ? (
        <>
          <h1 className="text-3xl font-bold mt-6 mb-4">{news.title}</h1>

          {news.image && (
            <div className="relative w-full h-64 md:h-96 mb-6">
              <Image
                src={news.image}
                alt={news.title}
                width={800}
                height={400}
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div
            className="text-gray-700 prose max-w-full mb-8"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {news.pubDate && (
            <p className="text-xs text-gray-500 mb-6">
              Published on: {new Date(news.pubDate).toLocaleString()}
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-500">News not found</p>
      )}

      {/* Related News */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">More News in {selectedCategory}</h2>
        {relatedLoading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {Array(6)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="h-40 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {relatedNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                {item.image && (
                  <div className="relative w-full h-40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-base md:text-lg">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
