"use client";

import { useEffect, useState } from "react";
import Navbar from "../app/components/Navbar";
import FeaturedNews from "../app/components/FeaturedNews";
import LatestNews from "../app/components/LatestNews";
import RssFeed from "../app/components/RssFeed";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  pubDate?: string;
  image?: string;
}

const categories = ["All", "World", "Technology", "Business", "Health"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Feed URLs
  const feedUrls: Record<string, string> = {
    All: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    World: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    Technology: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    Sports: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
    Business: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    Health: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
  };

  const feedUrl = feedUrls[selectedCategory];

  // Fetch RSS items for top section
  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      try {
        const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("Failed to fetch feed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, [feedUrl]);

  // Featured news = pehla article
  const featuredNews = items.length > 0 ? items[0] : null;

  // Latest news = agle 6 article
  const latestNews = items.slice(1, 7);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero + Side latest news */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {featuredNews ? (
            <FeaturedNews item={featuredNews} />
          ) : (
            <p className="text-gray-500">Loading featured news...</p>
          )}
        </div>
        <div className="md:col-span-1">
          <LatestNews items={latestNews} />
        </div>
      </div>

      {/* Other news */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">More News</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <RssFeed feedUrl={feedUrl} />
        )}
      </div>

      {/* Categories Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">News by Categories</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {categories
            .filter((cat) => cat !== "All") // All ko skip karenge
            .map((category) => (
              <div key={category}>
                <h3 className="text-xl font-semibold mb-3">{category}</h3>
                <RssFeed
                  feedUrl={feedUrls[category]}
                  limit={6} // sirf 6 news dikhe
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
