import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "@/features/journal/article/page";
import { getJournalArticle } from "@/server/catalog/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getJournalArticle(slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getJournalArticle(slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
