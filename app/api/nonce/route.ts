import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  // Generate nonce (at least 8 alphanumeric characters)
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // Store nonce in cookies
  cookies().set("siwe", nonce, { 
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  });

  return NextResponse.json({ nonce });
} 