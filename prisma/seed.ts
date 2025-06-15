import { PrismaClient, QuestionType, PricingModel, Complexity, ToolStatus, ChallengeType, ChallengeDifficulty, UserType } from '@prisma/client';
import { aiToolsData } from './seed-data/ai-tools';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AICurate database seeding...');

  // Create quiz questions - matching the actual quiz steps from QuizSection
  console.log('❓ Creating quiz questions...');
  const questions = [
    {
      id: 'interests',
      question: 'What are you passionate about?',
      type: 'MULTI_SELECT' as QuestionType,
      options: [
        'AI & Tech',
        'Gaming',
        'Art & Design',
        'Writing & Storytelling',
        'Wellness & Mindset',
        'Business & Productivity',
        'Other'
      ],
      category: 'preferences',
      order: 1,
      isRequired: true
    },
    {
      id: 'location',
      question: 'Where do you live?',
      type: 'MULTIPLE_CHOICE' as QuestionType,
      options: [
        // Sample of countries - in real app this would be the full list
        'United States',
        'Canada',
        'United Kingdom',
        'Germany',
        'France',
        'Australia',
        'Japan',
        'Brazil',
        'India',
        'South Africa',
        // ... (other countries would be here)
      ],
      category: 'demographics',
      order: 2,
      isRequired: true
    },
    {
      id: 'age',
      question: 'How old are you?',
      type: 'MULTIPLE_CHOICE' as QuestionType,
      options: [
        '13–17',
        '18–24',
        '25–34',
        '35–44',
        '45–60',
        '60+'
      ],
      category: 'demographics',
      order: 3,
      isRequired: true
    },
    {
      id: 'platforms',
      question: 'Where do you hang out most online?',
      type: 'MULTI_SELECT' as QuestionType,
      options: [
        'X',
        'LinkedIn',
        'TikTok',
        'YouTube',
        'Instagram',
        'Facebook',
        'Substack',
        'Other'
      ],
      category: 'social',
      order: 4,
      isRequired: true
    },
    {
      id: 'tasks',
      question: 'What do you want AI to help you with?',
      type: 'MULTI_SELECT' as QuestionType,
      options: [
        'Business / Analytics',
        'Coding / Dev tools',
        'Coaching & Wellness',
        'Crypto/web3',
        'Learning',
        'Visual design / Image generation',
        'Writing/ Content creation',
        'Marketing/ advertising',
        'Automation/ Productivity',
        'Other'
      ],
      category: 'use_cases',
      order: 5,
      isRequired: true
    },
    {
      id: 'comfort',
      question: "What's your comfort level with AI?",
      type: 'MULTIPLE_CHOICE' as QuestionType,
      options: [
        'Newcomer',
        'Beginner',
        'Intermediate',
        'Advanced / Pro',
        'Builder / Developer'
      ],
      category: 'experience',
      order: 6,
      isRequired: true
    }
  ];

  for (const question of questions) {
    await prisma.quizQuestion.upsert({
      where: { id: question.id },
      update: question,
      create: question,
    });
  }

  console.log('✅ Created/updated quiz questions.');

  // Create demo users
  console.log('👥 Creating demo users...');
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@aicurate.app' },
    update: {},
    create: {
      email: 'demo@aicurate.app',
      name: 'Demo User',
      username: 'demo',
      isVerified: true,
      userType: UserType.INDIVIDUAL,
      experienceLevel: 'BEGINNER',
      interests: ['Productivity', 'Content Creation', 'AI Tools', 'Marketing'],
      region: 'Global',
      preferences: {
        useCase: 'personal',
        budget: 'low',
        complexity: 'simple',
        timeframe: 'immediate'
      },
      proofPoints: 150,
      level: 2,
      onboardingCompleted: true
    }
  });

  const businessUser = await prisma.user.upsert({
    where: { email: 'business@aicurate.app' },
    update: {},
    create: {
      email: 'business@aicurate.app',
      name: 'Business User',
      username: 'business',
      isVerified: true,
      userType: UserType.BUSINESS,
      experienceLevel: 'INTERMEDIATE',
      interests: ['Automation', 'Analytics', 'Customer Support', 'Sales'],
      region: 'North America',
      preferences: {
        useCase: 'business',
        budget: 'medium',
        complexity: 'moderate',
        timeframe: 'short_term'
      },
      proofPoints: 500,
      level: 5,
      onboardingCompleted: true
    }
  });

  const enterpriseUser = await prisma.user.upsert({
    where: { email: 'enterprise@aicurate.app' },
    update: {},
    create: {
      email: 'enterprise@aicurate.app',
      name: 'Enterprise User',
      username: 'enterprise',
      isVerified: true,
      userType: UserType.ENTERPRISE,
      experienceLevel: 'EXPERT',
      interests: ['Enterprise AI', 'Data Analytics', 'Compliance', 'Security'],
      region: 'Global',
      preferences: {
        useCase: 'enterprise',
        budget: 'high',
        complexity: 'advanced',
        timeframe: 'long_term'
      },
      proofPoints: 2000,
      level: 15,
      onboardingCompleted: true
    }
  });

  console.log('✅ Created demo users.');

  // Seed AI Tools
  console.log('📦 Seeding AI Tools...');
  let toolsCreated = 0;
  for (const tool of aiToolsData) {
    try {
      await prisma.aITool.upsert({
        where: { slug: tool.slug },
        update: {
          ...tool,
          pricingModel: tool.pricingModel as PricingModel,
          complexity: 'SIMPLE' as Complexity,
          status: tool.status as ToolStatus,
          pricingDetails: 'See website for pricing details',
          useCases: [],
          targetAudience: ['General'],
          integrations: [],
          compliance: [],
          screenshots: []
        },
        create: {
          ...tool,
          pricingModel: tool.pricingModel as PricingModel,
          complexity: 'SIMPLE' as Complexity,
          status: tool.status as ToolStatus,
          pricingDetails: 'See website for pricing details',
          useCases: [],
          targetAudience: ['General'],
          integrations: [],
          compliance: [],
          screenshots: []
        }
      });
      toolsCreated++;
    } catch (error) {
      console.warn(`Failed to create/update tool: ${tool.name}`, error);
    }
  }
  console.log(`✅ Created/updated ${toolsCreated} AI tools`);

  // Create sample challenges
  console.log('🎯 Creating challenges...');
  
  const challenges = [
    {
      id: 'first-discovery',
      title: 'First Discovery',
      description: 'Complete your first AI tool discovery session with Agent AICurate',
      shortDescription: 'Complete your first discovery session',
      type: ChallengeType.DISCOVERY,
      difficulty: ChallengeDifficulty.EASY,
      requirements: { sessionsToComplete: 1 },
      proofPoints: 50,
      isActive: true,
      isFeatured: true
    },
    {
      id: 'tool-explorer',
      title: 'Tool Explorer',
      description: 'Save 5 different AI tools to your vault',
      shortDescription: 'Save 5 tools to your vault',
      type: ChallengeType.DISCOVERY,
      difficulty: ChallengeDifficulty.EASY,
      requirements: { toolsToSave: 5 },
      proofPoints: 100,
      isActive: true
    },
    {
      id: 'first-review',
      title: 'First Review',
      description: 'Write your first tool review',
      shortDescription: 'Write your first review',
      type: ChallengeType.REVIEW,
      difficulty: ChallengeDifficulty.EASY,
      requirements: { reviewsToWrite: 1 },
      proofPoints: 75,
      isActive: true
    },
    {
      id: 'category-master',
      title: 'Category Master',
      description: 'Try tools from 3 different categories',
      shortDescription: 'Explore 3 different tool categories',
      type: ChallengeType.DISCOVERY,
      difficulty: ChallengeDifficulty.MEDIUM,
      requirements: { categoriesToExplore: 3 },
      proofPoints: 200,
      isActive: true
    },
    {
      id: 'ai-evangelist',
      title: 'AI Evangelist',
      description: 'Share 3 AI tools with friends',
      shortDescription: 'Share 3 tools with others',
      type: ChallengeType.SOCIAL,
      difficulty: ChallengeDifficulty.MEDIUM,
      requirements: { toolsToShare: 3 },
      proofPoints: 150,
      isActive: true
    }
  ];

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: challenge,
      create: challenge
    });
  }

  console.log('✅ Created challenges.');

  // Create sample collections for demo user
  console.log('📁 Creating sample collections...');
  
  const collections = [
    {
      id: 'productivity-tools',
      userId: demoUser.id,
      name: 'Productivity Boosters',
      description: 'AI tools that help me get more done',
      color: '#3B82F6',
      icon: '⚡',
      isPublic: true
    },
    {
      id: 'creative-tools',
      userId: demoUser.id,
      name: 'Creative Arsenal',
      description: 'Tools for design and content creation',
      color: '#8B5CF6',
      icon: '🎨',
      isPublic: false
    },
    {
      id: 'business-tools',
      userId: businessUser.id,
      name: 'Business Essentials',
      description: 'Must-have AI tools for business',
      color: '#10B981',
      icon: '💼',
      isPublic: true
    }
  ];

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { id: collection.id },
      update: collection,
      create: collection
    });
  }

  console.log('✅ Created collections.');

  // Add some tools to user vaults
  console.log('💾 Adding tools to user vaults...');
  
  const popularTools = await prisma.aITool.findMany({
    where: { popularity: { gte: 80 } },
    take: 10
  });

  // Add tools to demo user's vault
  for (let i = 0; i < Math.min(5, popularTools.length); i++) {
    const tool = popularTools[i];
    await prisma.userVault.upsert({
      where: {
        userId_toolId: {
          userId: demoUser.id,
          toolId: tool.id
        }
      },
      update: {},
      create: {
        userId: demoUser.id,
        toolId: tool.id,
        collectionId: i < 3 ? 'productivity-tools' : 'creative-tools',
        notes: `Added during demo setup - ${tool.name} looks promising!`,
        priority: 'MEDIUM',
        status: 'SAVED'
      }
    });
  }

  console.log('✅ Added tools to user vaults.');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   👥 Users created: 3`);
  console.log(`   📦 AI Tools: ${aiToolsData.length}`);
  console.log(`   ❓ Quiz questions: ${questions.length}`);
  console.log(`   🎯 Challenges: ${challenges.length}`);
  console.log(`   📁 Collections: ${collections.length}`);
  
  console.log('\n🔑 Demo Accounts:');
  console.log(`   Individual: demo@aicurate.app`);
  console.log(`   Business: business@aicurate.app`);
  console.log(`   Enterprise: enterprise@aicurate.app`);
  
  console.log('\n🚀 Next steps:');
  console.log('   1. Start your development server: npm run dev');
  console.log('   2. Visit: http://localhost:3000');
  console.log('   3. Test the AI agent: http://localhost:3000/guide');
  console.log('   4. Explore Prisma Studio: npx prisma studio');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 