import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { JournalArticle } from "@/data/articles";

export default function ArticlePage({ article }: { article: JournalArticle }) {
  const paragraphs = article.body.length ? article.body : [article.excerpt];
  return (
    <>
      <section className="bg-mayera-cream py-14 sm:py-16 lg:py-20">
        <Container>
          <Link href="/hair-journal" className="text-xs uppercase tracking-luxury text-mayera-olive">← Hair Journal</Link>
          <p className="mt-10 text-xs uppercase tracking-[0.15em] text-mayera-olive">{article.category} · {article.readTime}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{article.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-mayera-espresso/64">{article.excerpt}</p>
        </Container>
      </section>
      <Section>
        <Container>
          <article className="mx-auto max-w-[760px]">
            {paragraphs.map((paragraph) => <p key={paragraph} className="mb-7 font-serif text-xl leading-[1.7] text-mayera-espresso/82 sm:text-2xl">{paragraph}</p>)}
            <div className="mt-12 rounded-[1.75rem] bg-mayera-cream p-7 sm:p-8"><p className="text-xs uppercase tracking-luxury text-mayera-olive">Mayéra note</p><p className="mt-3 text-sm leading-7 text-mayera-espresso/62">Journal content is educational and cosmetic in scope. Medical hair-loss concerns should be assessed by an appropriate healthcare professional.</p></div>
          </article>
        </Container>
      </Section>
    </>
  );
}
