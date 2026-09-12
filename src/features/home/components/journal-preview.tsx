import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowIcon } from "@/components/ui/icons";
import { getJournalArticles } from "@/server/catalog/public";

export async function JournalPreview() {
  const articles = (await getJournalArticles()).slice(0, 3);
  return (
    <Section className="bg-mayera-paper">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Hair Journal" title="Care, explained simply." description="Practical hair education, ingredient notes and routines without miracle language." />
          <Link href="/hair-journal" className="inline-flex items-center gap-2 text-sm font-medium text-mayera-espresso">View journal <ArrowIcon className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((article, index) => (
            <Link key={article.slug} href={`/hair-journal/${article.slug}`} className="group rounded-[1.75rem] border border-mayera-line bg-white/55 p-6 transition hover:-translate-y-1 hover:shadow-card">
              <div className={`h-48 rounded-[1.25rem] ${index === 0 ? "bg-[#d8d0c4]" : index === 1 ? "bg-[#c8c3a6]" : "bg-[#e0d4c4]"} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "url('/brand/patterns/mayera-botanical.svg')", backgroundPosition: "right bottom", backgroundRepeat: "no-repeat", backgroundSize: "58% auto" }} />
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.15em] text-mayera-olive">{article.category} · {article.readTime}</p>
              <h3 className="mt-3 font-serif text-2xl leading-tight text-mayera-espresso group-hover:text-mayera-amber">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-mayera-espresso/58">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
