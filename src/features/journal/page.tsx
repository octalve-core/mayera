import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { JournalHero } from "./components/hero";
import { ArticleGrid } from "./components/article-grid";
import { getJournalArticles } from "@/server/catalog/public";
export default async function JournalPage() { const articles=await getJournalArticles(); return <><JournalHero /><Section><Container><ArticleGrid articles={articles} /></Container></Section></>; }
