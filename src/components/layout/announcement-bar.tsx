import { getPublishedText } from "@/server/content/public";

export async function AnnouncementBar() {
  const message = await getPublishedText(
    "announcement.bar",
    "Nationwide delivery · Thoughtfully made for textured hair",
  );
  return (
    <div className="bg-mayera-espresso px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.13em] text-white/90">
      {message}
    </div>
  );
}
