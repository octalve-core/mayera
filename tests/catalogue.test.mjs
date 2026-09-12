import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/data/products.ts", "utf8");
const categories = readFileSync("src/data/categories.ts", "utf8");

function productSegment(id, nextId) {
  const start = source.indexOf(`id: "${id}"`);
  assert.notEqual(start, -1, `${id} is missing`);
  const end = nextId ? source.indexOf(`id: "${nextId}"`, start) : source.indexOf("\n];", start);
  assert.notEqual(end, -1, `could not delimit ${id}`);
  return source.slice(start, end);
}

test("the storefront catalogue contains exactly the four requested products", () => {
  assert.equal((source.match(/^\s+id: "/gm) ?? []).length, 4);
  const expectations = [
    ["mayera-oil-100", "Hair Oil", "/images/products/hair-oil.png"],
    ["mayera-butter-200", "Hair Butter", "/images/products/hair-butter.png"],
    ["mayera-mask-150", "Hair Mask", "/images/products/hair-mask.png"],
    ["mayera-hair-bundle", "Hair Bundle", "/images/products/hair-bundle.png"]
  ];
  for (const [id, name, path] of expectations) {
    assert.match(source, new RegExp(`id: "${id}"[\\s\\S]*?shortName: "${name}"[\\s\\S]*?imageUrl: "${path.replaceAll("/", "\\/")}"`));
  }
});

test("current launch catalogue prices are sellable", () => {
  const expectations = [
    ["mayera-oil-100", "mayera-butter-200", 9500],
    ["mayera-butter-200", "mayera-mask-150", 9500],
    ["mayera-mask-150", "mayera-hair-bundle", 7500],
    ["mayera-hair-bundle", undefined, 25000],
  ];

  for (const [id, nextId, price] of expectations) {
    const item = productSegment(id, nextId);
    assert.match(item, new RegExp(`price: ${price}`));
    assert.match(item, /priceAvailable: true/);
    assert.match(item, /availability: "available"/);
  }
});

test("all requested future catalogue groups are defined for the live catalogue", () => {
  const required = [
    "Hair", "Haircare", "Long Hair", "Best Seller Haircare", "Skincare",
    "Best Seller Skin Care", "Body Care", "Eye Care", "Lip Care", "Weightloss",
    "Diet Plan", "Tea", "Spa Product", "Shop by Concern", "Best Seller", "Deal of the Week"
  ];
  for (const name of required) assert.match(categories, new RegExp(`name: "${name}"`));
  assert.match(categories, /parentSlug:/);
});

test("one-time live initialization uses the exact catalogue and starts with no guessed stock", () => {
  const initializer = readFileSync("src/server/setup/launch-data.ts", "utf8");
  assert.match(initializer, /from "@\/data\/products"/);
  assert.match(initializer, /from "@\/data\/categories"/);
  assert.match(initializer, /for \(const item of products\)/);
  assert.match(initializer, /available: 0/);
  assert.doesNotMatch(initializer, /INITIAL_STOCK/);
});

test("public pages use bundled data only for recoverable local database failures", () => {
  const catalogue = readFileSync("src/server/catalog/public.ts", "utf8");
  const publicRead = readFileSync("src/server/database/public-read.ts", "utf8");
  assert.match(catalogue, /activateBundledPublicFallback/);
  assert.match(catalogue, /fallbackProductList/);
  assert.match(publicRead, /process\.env\.NODE_ENV !== "production"/);
  assert.match(publicRead, /PrismaClientInitializationError/);
  assert.match(publicRead, /developmentDatabaseUnavailable = true/);
  assert.doesNotMatch(publicRead, /name\.startsWith\("PrismaClient"\)/);
});
