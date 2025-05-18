import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export const POST = async (req: NextRequest) => {
  try {
    const { payload, nonce } = (await req.json()) as IRequestPayload
    const storedNonce = cookies().get('siwe')?.value

    if (nonce !== storedNonce) {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid nonce'
      }, { status: 401 })
    }

    try {
      const validMessage = await verifySiweMessage(payload, nonce)
      return NextResponse.json({
        status: 'success',
        isValid: validMessage.isValid,
        address: payload.address
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