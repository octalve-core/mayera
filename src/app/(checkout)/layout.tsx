import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ShieldIcon } from "@/components/ui/icons";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mayera-paper">
      <header className="border-b border-mayera-line bg-mayera-paper">
        <div className="mx-auto flex h-[82px] w-full max-w-[1180px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/"><BrandLogo className="w-[145px]" /></Link>
          <div className="flex items-center gap-2 text-xs text-mayera-espresso/55"><ShieldIcon className="h-4 w-4 text-mayera-olive" /> Secure checkout</div>
        </div>
      </header>
      {children}
    </div>
  );
}
