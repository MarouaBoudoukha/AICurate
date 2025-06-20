import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const debugInfo: {
      timestamp: string;
      email: string;
      environment: {
        hasEdgeosApiKey: boolean;
        nodeEnv: string | undefined;
        vercelEnv: string | undefined;
      };
      tests: {
        edgeosApiKey?: any;
        edgeosApi?: any;
        database?: any;
        edgeUsers?: any;
      };
    } = {
      timestamp: new Date().toISOString(),
      email,
      environment: {
        hasEdgeosApiKey: !!process.env.EDGEOS_API_KEY,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      },
      tests: {}
    };

    // Test 1: Check EdgeOS API Key
    debugInfo.tests.edgeosApiKey = {
      exists: !!process.env.EDGEOS_API_KEY,
      length: process.env.EDGEOS_API_KEY ? process.env.EDGEOS_API_KEY.length : 0
    };

    // Test 2: Try EdgeOS API call
    if (process.env.EDGEOS_API_KEY) {
      try {
        const edgeosResponse = await fetch(`https://api-citizen-portal.simplefi.tech/attendees/tickets?email=${email}`, {
          method: 'GET',
          headers: {
            'X-API-Key': process.env.EDGEOS_API_KEY,
            'Content-Type': 'application/json'
          }
        });

        debugInfo.tests.edgeosApi = {
          status: edgeosResponse.status,
          ok: edgeosResponse.ok,
          statusText: edgeosResponse.statusText
        };

        if (edgeosResponse.ok) {
          const data = await edgeosResponse.json();
          debugInfo.tests.edgeosApi.dataReceived = Array.isArray(data);
          debugInfo.tests.edgeosApi.recordCount = Array.isArray(data) ? data.length : 0;
          
          if (Array.isArray(data) && data.length > 0) {
            debugInfo.tests.edgeosApi.sampleRecord = {
              popup_city: data[0].popup_city,
              hasProducts: !!data[0].products,
              productCount: data[0].products ? data[0].products.length : 0
            };
            
            // Test the verification logic
            const isEdgeEsmeralda = data.some(attendee => 
              attendee.popup_city && 
              attendee.popup_city.toLowerCase().includes('edge esmeralda') &&
              attendee.products && 
              attendee.products.length > 0
            );
            
            debugInfo.tests.edgeosApi.isEdgeEsmeraldaVerified = isEdgeEsmeralda;
          }
        } else {
          const errorText = await edgeosResponse.text();
          debugInfo.tests.edgeosApi.errorText = errorText;
        }
      } catch (error) {
        debugInfo.tests.edgeosApi = {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        };
      }
    }

    // Test 3: Database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
      debugInfo.tests.database = { connected: true };
    } catch (error) {
      debugInfo.tests.database = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 4: Check if there are any users with EdgeEsmeraldaAtt = true
    try {
      const edgeUsers = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM users WHERE "EdgeEsmeraldaAtt" = true
      ` as any[];
      
      debugInfo.tests.edgeUsers = {
        totalVerifiedUsers: edgeUsers[0]?.count || 0
      };
    } catch (error) {
      debugInfo.tests.edgeUsers = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return NextResponse.json(debugInfo);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, userId, worldcoinId, forceEdgeEsmeralda } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // For testing: allow forcing EdgeEsmeralda status
    if (forceEdgeEsmeralda) {
      try {
        // Find user
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              ...(worldcoinId ? [{ worldcoinId }] : []),
              ...(userId ? [{ id: userId }] : []),
              ...(userId ? [{ email: userId }] : [])
            ]
          }
        });

        if (existingUser) {
          await prisma.$executeRaw`
            UPDATE users 
            SET email = ${email}, "EdgeEsmeraldaAtt" = ${true}, "updatedAt" = NOW()
            WHERE id = ${existingUser.id}
          `;

          return NextResponse.json({
            success: true,
            message: 'User forcefully set as EdgeEsmeralda verified',
            userId: existingUser.id,
            isEdgeEsmeralda: true
          });
        } else {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
      } catch (error) {
        return NextResponse.json({
          error: 'Failed to force EdgeEsmeralda status',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'No action specified' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug POST failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 