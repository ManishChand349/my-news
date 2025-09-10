/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../app/components/Navbar";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  pubDate?: string;
  image?: string;
  link?: string;
  source?: string;
}

// Ye array ab fully dynamic hai
const categories = [
  "All",
  "Smartphone",
  "Laptop",
  "Gadgets",
  "Tech Accessories",
  "Wearables",
  "Camera",
  "Audio"
];

export default function Home() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sectionArticles, setSectionArticles] = useState<Record<string, NewsItem[]>>({});

  async function fetchNews(category: string) {
    setLoading(true);
    try {
      const query = category === "All" ? "technology" : category.toLowerCase();
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch news", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Har category ke liye max 6 articles fetch karenge
  async function fetchSectionArticles() {
    const newSectionArticles: Record<string, NewsItem[]> = {};
    for (const category of categories.filter((c) => c !== "All")) {
      try {
        const res = await fetch(`/api/news?q=${encodeURIComponent(category.toLowerCase())}`);
        const data = await res.json();
        newSectionArticles[category] = (data.items || []).slice(0, 6);
      } catch (err) {
        newSectionArticles[category] = [];
      }
    }
    setSectionArticles(newSectionArticles);
  }

  useEffect(() => {
    fetchNews(selectedCategory);
    fetchSectionArticles();
  }, [selectedCategory]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Latest Tech Products</h1>

      {/* Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Featured / Latest Articles */}
      {loading && <p>Loading news...</p>}
      {!loading && !items.length && <p>No news available for &quot;{selectedCategory}&quot;</p>}

      {!loading && items.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {items.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="block rounded-lg p-4 shadow hover:shadow-lg transition">
              <Image
                src={item.image || "/placeholder.jpg"}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.content}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Dynamic Product Sections */}
      {Object.keys(sectionArticles).map((category) => {
        const articles = sectionArticles[category];
        return (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{category} Articles</h2>
            {articles.length === 0 ? (
              <p className="text-gray-500">No articles available</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {articles.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="block border rounded-lg p-4 shadow hover:shadow-lg transition">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <h3 className="font-semibold text-base">{item.title}</h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
