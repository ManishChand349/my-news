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
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
      {item.image && (
        <Image
          src={item.image}
          alt={item.title}
          fill  // fill parent container
          style={{ objectFit: "cover" }} // cover the container
          className="w-full h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
        />
      )}

      {/* Title overlay with clickable Link */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <Link
          href={`/news/${item.id}`}
          className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold hover:text-blue-400 transition"
        >
          {item.title}
        </Link>
      </div>
    </div>
  );
}
