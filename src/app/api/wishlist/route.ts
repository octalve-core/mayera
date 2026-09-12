import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/server/auth/session";
import { assertSameOrigin, clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";
const schema=z.object({productId:z.string().min(1).max(100)});
export async function POST(request:NextRequest){try{assertSameOrigin(request);enforceRateLimit(`wishlist:${clientIp(request)}`,60,15*60*1000);const session=await getCurrentSession();if(!session)throw new HttpError(401,"Sign in to save products.");const parsed=schema.safeParse(await request.json());if(!parsed.success)throw new HttpError(400,"Invalid product.");const product=await prisma.product.findUnique({where:{id:parsed.data.productId},select:{id:true}});if(!product)throw new HttpError(404,"Product not found.");const wishlist=await prisma.wishlist.upsert({where:{userId:session.user.id},create:{userId:session.user.id},update:{}});const existing=await prisma.wishlistItem.findUnique({where:{wishlistId_productId:{wishlistId:wishlist.id,productId:product.id}}});if(existing){await prisma.wishlistItem.delete({where:{id:existing.id}});return Response.json({ok:true,saved:false})}await prisma.wishlistItem.create({data:{wishlistId:wishlist.id,productId:product.id}});return Response.json({ok:true,saved:true})}catch(error){return errorResponse(error)}}
