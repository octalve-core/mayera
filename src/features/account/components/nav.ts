import { HomeIcon, PackageIcon, MapPinIcon, UserIcon, HeartIcon, FileTextIcon, SettingsIcon, MailIcon } from "@/components/ui/icons";
export const accountNav = [
  { href: "/account", label: "Overview", icon: HomeIcon },
  { href: "/account/orders", label: "Orders", icon: PackageIcon },
  { href: "/account/addresses", label: "Addresses", icon: MapPinIcon },
  { href: "/account/wishlist", label: "Wishlist", icon: HeartIcon },
  { href: "/account/reviews", label: "Reviews", icon: FileTextIcon },
  { href: "/account/support", label: "Support", icon: MailIcon },
  { href: "/account/profile", label: "Profile", icon: UserIcon },
  { href: "/account/privacy", label: "Privacy", icon: SettingsIcon }
];
