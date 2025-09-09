import Image from "next/image";

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
           width={600}  height={400}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h1 className="text-white text-2xl md:text-4xl font-bold">{item.title}</h1>
      </div>
    </div>
  );
}
