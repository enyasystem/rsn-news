import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { format } from "date-fns";

interface NewsPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = params;
  const news = await prisma.news.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!news) return {};
  return {
    title: news.title,
    description: news.content.slice(0, 200),
    openGraph: {
      images: [news.imageUrl || "/placeholder.svg"],
    },
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = params;
  const news = await prisma.news.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!news) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <Badge className="bg-[#CC0000] hover:bg-[#AA0000]">
              {news.category ? news.category.name : "General"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{news.title}</h1>
          <div className="mb-4">
            <span className="text-muted-foreground text-sm">
              {(() => {
                try {
                  return format(new Date(news.createdAt), "MMMM d, yyyy");
                } catch (e) {
                  return "Recently published";
                }
              })()}
            </span>
          </div>
          <div className="aspect-video w-full relative mb-6">
            <ImageWithFallback
              src={news.imageUrl || "/placeholder.svg"}
              fallbackSrc={"/placeholder.svg"}
              alt={news.title}
              width={800}
              height={450}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-lg font-medium mb-4">{news.content.slice(0, 200)}</p>
            <div className="line-clamp-6 mb-4">
              {news.content ? (
                <div dangerouslySetInnerHTML={{ __html: news.content.substring(0, 500) + "..." }} />
              ) : (
                <p>{news.content.slice(0, 200)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
