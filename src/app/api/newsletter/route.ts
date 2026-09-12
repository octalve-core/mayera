import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";

const schema=z.object({email:z.string().trim().email().transform(value=>value.toLowerCase()),consent:z.literal(true),source:z.string().trim().max(80).optional()});
export async function POST(request:NextRequest){try{assertSameOrigin(request);enforceRateLimit(`newsletter:${clientIp(request)}`,8,60*60*1000);const parsed=schema.safeParse(await request.json());if(!parsed.success)throw new HttpError(400,"Enter a valid email address and confirm consent.");await prisma.newsletterSubscriber.upsert({where:{email:parsed.data.email},create:{email:parsed.data.email,consent:true,source:parsed.data.source??"website"},update:{consent:true,unsubscribedAt:null,source:parsed.data.source??"website"}});return Response.json({ok:true});}catch(error){return errorResponse(error)}}
