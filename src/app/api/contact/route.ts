import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin, clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";

const schema=z.object({name:z.string().trim().min(2).max(120),email:z.string().trim().email().transform(value=>value.toLowerCase()),phone:z.string().trim().max(40).optional().or(z.literal("")),subject:z.string().trim().max(160).optional().or(z.literal("")),message:z.string().trim().min(5).max(5000)});

export async function POST(request:NextRequest){try{assertSameOrigin(request);enforceRateLimit(`contact:${clientIp(request)}`,5,60*60*1000);const parsed=schema.safeParse(await request.json());if(!parsed.success)throw new HttpError(400,"Check your contact details and message.");const message=await prisma.contactMessage.create({data:{name:parsed.data.name,email:parsed.data.email,phone:parsed.data.phone||null,subject:parsed.data.subject||null,message:parsed.data.message}});return Response.json({ok:true,reference:message.id},{status:201});}catch(error){return errorResponse(error)}}
