"use client";
import { products } from "@/data/products";
import { useCart } from "@/features/cart/cart-provider";
export function BuyAgainButton({items}:{items:Array<{sku:string;quantity:number}>}){const {addItem}=useCart();const available=items.map(item=>({item,product:products.find(product=>product.sku===item.sku&&product.availability==="available")})).filter(entry=>entry.product);return <button type="button" disabled={!available.length} onClick={()=>available.forEach(({item,product})=>product&&addItem(product,item.quantity))} className="rounded-full border border-mayera-line px-5 py-2.5 text-xs disabled:opacity-40">Buy again</button>}
