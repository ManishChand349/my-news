interface NewsItem {
  id: string;
  title: string;
}

interface LatestNewsProps {
  items: NewsItem[];
}

export default function LatestNews({ items }: LatestNewsProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {/* Section Heading */}
      <h2 className="text-xl font-bold mb-4 border-b pb-2">Latest News</h2>

      {/* Headlines */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer hover:text-blue-600 transition border-b pb-2"
          >
            {/* yahan id nahi, title render hoga */}
            <h3 className="text-base md:text-lg font-semibold">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
