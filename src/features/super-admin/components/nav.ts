export const superAdminNav = [
  { href: "/super-admin", label: "System", icon: "home" },
  { href: "/super-admin/admins", label: "Admins", icon: "users" },
  { href: "/super-admin/roles", label: "Roles", icon: "users" },
  { href: "/super-admin/permissions", label: "Permissions", icon: "fileText" },
  { href: "/super-admin/audit-logs", label: "Audit Logs", icon: "fileText" },
  { href: "/super-admin/payments", label: "Payments", icon: "fileText" },
  { href: "/super-admin/integrations", label: "Integrations", icon: "settings" },
  { href: "/super-admin/webhooks", label: "Webhooks", icon: "fileText" },
  { href: "/super-admin/system-health", label: "System Health", icon: "settings" },
  { href: "/super-admin/sessions", label: "Sessions", icon: "users" },
  { href: "/super-admin/settings", label: "Settings", icon: "settings" }
] as const;
