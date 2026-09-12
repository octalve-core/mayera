import { UserRole } from "@prisma/client";

export const permissions = {
  dashboardView: "dashboard.view",
  productsRead: "products.read",
  productsWrite: "products.write",
  inventoryRead: "inventory.read",
  inventoryWrite: "inventory.write",
  ordersRead: "orders.read",
  ordersWrite: "orders.write",
  refundsWrite: "refunds.write",
  customersRead: "customers.read",
  customersWrite: "customers.write",
  discountsRead: "discounts.read",
  discountsWrite: "discounts.write",
  reviewsRead: "reviews.read",
  reviewsModerate: "reviews.moderate",
  contentRead: "content.read",
  contentWrite: "content.write",
  mediaRead: "media.read",
  mediaWrite: "media.write",
  journalRead: "journal.read",
  journalWrite: "journal.write",
  analyticsRead: "analytics.read",
  settingsRead: "settings.read",
  settingsWrite: "settings.write",
  adminsManage: "admins.manage",
  rolesManage: "roles.manage",
  auditRead: "audit.read",
  paymentsRead: "payments.read",
  integrationsManage: "integrations.manage",
  webhooksRead: "webhooks.read",
  healthRead: "health.read",
  sessionsManage: "sessions.manage",
  systemSettingsManage: "system-settings.manage"
} as const;

export type PermissionKey = (typeof permissions)[keyof typeof permissions];
const all = Object.values(permissions);
const superOnly = new Set<PermissionKey>([
  permissions.adminsManage,
  permissions.rolesManage,
  permissions.integrationsManage,
  permissions.webhooksRead,
  permissions.healthRead,
  permissions.sessionsManage,
  permissions.systemSettingsManage
]);
const commerceAdmin = all.filter((permission) => !superOnly.has(permission));

const rolePermissions: Record<UserRole, PermissionKey[]> = {
  CUSTOMER: [],
  OWNER: all,
  SUPER_ADMIN: all,
  ADMIN: commerceAdmin,
  ORDER_MANAGER: [permissions.dashboardView, permissions.ordersRead, permissions.ordersWrite, permissions.customersRead, permissions.inventoryRead],
  INVENTORY_MANAGER: [permissions.dashboardView, permissions.productsRead, permissions.inventoryRead, permissions.inventoryWrite, permissions.ordersRead],
  CONTENT_MANAGER: [permissions.dashboardView, permissions.productsRead, permissions.contentRead, permissions.contentWrite, permissions.mediaRead, permissions.mediaWrite, permissions.journalRead, permissions.journalWrite, permissions.reviewsRead],
  CUSTOMER_SUPPORT: [permissions.dashboardView, permissions.ordersRead, permissions.customersRead, permissions.customersWrite, permissions.reviewsRead],
  MARKETING: [permissions.dashboardView, permissions.productsRead, permissions.discountsRead, permissions.discountsWrite, permissions.contentRead, permissions.contentWrite, permissions.mediaRead, permissions.journalRead, permissions.analyticsRead],
  ANALYST: [permissions.dashboardView, permissions.productsRead, permissions.inventoryRead, permissions.ordersRead, permissions.customersRead, permissions.discountsRead, permissions.reviewsRead, permissions.contentRead, permissions.journalRead, permissions.analyticsRead, permissions.paymentsRead]
};

export function roleHasPermission(role: UserRole, permission: PermissionKey) {
  return rolePermissions[role].includes(permission);
}

export function permissionsForRole(role: UserRole) {
  return rolePermissions[role];
}

export function isPrivilegedRole(role: UserRole) {
  return role !== UserRole.CUSTOMER;
}

export function isSuperRole(role: UserRole) {
  return role === UserRole.OWNER || role === UserRole.SUPER_ADMIN;
}
