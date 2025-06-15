import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Generate nonce (at least 8 alphanumeric characters)
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // Store nonce in cookies with proper expiration
  const cookieStore = await cookies()
  cookieStore.set("siwe", nonce, { 
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 15 // 15 minutes expiration - ADDED THIS
  });

  return NextResponse.json({ nonce });
} 