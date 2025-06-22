import { getArticleBySlug } from "@/lib/news-service";
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
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      images: [article.imageUrl || "/placeholder.svg"],
    },
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <Badge className="bg-[#CC0000] hover:bg-[#AA0000]">{typeof article.category === "object" && article.category ? article.category.name : article.category}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{article.title}</h1>
          <div className="mb-4">
            <span className="text-muted-foreground text-sm">
              {(() => {
                try {
                  return format(new Date(article.publishedAt), "MMMM d, yyyy");
                } catch (e) {
                  return "Recently published";
                }
              })()}
            </span>
          </div>
          <div className="aspect-video w-full relative mb-6">
            <ImageWithFallback
              src={article.imageUrl || "/placeholder.svg"}
              fallbackSrc={"/placeholder.svg"}
              alt={article.title}
              width={800}
              height={450}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-lg font-medium mb-4">{article.excerpt}</p>
            <div className="line-clamp-6 mb-4">
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content.substring(0, 500) + "..." }} />
              ) : (
                <p>{article.excerpt}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
