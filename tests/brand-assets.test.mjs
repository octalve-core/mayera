import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const assets = new Map([
  ["public/brand/logo/mayera-logo.png", "d168506d84fb28d60fd576cfc07bea849ff137e9d3f615a0e31ac5dedc4b1166"],
  ["public/images/products/hair-oil.png", "9a52905221327ead866641b1edadc73dae0ebdaedddf527811cc6021d74a3446"],
  ["public/images/products/hair-butter.png", "679290b1d565e0e7d7ec281597e4026b23544db0ee4e094a34819392e205537f"],
  ["public/images/products/hair-mask.png", "15059f704432548362ea7025c49bb1b2f761326e6f9aa12a41e94ba646b79545"],
  ["public/images/products/hair-bundle.png", "7537e225bec30183d5f4b46729f1b3c646b29de36d83cf6527d1207d2a884e38"]
]);

test("the exact supplied Mayéra logo and product images remain unchanged", () => {
  for (const [path, expected] of assets) {
    assert.ok(existsSync(path), `${path} is missing`);
    const actual = createHash("sha256").update(readFileSync(path)).digest("hex");
    assert.equal(actual, expected, `${path} was modified`);
  }
});

test("product cards render image assets instead of a code-drawn pack", () => {
  assert.equal(existsSync("src/components/commerce/product-visual.tsx"), false);
  const card = readFileSync("src/components/commerce/product-card.tsx", "utf8");
  const image = readFileSync("src/components/commerce/product-image.tsx", "utf8");
  assert.match(card, /<ProductImage/);
  assert.match(image, /from "next\/image"/);
});
