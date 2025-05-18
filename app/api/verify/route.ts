import { NextResponse } from "next/server";
import { verifyCloudProof, IVerifyResponse } from "@worldcoin/minikit-js";

export async function POST(req: Request) {
  try {
    console.log("=== New Verification Request ===");
    
    // Log request headers
    const headers = Object.fromEntries(req.headers.entries());
    console.log("Request headers:", headers);

    const { payload, action } = await req.json();
    console.log("Request body:", {
      payload: JSON.stringify(payload, null, 2),
      action
    });

    // Log environment variables
    console.log("Environment check:", {
      hasAppId: !!process.env.APP_ID,
      appIdValue: process.env.APP_ID,
      hasClientId: !!process.env.WLD_CLIENT_ID,
      hasClientSecret: !!process.env.WLD_CLIENT_SECRET,
      nodeEnv: process.env.NODE_ENV
    });

    if (!process.env.APP_ID) {
      console.error("APP_ID not found in environment variables");
      return NextResponse.json(
        { error: "APP_ID not configured" },
        { status: 500 }
      );
    }

    console.log("Starting verification with:", {
      payloadType: typeof payload,
      payloadKeys: payload ? Object.keys(payload) : null,
      action
    });

    const verifyResult = await verifyCloudProof(
      payload,
      process.env.APP_ID as `app_${string}`,
      action
    );

    console.log("Verification result:", JSON.stringify(verifyResult, null, 2));

    if (!verifyResult.success) {
      console.error("Verification failed:", verifyResult);

      // Handle specific error cases
      if (verifyResult.code === 'max_verifications_reached') {
        return NextResponse.json(
          { 
            success: false, 
            error: "Already verified",
            message: "You have already verified your World ID for this action",
            code: verifyResult.code
          },
          { status: 409 } // Using 409 Conflict for already-verified case
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: "Verification failed",
          details: verifyResult
        },
        { status: 400 }
      );
    }

    console.log("Verification successful!");
    return NextResponse.json(
      { status: 200, message: "Verification successful" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in verification:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      error: JSON.stringify(error, null, 2)
    });
    
    return NextResponse.json(
      { 
        error: "Failed to verify proof",
        details: {
          message: error?.message,
          type: error?.name,
          error: JSON.stringify(error)
        }
      },
      { status: 500 }
    );
  }
}
