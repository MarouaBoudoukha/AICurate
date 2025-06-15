import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'
import { prisma } from '@/lib/prisma'

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
  email?: string
  username?: string
}

export const POST = async (req: NextRequest) => {
  try {
    const { payload, nonce, email, username } = (await req.json()) as IRequestPayload
    
    console.log("Received SIWE verification request:", { 
      nonce, 
      address: payload.address,
      email,
      username 
    });
    
    const cookieStore = await cookies()
    const storedNonce = cookieStore.get('siwe')?.value
    if (nonce !== storedNonce) {
      console.error("Nonce mismatch:", { received: nonce, stored: storedNonce });
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid nonce'
      }, { status: 401 })
    }

    try {
      const validMessage = await verifySiweMessage(payload, nonce)
      console.log("SIWE message validation result:", validMessage);
      
      if (!validMessage.isValid) {
        return NextResponse.json({
          status: 'error',
          isValid: false,
          message: 'Invalid signature'
        }, { status: 400 })
      }

      // Clear the nonce cookie after successful verification
      cookieStore.delete('siwe');

      // Create or update user in database with wallet address
      const walletAddress = payload.address.toLowerCase()
      
      // Use a separate field for wallet-based users to avoid conflicts with World ID users
      const existingUser = await prisma.user.findFirst({
        where: { 
          OR: [
            { worldcoinId: walletAddress },
            { email: walletAddress } // Using email field temporarily for wallet address
          ]
        }
      })

      let user
      if (!existingUser) {
        // Create new user with wallet address
        // Prioritize MiniKit username, then email, then wallet address format
        const displayName = (username && username.trim() !== '') 
          ? username 
          : (email && email.trim() !== '') 
            ? email 
            : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        
        user = await prisma.user.create({
          data: {
            worldcoinId: walletAddress,
            name: displayName,
            username: displayName,
            email: email || walletAddress, // Store email if provided, otherwise wallet address
            isVerified: true,
            userType: "INDIVIDUAL",
            experienceLevel: "BEGINNER",
            interests: [],
            proofPoints: 0,
            level: 1,
            badges: [],
            streak: 0,
            subscriptionStatus: "FREE",
            trialUsed: false,
            onboardingCompleted: false,
          }
        })
        console.log("Wallet user created:", user.id, "with name:", displayName)
      } else {
        // Update existing user
        const updateData: any = {
          lastLoginAt: new Date(),
          lastActiveAt: new Date(),
        }
        
        // Update username if provided from MiniKit and it's different from current
        if (username && username.trim() !== '' && username !== existingUser.username) {
          updateData.name = username
          updateData.username = username
          console.log("Updating username from", existingUser.username, "to", username)
        }
        
        // Update email if provided and different from current
        if (email && email.trim() !== '' && email !== existingUser.email) {
          updateData.email = email
          console.log("Updating email from", existingUser.email, "to", email)
        }
        
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: updateData
        })
        console.log("Wallet user updated:", user.id)
      }

      return NextResponse.json({
        status: 'success',
        isValid: true,
        address: payload.address,
        user: {
          id: user.id,
          name: user.name,
          isVerified: user.isVerified
        }
      })
    } catch (error: any) {
      console.error('SIWE validation error:', error)
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: error.message
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('SIWE endpoint error:', error)
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
} 