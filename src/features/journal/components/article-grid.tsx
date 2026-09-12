import Link from "next/link";
import type { JournalArticle } from "@/data/articles";

export function ArticleGrid({ articles }: { articles: JournalArticle[] }) {
  return (
    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <Link key={article.slug} href={`/hair-journal/${article.slug}`} className="group overflow-hidden rounded-[1.75rem] border border-mayera-line bg-white/55 transition hover:-translate-y-1 hover:shadow-card">
          <div className={`relative h-64 ${index === 0 ? "bg-[#ded5c8]" : index === 1 ? "bg-[#d2cfb5]" : "bg-[#e6d9ca]"}`}>
            <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "url('/brand/patterns/mayera-botanical.svg')", backgroundPosition: "right bottom", backgroundRepeat: "no-repeat", backgroundSize: "60% auto" }} />
          </div>
          <div className="p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.14em] text-mayera-olive">{article.category} · {article.readTime}</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight group-hover:text-mayera-amber">{article.title}</h2>
            <p className="mt-3 text-sm leading-7 text-mayera-espresso/60">{article.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
