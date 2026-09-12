import { permissions } from "@/server/auth/permissions";
export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "home", permission: permissions.dashboardView },
  { href: "/admin/products", label: "Products", icon: "package", permission: permissions.productsRead },
  { href: "/admin/categories", label: "Categories", icon: "fileText", permission: permissions.productsRead },
  { href: "/admin/orders", label: "Orders", icon: "box", permission: permissions.ordersRead },
  { href: "/admin/inventory", label: "Inventory", icon: "settings", permission: permissions.inventoryRead },
  { href: "/admin/customers", label: "Customers", icon: "users", permission: permissions.customersRead },
  { href: "/admin/support", label: "Support", icon: "fileText", permission: permissions.customersRead },
  { href: "/admin/discounts", label: "Discounts", icon: "settings", permission: permissions.discountsRead },
  { href: "/admin/reviews", label: "Reviews", icon: "fileText", permission: permissions.reviewsRead },
  { href: "/admin/content", label: "Content", icon: "fileText", permission: permissions.contentRead },
  { href: "/admin/media", label: "Media", icon: "fileText", permission: permissions.mediaRead },
  { href: "/admin/journal", label: "Journal", icon: "fileText", permission: permissions.journalRead },
  { href: "/admin/analytics", label: "Analytics", icon: "settings", permission: permissions.analyticsRead },
  { href: "/admin/delivery", label: "Delivery", icon: "box", permission: permissions.settingsRead },
  { href: "/admin/settings", label: "Settings", icon: "settings", permission: permissions.settingsRead }
] as const;
