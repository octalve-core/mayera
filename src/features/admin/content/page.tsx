import { PortalPageHeading } from "@/components/portal/page-heading";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/server/auth/permissions";
import { requirePagePermission } from "@/server/auth/session";
import { saveContent } from "../actions";

const modules = [
  "announcement.bar",
  "homepage.hero",
  "homepage.featured-product",
  "hair.philosophy",
  "ingredients.introduction",
  "our-story.introduction",
  "contact.faq",
  "navigation.footer",
  "seo.defaults"
] as const;

const guidance: Record<(typeof modules)[number], string> = {
  "announcement.bar": "Short site-wide announcement text.",
  "homepage.hero": "Homepage hero supporting paragraph.",
  "homepage.featured-product": "Featured-product section introduction.",
  "hair.philosophy": "Hair philosophy section introduction.",
  "ingredients.introduction": "Ingredients section introduction.",
  "our-story.introduction": "Our Story introduction.",
  "contact.faq": "One FAQ per line in the exact format: Question | Answer",
  "navigation.footer": "Short brand statement shown in the footer.",
  "seo.defaults": "Default search and social description; use plain text only."
};

export default async function AdminContentPage() {
  await requirePagePermission(permissions.contentRead);
  const records = await prisma.pageContent.findMany({ where: { key: { in: [...modules] } } });
  const byKey = new Map(records.map((record) => [record.key, record]));
  return <>
    <PortalPageHeading eyebrow="CMS" title="Content" description="Structured draft-and-publish fields preserve the design while allowing controlled editorial updates." />
    <div className="mt-7 grid gap-4 md:grid-cols-2">
      {modules.map((key) => {
        const record = byKey.get(key);
        const draft = record?.draft as { content?: string } | undefined;
        return <form key={key} action={saveContent} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5">
          <input type="hidden" name="key" value={key} />
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-xl">{key.replaceAll(".", " · ")}</h2>
            <span className="rounded-full bg-mayera-cream px-3 py-1 text-[10px]">{record?.status ?? "NOT SET"}</span>
          </div>
          <p id={`${key}-guidance`} className="mt-2 text-xs leading-5 text-mayera-espresso/50">{guidance[key]}</p>
          <textarea name="content" required rows={5} defaultValue={draft?.content ?? ""} aria-describedby={`${key}-guidance`} className="mt-4 w-full rounded-xl border border-mayera-line bg-white p-3 text-sm" />
          <label className="mt-3 flex gap-2 text-xs"><input type="checkbox" name="publish" />Publish this saved version</label>
          <button className="mt-4 rounded-full bg-mayera-espresso px-5 py-2.5 text-xs text-white">Save content</button>
        </form>;
      })}
    </div>
  </>;
}
