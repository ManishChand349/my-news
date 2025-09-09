import Image from "next/image";

interface FeedItem {
  id: string;
  title: string;
  content: string;
  pubDate?: string;
  image?: string;
}

interface NewsPageProps {
  params: { id: string };
}

async function getFeed(): Promise<FeedItem[]> {
  const res = await fetch(`http://localhost:3000/api/rss?url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`);
  const data = await res.json();
  return data.items || [];
}

export default async function NewsPage({ params }: NewsPageProps) {
  const items = await getFeed();
  const item = items.find(i => i.id === params.id);

  if (!item) return <p>Article not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
      {item.pubDate && <p className="text-gray-500 mb-4">{item.pubDate}</p>}
      {item.image && <Image src={item.image} alt={item.title} width={600}  height={400} className="w-full h-96 object-cover mb-6 rounded" />}
      <p className="text-gray-700">{item.content}</p>
    </div>
  );
}
