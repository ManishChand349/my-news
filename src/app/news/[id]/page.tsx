"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar"; // Navbar path sahi rakho
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  pubDate?: string;
  image?: string;
  link?: string;
  source?: string;
}

// Dynamic categories
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

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id;

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState<NewsItem[]>([]);

  // Fetch single article from API
  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const res = await fetch(`/api/news?q=${encodeURIComponent(selectedCategory.toLowerCase())}`);
        const data = await res.json();
        const item = data.items.find((i: NewsItem) => i.id === articleId);
        setArticle(item || null);
        setItems(data.items || []);
      } catch (err) {
        console.error("Failed to fetch article", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [articleId, selectedCategory]);

  if (loading) return <p className="p-6">Loading article...</p>;
  if (!article) return <p className="p-6">Article not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Article content */}
      <h1 className="text-3xl font-bold mb-4 mt-6">{article.title}</h1>
      {article.image && (
        <Image
          src={article.image || "/placeholder.jpg"}
          alt={article.title}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <p className="text-gray-600 mb-2">Source: {article.source}</p>
      <p className="text-gray-500 text-sm mb-4">
        Published at: {new Date(article.pubDate || "").toLocaleString()}
      </p>
      <p className="text-gray-800 mb-4">{article.content}</p>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 inline-block"
      >
        Read full article on source →
      </a>

      {/* Optional: Show other articles from same category */}
      {items.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">More articles in {selectedCategory}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {items
              .filter((i) => i.id !== article.id)
              .slice(0, 6)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="block border rounded-lg p-4 shadow hover:shadow-lg transition"
                >
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
        </div>
      )}
    </div>
  );
}
