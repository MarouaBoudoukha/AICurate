import { NextRequest, NextResponse } from 'next/server';
import { ActivityType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const minimal = url.searchParams.get('minimal') === 'true';
    
    if (minimal) {
      // Fast minimal profile data for initial load
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          isVerified: true,
          worldcoinId: true,
          region: true,
          interests: true,
          experienceLevel: true,
          proofPoints: true,
          level: true,
          preferences: true,
          hasCompletedQuiz: true,
          createdAt: true,
          lastActiveAt: true,
          // Only fetch quiz results, not the heavy relations
          userQuizResults: {
            select: {
              questionId: true,
              answer: true,
              answeredAt: true
            },
            orderBy: { answeredAt: 'desc' }
          }
        }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Quick counts for stats without fetching full data
      const [sessionCount, badgeCount] = await Promise.all([
        prisma.agentSession.count({ where: { userId: id } }),
        prisma.badgeMint.count({ where: { userId: id } })
      ]);

      const quizData = processQuizResults(user.userQuizResults);
      
      const minimalProfile = {
        ...user,
        quizProfile: quizData,
        profileCompletion: calculateProfileCompletion(user, quizData),
        stats: {
          totalSessions: sessionCount,
          totalBadges: badgeCount,
          quizCompleted: user.hasCompletedQuiz,
          joinDate: user.createdAt,
          lastActive: user.lastActiveAt
        }
      };

      const response = NextResponse.json(minimalProfile);
      // Cache for 30 seconds for minimal profile
      response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
      return response;
    }
    
    // Full profile data for when needed
    const user = await prisma.user.findUnique({
      where: { id },
      include: { 
        agentSessions: {
          select: {
            id: true,
            createdAt: true,
            completed: true,
            proofPointsEarned: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        userQuizResults: {
          select: {
            questionId: true,
            answer: true,
            answeredAt: true
          },
          orderBy: { answeredAt: 'desc' }
        },
        badgeMints: {
          select: {
            id: true,
            badgeName: true,
            mintedAt: true,
            transactionId: true,
            status: true
          },
          orderBy: { mintedAt: 'desc' },
          take: 10
        },
        userActivities: {
          select: {
            id: true,
            activityType: true,
            description: true,
            createdAt: true,
            proofPointsEarned: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const quizData = processQuizResults(user.userQuizResults);
    
    const enhancedProfile = {
      ...user,
      quizProfile: quizData,
      profileCompletion: calculateProfileCompletion(user, quizData),
      stats: {
        totalSessions: user.agentSessions.length,
        totalBadges: user.badgeMints.length,
        quizCompleted: user.hasCompletedQuiz,
        joinDate: user.createdAt,
        lastActive: user.lastActiveAt
      }
    };

    const response = NextResponse.json(enhancedProfile);
    // Cache for 60 seconds for full profile
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
} 

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Separate different types of updates
    const { preferences, avatar, bio, interests, ...directFields } = body;
    
    // Prepare update data
    const updateData: any = {
      ...directFields,
      updatedAt: new Date(),
    };

    // Handle preferences update (merge with existing)
    if (preferences) {
      const currentUser = await prisma.user.findUnique({
        where: { id },
        select: { preferences: true }
      });
      
      updateData.preferences = {
        ...(currentUser?.preferences as object || {}),
        ...preferences
      };
    }

    // Handle bio update
    if (bio !== undefined) {
      updateData.bio = bio;
    }

    // Handle interests array update
    if (interests !== undefined) {
      updateData.interests = interests;
    }

    // Handle avatar update
    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // Update user in database - minimal includes for faster response
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        isVerified: true,
        worldcoinId: true,
        region: true,
        interests: true,
        experienceLevel: true,
        proofPoints: true,
        level: true,
        preferences: true,
        hasCompletedQuiz: true,
        createdAt: true,
        lastActiveAt: true,
        updatedAt: true,
        userQuizResults: {
          select: {
            questionId: true,
            answer: true,
            answeredAt: true
          },
          orderBy: { answeredAt: 'desc' }
        }
      }
    });

    // Log the profile update activity (async, don't wait)
    prisma.userActivity.create({
      data: {
        userId: id,
        activityType: 'PROFILE_UPDATED',
        description: 'Profile information updated',
        metadata: {
          updatedFields: Object.keys(body),
          timestamp: new Date().toISOString()
        }
      }
    }).catch(err => console.error('Failed to log activity:', err));

    // Quick counts for stats
    const [sessionCount, badgeCount] = await Promise.all([
      prisma.agentSession.count({ where: { userId: id } }),
      prisma.badgeMint.count({ where: { userId: id } })
    ]);

    // Process quiz data for response
    const quizData = processQuizResults(updatedUser.userQuizResults);
    
    const enhancedProfile = {
      ...updatedUser,
      quizProfile: quizData,
      profileCompletion: calculateProfileCompletion(updatedUser, quizData),
      stats: {
        totalSessions: sessionCount,
        totalBadges: badgeCount,
        quizCompleted: updatedUser.hasCompletedQuiz,
        joinDate: updatedUser.createdAt,
        lastActive: updatedUser.lastActiveAt
      }
    };

    return NextResponse.json(enhancedProfile);
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// Helper function to process quiz results into meaningful profile data
function processQuizResults(quizResults: any[]) {
  const processedData: any = {};
  
  quizResults.forEach(result => {
    const questionId = result.questionId;
    const answer = result.answer;
    
    // Store raw answer
    processedData[questionId] = answer;
    
    // Process specific question types for easier access
    switch (questionId) {
      case 'interests':
        processedData.userInterests = Array.isArray(answer) ? answer : [answer];
        break;
      case 'location':
        processedData.userLocation = answer;
        break;
      case 'age':
        processedData.userAge = answer;
        break;
      case 'platforms':
        processedData.preferredPlatforms = Array.isArray(answer) ? answer : [answer];
        break;
      case 'tasks':
        processedData.aiTasks = Array.isArray(answer) ? answer : [answer];
        break;
      case 'comfort':
        processedData.aiComfortLevel = answer;
        break;
      case 'budget':
        processedData.aiBudget = answer;
        break;
    }
  });
  
  return processedData;
}

// Helper function to calculate profile completion percentage
function calculateProfileCompletion(user: any, quizData: any) {
  const fields = [
    user.name,
    user.username,
    user.bio,
    user.avatar,
    quizData.userInterests?.length > 0,
    quizData.userLocation,
    quizData.userAge,
    quizData.aiComfortLevel,
    quizData.aiBudget,
    user.preferences?.language
  ];
  
  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
} 