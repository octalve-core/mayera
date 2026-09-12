import { HomeIcon, UsersIcon, FileTextIcon, SettingsIcon } from "@/components/ui/icons";
export const superAdminNav = [
  { href: "/super-admin", label: "System", icon: HomeIcon },
  { href: "/super-admin/admins", label: "Admins", icon: UsersIcon },
  { href: "/super-admin/roles", label: "Roles", icon: UsersIcon },
  { href: "/super-admin/permissions", label: "Permissions", icon: FileTextIcon },
  { href: "/super-admin/audit-logs", label: "Audit Logs", icon: FileTextIcon },
  { href: "/super-admin/payments", label: "Payments", icon: FileTextIcon },
  { href: "/super-admin/integrations", label: "Integrations", icon: SettingsIcon },
  { href: "/super-admin/webhooks", label: "Webhooks", icon: FileTextIcon },
  { href: "/super-admin/system-health", label: "System Health", icon: SettingsIcon },
  { href: "/super-admin/sessions", label: "Sessions", icon: UsersIcon },
  { href: "/super-admin/settings", label: "Settings", icon: SettingsIcon }
];
