import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { Container } from "@/components/ui/container";
import { getPublishedText } from "@/server/content/public";

const groups = [
  {
    title: "Shop",
    links: [
      ["Hair", "/hair"],
      ["All products", "/shop"],
      ["Bundles", "/products/hair-care-bundle"],
    ],
  },
  {
    title: "Mayéra",
    links: [
      ["Our story", "/our-story"],
      ["Hair Journal", "/hair-journal"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Help",
    links: [
      ["FAQs", "/contact#faq"],
      ["Delivery", "/contact#delivery"],
      ["Returns", "/contact#returns"],
      ["Track order", "/track-order"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Shipping", "/shipping"],
      ["Returns policy", "/returns"],
    ],
  },
];

export async function Footer() {
  const description = await getPublishedText(
    "navigation.footer",
    "Modern African beauty and hair wellness, beginning with thoughtful care for textured hair.",
  );
  return (
    <footer className="border-t border-mayera-line bg-[#eae2d7] py-14 lg:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            <BrandLogo className="w-[184px]" />
            <p className="mt-6 text-sm leading-7 text-mayera-espresso/65">
              {description}
            </p>
            <p className="mt-8 text-xs uppercase tracking-luxury text-mayera-olive">
              Beauty Lives Naturally
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-mayera-espresso">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-mayera-espresso/62 hover:text-mayera-espresso"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-mayera-espresso/10 pt-7 text-xs text-mayera-espresso/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MAYERA LTD. Nigeria.</p>
          <p>Nourish · Protect · Retain</p>
        </div>
      </Container>
    </footer>
  );
}
