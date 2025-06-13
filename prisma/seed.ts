import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create quiz questions - matching the actual quiz steps from QuizSection
  const questions = [
    {
      id: 'interests',
      question: 'What are you passionate about?',
      type: 'MULTI_SELECT',
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
      type: 'MULTIPLE_CHOICE',
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
      type: 'MULTIPLE_CHOICE',
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
      type: 'MULTI_SELECT',
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
      type: 'MULTI_SELECT',
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
      type: 'MULTIPLE_CHOICE',
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

  console.log('Seeding finished. Created 6 quiz questions.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 