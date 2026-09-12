import { HomeIcon, PackageIcon, BoxIcon, UsersIcon, FileTextIcon, SettingsIcon } from "@/components/ui/icons";
import { permissions } from "@/server/auth/permissions";
export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon, permission: permissions.dashboardView },
  { href: "/admin/products", label: "Products", icon: PackageIcon, permission: permissions.productsRead },
  { href: "/admin/categories", label: "Categories", icon: FileTextIcon, permission: permissions.productsRead },
  { href: "/admin/orders", label: "Orders", icon: BoxIcon, permission: permissions.ordersRead },
  { href: "/admin/inventory", label: "Inventory", icon: SettingsIcon, permission: permissions.inventoryRead },
  { href: "/admin/customers", label: "Customers", icon: UsersIcon, permission: permissions.customersRead },
  { href: "/admin/support", label: "Support", icon: FileTextIcon, permission: permissions.customersRead },
  { href: "/admin/discounts", label: "Discounts", icon: SettingsIcon, permission: permissions.discountsRead },
  { href: "/admin/reviews", label: "Reviews", icon: FileTextIcon, permission: permissions.reviewsRead },
  { href: "/admin/content", label: "Content", icon: FileTextIcon, permission: permissions.contentRead },
  { href: "/admin/media", label: "Media", icon: FileTextIcon, permission: permissions.mediaRead },
  { href: "/admin/journal", label: "Journal", icon: FileTextIcon, permission: permissions.journalRead },
  { href: "/admin/analytics", label: "Analytics", icon: SettingsIcon, permission: permissions.analyticsRead },
  { href: "/admin/delivery", label: "Delivery", icon: BoxIcon, permission: permissions.settingsRead },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon, permission: permissions.settingsRead }
];
