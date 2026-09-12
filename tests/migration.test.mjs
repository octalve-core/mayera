import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync("prisma/migrations/20260909000000_initial/migration.sql", "utf8");

test("initial migration includes the scalable category and email queue fields", () => {
  assert.match(migration, /CREATE TABLE "Category"[\s\S]*?"parentId" TEXT/);
  assert.match(migration, /CREATE INDEX "Category_parentId_active_sortOrder_idx"/);
  assert.match(migration, /CONSTRAINT "Category_parentId_fkey"/);
  assert.match(migration, /CREATE TABLE "EmailMessage"[\s\S]*?"dedupeKey" TEXT/);
  assert.match(migration, /CREATE UNIQUE INDEX "EmailMessage_dedupeKey_key"/);
});

test("database audit records are append-only", () => {
  assert.match(migration, /prevent_audit_log_mutation/);
  assert.match(migration, /AuditLog_prevent_update/);
  assert.match(migration, /AuditLog_prevent_delete/);
});
