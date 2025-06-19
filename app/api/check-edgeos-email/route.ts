import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, userId, worldcoinId } = await request.json();
    
    // Get user session or use provided identifiers
    const session = await getServerSession();
    const targetWorldcoinId = worldcoinId || (session?.user as any)?.worldcoinId;
    const targetUserId = userId || session?.user?.email;
    
    if (!targetWorldcoinId && !targetUserId) {
      return NextResponse.json(
        { error: 'User identification required' },
        { status: 401 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking if ${email} is part of Edge Esmeralda...`);

    // Get EdgeOS API key from environment
    const edgeosApiKey = process.env.EDGEOS_API_KEY;
    
    if (!edgeosApiKey) {
      console.error('❌ EdgeOS API key not found in environment variables');
      return NextResponse.json(
        { error: 'EdgeOS API not configured' },
        { status: 500 }
      );
    }

    try {
      // Call EdgeOS API to check if email is part of Edge Esmeralda
      const edgeosResponse = await fetch(`https://api-citizen-portal.simplefi.tech/attendees/tickets?email=${email}`, {
        method: 'GET',
        headers: {
          'X-API-Key': edgeosApiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log(`EdgeOS API response status: ${edgeosResponse.status}`);

      if (edgeosResponse.ok) {
        const edgeosData = await edgeosResponse.json();
        console.log('EdgeOS API response:', JSON.stringify(edgeosData, null, 2));

        // Check if user has valid tickets/attendance for Edge Esmeralda
        const isEdgeEsmeralda = Array.isArray(edgeosData) && edgeosData.length > 0 && 
          edgeosData.some(attendee => 
            attendee.popup_city && 
            attendee.popup_city.toLowerCase().includes('edge esmeralda') &&
            attendee.products && 
            attendee.products.length > 0
          );

        console.log(`✅ EdgeOS check result for ${email}: ${isEdgeEsmeralda ? 'VERIFIED' : 'NOT_FOUND'}`);

        // Find user primarily by worldcoinId, fallback to other identifiers
        console.log(`🔍 Looking for user with worldcoinId: ${targetWorldcoinId} or userId: ${targetUserId}`);
        
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              ...(targetWorldcoinId ? [{ worldcoinId: targetWorldcoinId }] : []),
              ...(targetUserId ? [{ id: targetUserId }] : []),
              ...(targetUserId ? [{ email: targetUserId }] : []),
              ...(targetUserId ? [{ username: targetUserId }] : [])
            ]
          }
        });

        if (existingUser) {
          console.log(`🔍 Found user in database: ${existingUser.id} (email: ${existingUser.email})`);
          
          // Use direct SQL to update the database with new column
          const updateResult = await prisma.$executeRaw`
            UPDATE users 
            SET email = ${email}, "EdgeEsmeraldaAtt" = ${isEdgeEsmeralda}, "updatedAt" = NOW()
            WHERE id = ${existingUser.id}
          `;

          console.log(`📝 Updated user database - Email: ${email}, EdgeEsmeralda: ${isEdgeEsmeralda} for user ID: ${existingUser.id}`);
          console.log(`🔢 Database update affected ${updateResult} row(s)`);

          // Verify the update worked by querying the raw database
          const verificationResult = await prisma.$queryRaw`
            SELECT id, email, "EdgeEsmeraldaAtt", "updatedAt" 
            FROM users 
            WHERE id = ${existingUser.id}
          ` as any[];

          if (verificationResult.length > 0) {
            const user = verificationResult[0];
            console.log(`✅ Verification - User record now shows: EdgeEsmeraldaAtt = ${user.EdgeEsmeraldaAtt}, email = ${user.email}`);
          }
        } else {
          console.log(`⚠️ User not found with worldcoinId: ${targetWorldcoinId} or userId: ${targetUserId}`);
        }

        return NextResponse.json({
          success: true,
          email: email,
          isEdgeEsmeralda: isEdgeEsmeralda,
          edgeosData: edgeosData
        });

      } else {
        console.log(`⚠️ EdgeOS API returned ${edgeosResponse.status} - treating as not found`);
        
        // Still update user with email even if not in EdgeOS
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              ...(targetWorldcoinId ? [{ worldcoinId: targetWorldcoinId }] : []),
              ...(targetUserId ? [{ id: targetUserId }] : []),
              ...(targetUserId ? [{ email: targetUserId }] : []),
              ...(targetUserId ? [{ username: targetUserId }] : [])
            ]
          }
        });

        if (existingUser) {
          const updateResult = await prisma.$executeRaw`
            UPDATE users 
            SET email = ${email}, "EdgeEsmeraldaAtt" = ${false}, "updatedAt" = NOW()
            WHERE id = ${existingUser.id}
          `;
          console.log(`📝 Updated user database - Email: ${email}, EdgeEsmeralda: false for user ID: ${existingUser.id}`);
          console.log(`🔢 Database update affected ${updateResult} row(s)`);
          
          // Verify the update
          const verificationResult = await prisma.$queryRaw`
            SELECT "EdgeEsmeraldaAtt", email FROM users WHERE id = ${existingUser.id}
          ` as any[];
          
          if (verificationResult.length > 0) {
            console.log(`✅ Verification - EdgeEsmeraldaAtt = ${verificationResult[0].EdgeEsmeraldaAtt}`);
          }
        }
        
        return NextResponse.json({
          success: true,
          email: email,
          isEdgeEsmeralda: false,
          message: 'Email not found in Edge Esmeralda attendee list'
        });
      }

    } catch (edgeosError) {
      console.error('❌ EdgeOS API call failed:', edgeosError);
      
      // Still update user with email even if EdgeOS API fails
      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              ...(targetWorldcoinId ? [{ worldcoinId: targetWorldcoinId }] : []),
              ...(targetUserId ? [{ id: targetUserId }] : []),
              ...(targetUserId ? [{ email: targetUserId }] : []),
              ...(targetUserId ? [{ username: targetUserId }] : [])
            ]
          }
        });

        if (existingUser) {
          const updateResult = await prisma.$executeRaw`
            UPDATE users 
            SET email = ${email}, "EdgeEsmeraldaAtt" = ${false}, "updatedAt" = NOW()
            WHERE id = ${existingUser.id}
          `;
          console.log(`📝 Updated user database - Email: ${email}, EdgeEsmeralda: false (API error) for user ID: ${existingUser.id}`);
          console.log(`🔢 Database update affected ${updateResult} row(s)`);
          
          // Verify the update
          const verificationResult = await prisma.$queryRaw`
            SELECT "EdgeEsmeraldaAtt", email FROM users WHERE id = ${existingUser.id}
          ` as any[];
          
          if (verificationResult.length > 0) {
            console.log(`✅ Verification - EdgeEsmeraldaAtt = ${verificationResult[0].EdgeEsmeraldaAtt}`);
          }
        }
      } catch (dbError) {
        console.error('❌ Database update failed:', dbError);
      }
      
      return NextResponse.json({
        success: true,
        email: email,
        isEdgeEsmeralda: false,
        message: 'Could not verify with EdgeOS - continuing with regular flow',
        error: 'EdgeOS API unavailable'
      });
    }

  } catch (error) {
    console.error('❌ Error in EdgeOS email check:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check email', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 