import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  image?: string;
}

interface FeaturedNewsProps {
  item: NewsItem;
}

export default function FeaturedNews({ item }: FeaturedNewsProps) {
  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
      {item.image && (
        <Image
          src={item.image}
          alt={item.title}
          width={800}   // fixed width
          height={400}  // fixed height
          className="w-full h-full object-cover"
        />
      )}

      {/* Title overlay with clickable Link */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <Link
          href={`/news/${item.id}`}
          className="text-white text-2xl md:text-4xl font-bold hover:text-blue-400 transition"
        >
          {item.title}
        </Link>
      </div>
    </div>
  );
}
