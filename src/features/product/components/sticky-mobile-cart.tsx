"use client";
import type {Product} from "@/types/commerce";
import {formatNaira} from "@/lib/money";
import {useCart} from "@/features/cart/cart-provider";
export function StickyMobileCart({product}:{product:Product}){const {addItem}=useCart();if(product.availability!=="available"||!product.priceAvailable||product.price<=0)return null;return <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mayera-line bg-mayera-paper/95 p-3 shadow-[0_-8px_30px_rgba(31,26,23,.08)] backdrop-blur lg:hidden"><div className="mx-auto flex max-w-lg items-center justify-between gap-4"><div><p className="text-xs text-mayera-espresso/50">{product.shortName}</p><p className="text-sm font-semibold">{formatNaira(product.price)}</p></div><button type="button" onClick={()=>addItem(product,1)} className="min-h-11 rounded-full bg-mayera-espresso px-6 text-sm text-white">Add to bag</button></div></div>}
