import { fetchNewsByCategory } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"

interface CategoryPageProps {
  params: {
    slug?: string;
  };
}

// This file is now handled by the dynamic [slug] route. See app/category/[slug]/page.tsx
export default function DeprecatedEntertainmentPage() {
  return null;
}
