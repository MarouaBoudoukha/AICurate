import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user's current subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        status: {
          in: ['TRIAL', 'ACTIVE', 'PAST_DUE']
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    // Fetch user's subscription status from User model
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionStatus: true,
        subscriptionEndDate: true
      }
    });

    // Mock payment methods for now (would integrate with Stripe/payment provider)
    const paymentMethods = subscription ? [
      {
        id: 'pm_1234567890',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      }
    ] : [];

    const subscriptionData = subscription || {
      plan: user?.subscriptionStatus || 'FREE',
      status: user?.subscriptionStatus || 'FREE',
      billingCycle: 'MONTHLY',
      amount: 0,
      startDate: new Date().toISOString(),
      endDate: user?.subscriptionEndDate?.toISOString() || null,
      renewalDate: user?.subscriptionEndDate?.toISOString() || null
    };

    return NextResponse.json({
      subscription: subscriptionData,
      paymentMethods
    });

  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 