import { NextRequest, NextResponse } from 'next/server';
import { AgentAICurate } from '@/lib/services/AgentAICurate';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check if request has a body
    const body = await request.text();
    if (!body) {
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }

    // Parse JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { input, sessionId, userId, currentStep, messages } = parsedBody;

    // Validate required fields
    if (!input || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: input and userId' },
        { status: 400 }
      );
    }

    // Get OpenAI API key
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Get or create user profile
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamMemberships: {
          include: {
            team: true
          }
        }
      }
    });

    if (!user) {
      // Create a basic user profile
      user = await prisma.user.create({
        data: {
          id: userId,
          name: 'New User',
          experienceLevel: 'BEGINNER',
          interests: ['AI Tools'],
          region: 'Global',
          preferences: {
            useCase: 'personal',
            budget: 'low',
            complexity: 'simple',
            timeframe: 'immediate'
          }
        },
        include: {
          teamMemberships: {
            include: {
              team: true
            }
          }
        }
      });
    }

    // Load existing session or create new one
    let existingSession = null;
    if (sessionId) {
      existingSession = await prisma.agentSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          recommendations: {
            include: {
              tool: true
            }
          }
        }
      });
    }

    // Initialize agent with current step and messages context
    const agent = new AgentAICurate(openAIApiKey, {
      id: user.id,
      name: user.name || 'User',
      userType: user.userType,
      experienceLevel: user.experienceLevel,
      interests: user.interests,
      region: user.region || 'Global',
      preferences: user.preferences as any,
      teamId: user.teamMemberships[0]?.teamId
    }, existingSession || undefined, currentStep || 'intro', messages || []);

    // Process user input with current step context
    const response = await agent.processUserInput(input);

    // Update user's proof points and level if earned
    if (response.data?.proofPointsEarned) {
      const newProofPoints = user.proofPoints + response.data.proofPointsEarned;
      const newLevel = Math.floor(newProofPoints / 100) + 1;

      await prisma.user.update({
        where: { id: userId },
        data: {
          proofPoints: newProofPoints,
          level: newLevel,
          lastActiveAt: new Date()
        }
      });

      // Create activity record
      await prisma.userActivity.create({
        data: {
          userId: userId,
          activityType: response.currentStep === 'COMPLETED' ? 'SESSION_COMPLETE' : 'SESSION_START',
          description: `Agent session: ${response.currentStep}`,
          sessionId: agent.getSessionState().id,
          proofPointsEarned: response.data.proofPointsEarned,
          metadata: {
            step: response.currentStep,
            userType: user.userType
          }
        }
      });

      // Check for level up and create notification
      if (newLevel > user.level) {
        await prisma.notification.create({
          data: {
            userId: userId,
            type: 'LEVEL_UP',
            title: 'Level Up!',
            message: `Congratulations! You've reached level ${newLevel}`,
            metadata: {
              newLevel: newLevel,
              oldLevel: user.level,
              pointsEarned: response.data.proofPointsEarned
            }
          }
        });
      }
    }

    return NextResponse.json({
      message: response.message,
      currentStep: response.currentStep,
      data: response.data,
      sessionId: agent.getSessionState().id,
      userStats: {
        proofPoints: user.proofPoints + (response.data?.proofPointsEarned || 0),
        level: Math.floor((user.proofPoints + (response.data?.proofPointsEarned || 0)) / 100) + 1
      }
    });

  } catch (error) {
    console.error('Agent API error:', error);
    
    // Return a helpful error response
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: "I apologize, but I encountered an error. Please try again, and I'll be happy to help you find the perfect AI tools.",
        currentStep: 'intro' // Reset to beginning
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve session history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId && !userId) {
      return NextResponse.json(
        { error: 'Missing sessionId or userId parameter' },
        { status: 400 }
      );
    }

    let sessions;
    if (sessionId) {
      // Get specific session
      const session = await prisma.agentSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          recommendations: {
            include: {
              tool: true
            }
          },
          user: {
            select: {
              name: true,
              userType: true,
              experienceLevel: true
            }
          }
        }
      });
      sessions = session ? [session] : [];
    } else if (userId) {
      // Get user's recent sessions
      sessions = await prisma.agentSession.findMany({
        where: { userId: userId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          recommendations: {
            include: {
              tool: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
    }

    return NextResponse.json({ sessions });

  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve sessions' },
      { status: 500 }
    );
  }
} 