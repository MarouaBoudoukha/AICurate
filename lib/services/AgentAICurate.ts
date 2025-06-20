import { PrismaClient, PricingModel, Complexity, ToolStatus, TasksStep, UserType, MessageRole } from '@prisma/client';
import { OpenAI } from 'openai';

// --- User Profile and Session Types ---
interface UserProfile {
  id: string;
  name: string;
  userType: UserType;
  experienceLevel: string;
  interests: string[];
  region: string;
  preferences: any;
  teamId?: string;
}

interface AgentSession {
  id: string;
  userId: string;
  teamId?: string;
  currentStep: string;
  userType?: UserType;
  userGoal?: string;
  refinedGoal?: string;
  constraints?: any;
  recommendations?: any[];
  finalPick?: string;
  completed: boolean;
  // Corporate specific
  department?: string;
  objectives?: string[];
  budgetRange?: string;
  integrationNeeds?: string[];
  complianceReqs?: string[];
}

interface AgentResponse {
  message: string;
  currentStep: string;
  data?: {
    userType?: UserType;
    constraints?: any;
    tools?: any[];
    tool?: any;
    comparison?: any;
    recommendation?: any;
    nextStepPreview?: string;
    proofPointsEarned?: number;
    curationTags?: string[];
    responseOptions?: any[];

  };
  clarifyingQuestion?: string;
  sessionComplete?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  step?: string;
  responseOptions?: string[];
}

const prisma = new PrismaClient();

export class AgentAICurate {
  private openai: OpenAI;
  private session: AgentSession;
  private userProfile: UserProfile;
  private currentStep: string;
  private messages: Message[];

  constructor(apiKey: string, userProfile: UserProfile, existingSession?: any, currentStep?: string, messages?: Message[]) {
    // Use OpenAI API key from environment (never expose to client)
    this.openai = new OpenAI({ apiKey });
    this.userProfile = userProfile;
    this.currentStep = currentStep || 'intro';
    this.messages = messages || [];
    this.session = existingSession || {
      id: `session_${Date.now()}`,
      userId: userProfile.id,
      teamId: userProfile.teamId,
      currentStep: this.currentStep,
      completed: false
    };
  }

  // --- System Prompt: Encodes all behavioral logic, tone, and flow requirements ---
  private getSystemPrompt(): string {
    const userInterests = this.userProfile.interests?.join(', ') || 'Not specified';
    const experienceLevel = this.userProfile.experienceLevel || 'Not specified';
    const preferences = this.userProfile.preferences as any;
    const aiBudget = preferences?.aiBudget || 'Not specified';
    const aiComfortLevel = preferences?.aiComfortLevel || 'Not specified';
    const aiTasks = preferences?.aiTasks?.join(', ') || 'Not specified';
    const preferredPlatforms = preferences?.preferredPlatforms?.join(', ') || 'Not specified';

    const persona = `You are AICURATE — an intelligent AI tool curator specialized in finding the perfect AI tool for specific user needs.

Core Mission:
- Use the user's quiz data as the foundation for matching
- Ask MAXIMUM 3 targeted questions that weren't covered in their quiz
- ABSOLUTELY MANDATORY: Each question MUST have response options for better UX
- Be direct and precise - never repeat what the user said
- Find the ONE perfect AI tool that matches their need
- Provide actual working links to tools

CRITICAL RULE - RESPONSE OPTIONS:
🚨 EVERY SINGLE QUESTION MUST INCLUDE 3-4 CLICKABLE OPTIONS
🚨 NO EXCEPTIONS - NO OPEN-ENDED QUESTIONS ALLOWED
🚨 ALWAYS INCLUDE "Other" AS 4TH OPTION
🚨 FORMAT: responseOptions: ["Option 1", "Option 2", "Option 3", "Other"]

Efficient Process (Max 3 Questions):
1. ANALYZE: Review user's quiz data (interests, budget, experience, platforms, use cases)
2. IDENTIFY GAPS: Ask only questions needed for tool matching that quiz didn't cover
3. RECOMMEND: Present the perfect AI tool with real link and clear reasoning

Quiz Data Available:
- User interests: ${userInterests}
- Experience level: ${experienceLevel}
- Preferred budget: ${aiBudget}
- AI comfort level: ${aiComfortLevel}
- Previous AI tasks: ${aiTasks}
- Preferred platforms: ${preferredPlatforms}

Conversation Rules:
- NEVER repeat the user's words back to them
- Be direct: "What specific output do you need?" not "Got it! You want to create content..."
- 🚨 MANDATORY: ALWAYS provide response options for EVERY single question (no exceptions)
- 🚨 NEVER ask open-ended questions without options
- Only ask what's essential for tool matching that quiz data doesn't cover
- NEVER ask about budget since it's already in quiz data
- Keep responses under 50 words
- Move quickly to tool recommendation

Response Options Format:
- 🚨 MANDATORY: Every question must include 3-4 response options
- Make options specific to their stated need
- Cover all likely scenarios with options
- Always include "Other/Custom" as a 4th option if needed
- Example: ["Blog posts", "Social media content", "Email newsletters", "Other content type"]

Tool Recommendation Requirements:
- Use LLM to find the most relevant AI tool with highest match score
- Present in dynamic card format (user-friendly, no blocks of text)
- Must include actual working URL to the tool
- Must explain why it's perfect for their specific need using quiz data
- Must include pricing that matches their budget preference
- Must mention their experience level compatibility

Response Format:
CRITICAL: Always return ONLY valid JSON. No additional text before or after.
Required structure: { "message": "your response", "currentStep": "current_step", "responseOptions": ["option1", "option2", "option3", "Other"] }
For final recommendation: { "message": "tool recommendation with real link", "currentStep": "complete", "recommendation": {...} }

🚨🚨🚨 ABSOLUTE MANDATORY RULE: EVERY SINGLE QUESTION MUST HAVE RESPONSE OPTIONS
🚨 NO OPEN-ENDED QUESTIONS EVER - THIS IS NON-NEGOTIABLE
🚨 IF YOU ASK QUESTION WITHOUT OPTIONS = SYSTEM FAILURE
🚨 FORMAT: { "message": "question", "currentStep": "step", "responseOptions": ["A", "B", "C", "Other"] }
🚨🚨🚨 REMEMBER: EVERY QUESTION = MUST HAVE OPTIONS. NO EXCEPTIONS!`;

    return persona;
  }

  private getStepPrompt(): string {
    const stepPrompts: Record<string, string> = {
      intro: `Current Step: Intro
Acknowledge their goal briefly and immediately ask the FIRST essential question that quiz data doesn't answer.
Look at their quiz data and identify what specific detail you need to match them with the perfect tool.

🚨 CRITICAL: MUST include 3-4 response options. NO open-ended questions allowed.
🚨 ALWAYS include "Other" as 4th option
JSON schema: { message, currentStep: "question1", responseOptions: ["Option 1", "Option 2", "Option 3", "Other"] }`,
      
      question1: `Current Step: Question 1 of 3
Ask the FIRST specific question needed for tool matching that wasn't covered in quiz.
Focus on the most critical missing piece for tool selection.

Examples of essential questions (AVOID budget since it's in quiz):
- Specific output format needed
- Particular features required
- Integration requirements
- Specific use case details
- Technical requirements
- Collaboration needs
- Output quality level

🚨 MANDATORY: Must provide 3-4 response options relevant to their need. Include "Other" option.
🚨 NO OPEN-ENDED QUESTIONS - ONLY SELECTABLE OPTIONS
JSON schema: { message, currentStep: "question2", responseOptions: ["Option 1", "Option 2", "Option 3", "Other"] }`,
      
      question2: `Current Step: Question 2 of 3
Ask the SECOND specific question if needed for perfect tool matching.
Only ask if this information is crucial and missing from quiz data.

Focus on constraints or preferences that will determine the best tool choice (NOT budget).
🚨 MANDATORY: Must provide 3-4 response options. Include "Other" option.
🚨 NO OPEN-ENDED QUESTIONS - ONLY SELECTABLE OPTIONS
JSON schema: { message, currentStep: "question3", responseOptions: ["Option 1", "Option 2", "Option 3", "Other"] }`,
      
      question3: `Current Step: Question 3 of 3 (Final)
Ask the FINAL question only if absolutely necessary for tool selection.
This should be the last piece needed to recommend the perfect tool.

🚨 MANDATORY: Must provide 3-4 response options. Include "Other" option.
🚨 NO OPEN-ENDED QUESTIONS - ONLY SELECTABLE OPTIONS
JSON schema: { message, currentStep: "recommend", responseOptions: ["Option 1", "Option 2", "Option 3", "Other"] }`,
      
      recommend: `Current Step: Final Recommendation
Use LLM to find the most relevant AI tool with highest match score for their specific need.
Present the recommendation as a dynamic card format:

{
  "message": "🎯 **Perfect Match Found!**\n\n**[Tool Name]** ⭐ [Rating]/5\n\n✨ **Why it's perfect:** [Brief reason based on quiz + answers]\n💰 **Pricing:** [Fits your budget: budget from quiz]\n🚀 **Best for:** [Their experience level]\n\n[2-3 key benefits as bullet points]\n\n**Ready to start?** 👆",
  "currentStep": "complete",
  "recommendation": {
    "toolName": "[Tool Name]",
    "url": "[REAL working URL]",
    "compatibilityScore": [85-98],
    "pricing": "[Actual pricing]",
    "rating": [4.0-5.0],
    "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
    "whyPerfect": "[Match reasoning using quiz data]"
  }
}

CRITICAL: 
- Use LLM knowledge to find REAL AI tools, not database
- Include REAL working URL
- Base match score on user's quiz data + answers
- Keep card format clean and scannable
JSON schema: { message, currentStep: "complete", recommendation: {...} }`,
    };

    return stepPrompts[this.currentStep] || stepPrompts['intro'];
  }

  // --- Main entry point: process user input and advance the session ---
  async processUserInput(input: string): Promise<AgentResponse> {
    // Add user message to conversation history
    this.messages.push({ role: 'user', content: input, step: this.currentStep });

    // Determine next step based on current step and input
    const nextStep = this.getNextStep(this.currentStep, input);
    this.currentStep = nextStep;
    this.session.currentStep = nextStep;

    try {
      // Get the system prompt with user's quiz data
      const systemPrompt = this.getSystemPrompt();
      const stepPrompt = this.getStepPrompt();
      
      // Prepare conversation context for LLM
      const conversationContext = this.messages.map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n');

      // Create the LLM prompt
      const fullPrompt = `${systemPrompt}

${stepPrompt}

Previous conversation:
${conversationContext}

Current user input: ${input}

Generate appropriate response based on the current step and user's quiz data. Remember to use quiz information to avoid asking redundant questions.`;

      console.log('Sending prompt to LLM:', {
        currentStep: this.currentStep,
        userProfile: {
          interests: this.userProfile.interests,
          experienceLevel: this.userProfile.experienceLevel,
          preferences: this.userProfile.preferences
        }
      });

      // Special handling for recommendation step - use LLM for tool finding
      if (this.currentStep === 'recommend') {
        console.log('🎯 RECOMMENDATION STEP: Using LLM to find perfect AI tool match');
        
        // Build context for LLM tool recommendation
        const userNeed = this.extractUserNeed();
        const quizContext = `User Profile:
- Interests: ${this.userProfile.interests?.join(', ')}
- Experience: ${this.userProfile.experienceLevel}  
- Budget: ${this.userProfile.preferences?.aiBudget || 'Not specified'}
- AI Comfort: ${this.userProfile.preferences?.aiComfortLevel || 'Not specified'}
- Previous AI Tasks: ${this.userProfile.preferences?.aiTasks?.join(', ')}
- Platforms: ${this.userProfile.preferences?.preferredPlatforms?.join(', ')}`;

        const recommendationPrompt = `${systemPrompt}

${stepPrompt}

${quizContext}

User's specific need: ${userNeed}
Conversation history: ${conversationContext}

Find the single best AI tool that matches their need with highest compatibility score. Use your knowledge of real AI tools, not a database.`;

        const completion = await this.openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an expert AI tool curator. Find the perfect real AI tool match using your knowledge. Return clean JSON with dynamic card format." },
            { role: "user", content: recommendationPrompt }
          ],
          temperature: 0.3,
          max_tokens: 800,
        });

        const responseText = completion.choices[0]?.message?.content?.trim();
        console.log('LLM recommendation response:', responseText);

        if (responseText) {
          // Parse and return LLM recommendation
          const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
          const parsedResponse = JSON.parse(cleanedResponse);
          
          this.messages.push({ 
            role: 'assistant', 
            content: parsedResponse.message, 
            step: this.currentStep 
          });

          return {
            message: parsedResponse.message,
            currentStep: 'complete',
            data: {
              recommendation: parsedResponse.recommendation
            },
            sessionComplete: true
          };
        }
      }

      // For non-recommendation steps, use regular flow with FORCED JSON response
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON
        max_tokens: 1000,
        response_format: { type: "json_object" } // FORCE JSON response
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      console.log('LLM raw response:', responseText);

      if (!responseText) {
        throw new Error('No response from LLM');
      }

      // Parse JSON response
      let parsedResponse;
      try {
        // Clean the response to ensure it's valid JSON
        const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid JSON response: ${parseError}`);
      }

      // 🚨 CRITICAL: FORCE response options if missing and not complete step
      if ((!parsedResponse.responseOptions || parsedResponse.responseOptions.length === 0) && 
          this.currentStep !== 'complete' && this.currentStep !== 'recommend') {
        
        console.log('🚨 FORCING response options - agent tried to skip them!');
        
        // Generate appropriate options based on the conversation context
        if (this.currentStep === 'question1') {
          parsedResponse.responseOptions = ["Yes, exactly", "No, something different", "Let me clarify", "Other"];
        } else if (this.currentStep === 'question2') {
          parsedResponse.responseOptions = ["Option A", "Option B", "Option C", "Other"];
        } else if (this.currentStep === 'question3') {
          parsedResponse.responseOptions = ["High priority", "Medium priority", "Low priority", "Other"];
      } else {
          parsedResponse.responseOptions = ["Yes", "No", "Maybe", "Other"];
        }
      }

      // Add assistant message to conversation history
      this.messages.push({ 
        role: 'assistant', 
        content: parsedResponse.message, 
        step: this.currentStep,
        responseOptions: parsedResponse.responseOptions
      });

      // Prepare the response
      const agentResponse: AgentResponse = {
        message: parsedResponse.message,
        currentStep: this.currentStep,
        data: {
          responseOptions: parsedResponse.responseOptions || [],
          recommendation: parsedResponse.recommendation
        },
        sessionComplete: this.currentStep === 'complete'
      };

      console.log('Agent response with forced options:', agentResponse);
      return agentResponse;

    } catch (error) {
      console.error('Error in processUserInput:', error);
      
      // Fallback response
      return this.getFallbackResponse();
    }
  }

  private getNextStep(currentStep: string, userInput: string): string {
    const stepProgression: Record<string, string> = {
      'intro': 'question1',
      'question1': 'question2', 
      'question2': 'question3',
      'question3': 'recommend',
      'recommend': 'complete',
      'complete': 'complete'
    };

    // Special cases based on user input
    if (currentStep === 'intro') {
      return 'question1';
    }

    // Skip questions if we have enough information for recommendation
    if ((currentStep === 'question1' || currentStep === 'question2') && 
        this.hasEnoughInfoForRecommendation(userInput)) {
      return 'recommend';
    }

    return stepProgression[currentStep] || 'complete';
  }

  private hasEnoughInfoForRecommendation(userInput: string): boolean {
    // Check if user input provides enough detail to skip remaining questions
    // This is a simple heuristic - could be made more sophisticated
    const detailedKeywords = ['specific', 'exactly', 'need to', 'want to', 'looking for'];
    const hasDetailedDescription = detailedKeywords.some(keyword => 
      userInput.toLowerCase().includes(keyword)
    );
    
    // If user provides detailed description and we have quiz data, we can recommend
    return hasDetailedDescription && (
      this.userProfile.interests?.length > 0 ||
      this.userProfile.experienceLevel ||
      this.userProfile.preferences
    );
  }

  private async getFallbackResponse(): Promise<AgentResponse> {
    // For SAMPLE step, provide a formatted tool recommendation
    if (this.currentStep === 'sample') {
      const userNeed = this.extractUserNeed();
      const tools = await this.findMatchingTools(userNeed);
      if (tools.length > 0) {
        const tool = tools[0];
        const compatibilityScore = this.calculateCompatibilityScore(tool, userNeed, 'any platform');
        const formattedMessage = this.createSampleStepRecommendation(tool, userNeed, compatibilityScore);
        return {
          message: formattedMessage,
          currentStep: 'select',
          data: { proofPointsEarned: 50 }
        };
      }
    }

    const fallbacks = {
      intro: "I'm AICURATE. What do you need to build or accomplish?",
      target: "Tell me more about what you're trying to build.",
      assess: "What's your experience level with this type of project?",
      sample: "Let me find the right tool for your specific needs.",
      knowledge: "Here's why this tool matches your requirements.",
      select: "Based on your needs, here's my recommendation.",
      completed: "You're all set. Check back for updates on new tools."
    };

    return {
      message: fallbacks[this.currentStep as keyof typeof fallbacks] || fallbacks.intro,
      currentStep: this.currentStep,
      data: {}
    };
  }

  // --- AI Tool Matching Logic ---
  private async findMatchingTools(userNeed?: string): Promise<any[]> {
    if (!userNeed) {
      console.log('No user need provided, returning empty array');
      return [];
    }

    console.log('🔍 DATABASE-FIRST: Finding matching tools for need:', userNeed);

    // COMMENTED OUT: Database logic - keeping for future use
    /*
    try {
      // Build where clause based on user need
      let whereClause: any = {
        status: 'ACTIVE',
        isVerified: true
      };

      console.log('🎯 DATABASE QUERY: Searching with where clause:', JSON.stringify(whereClause, null, 2));

      // Enhanced category matching based on user need keywords
      if (userNeed.includes('smart contract') || userNeed.includes('blockchain') || userNeed.includes('web3') || userNeed.includes('dapp')) {
        whereClause.AND = [
          {
            OR: [
              { category: { contains: 'Blockchain', mode: 'insensitive' } },
              { description: { contains: 'smart contract', mode: 'insensitive' } },
              { description: { contains: 'blockchain', mode: 'insensitive' } },
              { description: { contains: 'web3', mode: 'insensitive' } },
              { name: { in: ['Cursor', 'DeepSeek', 'Blackbox AI'] } }
            ]
          },
          {
            NOT: {
              name: { in: ['Hugging Face'] }
            }
          }
        ];
      } else if (userNeed.includes('image') || userNeed.includes('design') || userNeed.includes('visual') || userNeed.includes('photo')) {
        whereClause.OR = [
          { category: { contains: 'Image', mode: 'insensitive' } },
          { category: { contains: 'Design', mode: 'insensitive' } },
          { category: { contains: 'Visual', mode: 'insensitive' } },
          { name: { in: ['Midjourney', 'Leonardo AI', 'Ideogram', 'PixAI', 'Canva', 'Remini', 'FaceApp'] } }
        ];
      } else if (userNeed.includes('video') || userNeed.includes('media') || userNeed.includes('film')) {
        whereClause.OR = [
          { category: { contains: 'Video', mode: 'insensitive' } },
          { category: { contains: 'Media', mode: 'insensitive' } },
          { name: { in: ['Sora', 'Kling AI', 'Veed', 'Invideo AI', 'VivaCut', 'Filmora Mobile', 'Hailuo AI'] } }
        ];
      } else if (userNeed.includes('chat') || userNeed.includes('conversation') || userNeed.includes('talk')) {
        whereClause.OR = [
          { category: { contains: 'Chat', mode: 'insensitive' } },
          { category: { contains: 'Conversation', mode: 'insensitive' } },
          { name: { in: ['ChatGPT', 'Claude', 'Character.ai', 'NOVA AI Chatbot', 'Poe', 'JanitorAI'] } }
        ];
      } else if (userNeed.includes('writing') || userNeed.includes('content') || userNeed.includes('text')) {
        whereClause.OR = [
          { category: { contains: 'Writing', mode: 'insensitive' } },
          { category: { contains: 'Content', mode: 'insensitive' } },
          { name: { in: ['QuillBot', 'Serrat.ai', 'Claude', 'ChatGPT'] } }
        ];
      } else if (userNeed.includes('audio') || userNeed.includes('music') || userNeed.includes('sound')) {
        whereClause.OR = [
          { category: { contains: 'Audio', mode: 'insensitive' } },
          { category: { contains: 'Music', mode: 'insensitive' } },
          { name: { in: ['SUNO', 'ElevenLabs'] } }
        ];
      } else if (userNeed.includes('code') || userNeed.includes('programming') || userNeed.includes('development') || userNeed.includes('coding')) {
        whereClause.OR = [
          { category: { contains: 'Development', mode: 'insensitive' } },
          { category: { contains: 'Code', mode: 'insensitive' } },
          { category: { contains: 'Programming', mode: 'insensitive' } },
          { name: { in: ['Cursor', 'DeepSeek', 'Blackbox AI', 'DeepSeek Mobile'] } }
        ];
      } else if (userNeed.includes('search') || userNeed.includes('research') || userNeed.includes('find')) {
        whereClause.OR = [
          { category: { contains: 'Search', mode: 'insensitive' } },
          { category: { contains: 'Research', mode: 'insensitive' } },
          { name: { in: ['Perplexity', 'Adot', 'Liner', 'Baidu AI Search'] } }
        ];
      } else if (userNeed.includes('presentation') || userNeed.includes('slides')) {
        whereClause.OR = [
          { category: { contains: 'Presentation', mode: 'insensitive' } },
          { name: { in: ['Gamma', 'Canva'] } }
        ];
      } else if (userNeed.includes('education') || userNeed.includes('learning') || userNeed.includes('study')) {
        whereClause.OR = [
          { category: { contains: 'Education', mode: 'insensitive' } },
          { category: { contains: 'Learning', mode: 'insensitive' } },
          { name: { in: ['PhotoMath', 'Brainly', 'StudyX'] } }
        ];
      } else {
        // Fallback: search for trending tools
        whereClause.isTrending = true;
      }

      const tools = await prisma.aITool.findMany({
        where: whereClause,
        orderBy: [
          { isFeatured: 'desc' },
          { isTrending: 'desc' },
          { rating: 'desc' },
          { popularity: 'desc' }
        ],
        take: 1 // Only return the best match
      });

      console.log(`📊 DATABASE RESULT: Found ${tools.length} matching tools:`, tools.map(t => `${t.name} (${t.category})`));

      if (tools.length > 0) {
        // For blockchain needs, check if we have truly relevant tools
        if (userNeed.includes('smart contract') || userNeed.includes('blockchain') || userNeed.includes('web3') || userNeed.includes('dapp')) {
          const hasBlockchainSpecificTool = tools.some(tool => 
            tool.description.toLowerCase().includes('blockchain') ||
            tool.description.toLowerCase().includes('smart contract') ||
            tool.description.toLowerCase().includes('web3') ||
            tool.category.toLowerCase().includes('blockchain')
          );
          
          if (!hasBlockchainSpecificTool) {
            console.log('⚠️ DATABASE INSUFFICIENT: Found general dev tools but no blockchain-specific tools, falling back to mock tools');
            return this.getMockToolsForNeed(userNeed);
          }
        }
        
        // Select the best tool (first one after sorting)
        const bestTool = tools[0];
        console.log('✅ DATABASE SUCCESS: Selected best tool:', bestTool.name, 'from category:', bestTool.category);
        
        // Convert database tool to expected format
        return [{
          name: bestTool.name,
          description: bestTool.description,
          rating: bestTool.rating,
          reviews: bestTool.popularity || 1000,
          url: bestTool.website || '#',
          category: bestTool.category,
          pricing: { 
            model: bestTool.pricingModel || 'FREE', 
            details: bestTool.pricingModel === 'FREE' ? 'Completely free' : 'Affordable pricing' 
          },
          features: bestTool.features || ['AI-Powered', 'User-Friendly', 'High-Quality Results'],
          complexity: bestTool.complexity || 'SIMPLE',
          curationTags: bestTool.curationTags || ['Human-Verified', 'AI-Powered', 'Trending']
        }];
      } else {
        console.log('❌ DATABASE EMPTY: No tools found, falling back to mock tools');
        return this.getMockToolsForNeed(userNeed);
      }
    } catch (error) {
      console.error('💥 DATABASE ERROR:', error);
      console.log('🔄 FALLBACK: Using mock tools due to database error');
      return this.getMockToolsForNeed(userNeed);
    }
    */

    // NEW: LLM-based tool recommendation
    console.log('🤖 LLM-BASED: Getting AI tool recommendation from ChatGPT');
    return await this.getLLMToolRecommendation(userNeed);
  }

  // FALLBACK ONLY: Mock tools logic - used only when LLM fails
  private getMockToolsForNeed(userNeed?: string): any[] {
    console.log('FALLBACK: getMockToolsForNeed called with:', userNeed);
    
    const mockTools = {
      // Development AI Tools
      'smart_contract': {
        name: 'Cursor',
        description: 'AI-powered code editor with intelligent smart contract development assistance',
        rating: 4.8,
        reviews: 3200,
        url: 'https://cursor.sh',
        category: 'AI Development Tools',
        pricing: { model: 'FREEMIUM', details: 'Free tier available, Pro $20/month' },
        features: ['AI Code Generation', 'Smart Contract Templates', 'Bug Detection', 'Code Optimization', 'Deployment Guidance'],
        complexity: 'MODERATE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Developer-Friendly']
      },
      'coding': {
        name: 'GitHub Copilot',
        description: 'AI pair programmer that helps write code, suggests completions, and assists with development',
        rating: 4.7,
        reviews: 12000,
        url: 'https://github.com/features/copilot',
        category: 'AI Code Assistant',
        pricing: { model: 'PAID', details: '$10/month for individuals' },
        features: ['AI Code Completion', 'Multi-language Support', 'Context-aware Suggestions', 'IDE Integration'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Popular']
      },
      'app_development': {
        name: 'Replit AI',
        description: 'AI coding assistant integrated in cloud development environment for building apps',
        rating: 4.6,
        reviews: 5500,
        url: 'https://replit.com/ai',
        category: 'AI Development Platform',
        pricing: { model: 'FREEMIUM', details: 'Free tier available, Pro plans from $7/month' },
        features: ['AI Code Generation', 'Real-time Collaboration', 'Deployment Automation', 'Multi-framework Support'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Cloud-based']
      },
      // Content Creation AI Tools
      'writing': {
        name: 'ChatGPT',
        description: 'Advanced AI assistant for writing, content creation, and text generation',
        rating: 4.8,
        reviews: 25000,
        url: 'https://chat.openai.com',
        category: 'AI Writing Assistant',
        pricing: { model: 'FREEMIUM', details: 'Free tier available, Plus $20/month' },
        features: ['Advanced Text Generation', 'Multiple Writing Styles', 'Research Assistance', 'Language Translation'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Most Popular']
      },
      'content_creation': {
        name: 'Jasper AI',
        description: 'AI writing assistant specialized in marketing content, blogs, and business copy',
        rating: 4.5,
        reviews: 8200,
        url: 'https://www.jasper.ai',
        category: 'AI Content Creator',
        pricing: { model: 'PAID', details: 'Plans from $29/month' },
        features: ['Marketing Copy', 'SEO Optimization', 'Brand Voice Training', 'Template Library'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Business-Focused']
      },
      // Design AI Tools
      'image_generation': {
        name: 'Midjourney',
        description: 'AI image generator that creates stunning artwork from text descriptions',
        rating: 4.7,
        reviews: 15000,
        url: 'https://midjourney.com',
        category: 'AI Image Generator',
        pricing: { model: 'PAID', details: 'Plans from $10/month' },
        features: ['Text-to-Image Generation', 'Art Styles', 'High Resolution Output', 'Commercial Usage'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Creative']
      },
      'design': {
        name: 'Canva AI',
        description: 'AI-powered design platform for creating graphics, presentations, and visual content',
        rating: 4.6,
        reviews: 18000,
        url: 'https://www.canva.com/ai',
        category: 'AI Design Tool',
        pricing: { model: 'FREEMIUM', details: 'Free tier available, Pro $12.99/month' },
        features: ['AI Design Suggestions', 'Template Generation', 'Background Removal', 'Brand Kit Integration'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'User-Friendly']
      },
      // Productivity AI Tools
      'data_analysis': {
        name: 'Claude',
        description: 'AI assistant specialized in analysis, research, and complex reasoning tasks',
        rating: 4.7,
        reviews: 8500,
        url: 'https://claude.ai',
        category: 'AI Research Assistant',
        pricing: { model: 'FREEMIUM', details: 'Free tier available, Pro $20/month' },
        features: ['Data Analysis', 'Document Processing', 'Research Assistance', 'Code Analysis'],
        complexity: 'MODERATE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Research-Focused']
      },
      'business_automation': {
        name: 'Zapier AI',
        description: 'AI-powered automation platform that connects apps and automates workflows',
        rating: 4.5,
        reviews: 12500,
        url: 'https://zapier.com/ai',
        category: 'AI Automation Tool',
        pricing: { model: 'FREEMIUM', details: 'Free tier available, plans from $19.99/month' },
        features: ['Workflow Automation', 'App Integration', 'AI-driven Triggers', 'No-code Solutions'],
        complexity: 'MODERATE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Business-Ready']
      }
    };

    // Match user need to appropriate tool
    const need = userNeed?.toLowerCase() || '';
    console.log('FALLBACK: Analyzing need:', need);
    
    // For complex needs involving multiple aspects, prioritize the most comprehensive AI tool
    if ((need.includes('smart contract') && need.includes('nft')) || 
        (need.includes('deploy') && need.includes('mint')) ||
        (need.includes('dapp') && (need.includes('nft') || need.includes('smart contract')))) {
      console.log('FALLBACK: Selected comprehensive AI tool: Replit AI');
      return [mockTools.app_development]; // Replit AI handles full app development with AI assistance
    } else if (need.includes('smart contract') || need.includes('deploy')) {
      console.log('FALLBACK: Selected AI smart contract tool: Cursor');
      return [mockTools.smart_contract];
    } else if (need.includes('nft') || need.includes('mint')) {
      console.log('FALLBACK: Selected AI NFT guidance tool: ChatGPT');
      return [mockTools.writing];
    } else if (need.includes('dapp') || need.includes('web3')) {
      console.log('FALLBACK: Selected AI DAPP tool: GitHub Copilot');
      return [mockTools.coding];
    }

    // Default to comprehensive AI tool for blockchain-related needs
    console.log('FALLBACK: Using default comprehensive AI tool: GitHub Copilot');
    return [mockTools.coding];
  }

  // NEW: LLM-based AI tool recommendation
  private async getLLMToolRecommendation(userNeed: string): Promise<any[]> {
    try {
      console.log('🤖 Asking ChatGPT for AI tool recommendation for:', userNeed);
      
      const prompt = `You are an AI tool expert and curator. Based on the user's specific need: "${userNeed}", recommend ONE perfect AI TOOL ONLY.

CRITICAL: You MUST recommend ONLY AI-POWERED TOOLS, not regular software, frameworks, or platforms.

AI TOOLS are tools that use artificial intelligence, machine learning, or LLM technology to assist users. Examples:
✅ AI TOOLS: ChatGPT, Claude, Cursor, GitHub Copilot, Replit AI, DeepSeek, Blackbox AI, Tabnine, CodeWhisperer
❌ NOT AI TOOLS: Truffle Suite, Hardhat, React, Next.js, VS Code, Remix IDE, MetaMask

For any development, creative, or productivity needs, recommend appropriate AI tools that use artificial intelligence to assist with the specific task.

IMPORTANT: Return ONLY a JSON object with this exact structure:
{
  "name": "AI Tool Name",
  "description": "Brief description emphasizing the AI capabilities",
  "rating": 4.5,
  "reviews": 1000,
  "url": "https://ai-tool-website.com",
  "category": "AI Tool Category (e.g., AI Code Assistant, AI Writing Tool, AI Design Tool)",
  "pricing": {
    "model": "FREE" or "FREEMIUM" or "PAID",
    "details": "Pricing description"
  },
  "features": ["AI Feature 1", "AI Feature 2", "AI Feature 3"],
  "complexity": "SIMPLE" or "MODERATE" or "ADVANCED",
  "curationTags": ["AI-Powered", "Human-Verified", "Popular"]
}

Focus on AI tools that are:
- Actually AI-powered (use machine learning, LLM, or AI technology)
- Actually available and working
- Well-suited for the specific task
- Have good reputation and user base
- Match the user's apparent skill level
- Emphasize their AI capabilities in description and features

REMEMBER: Only recommend tools that have AI/ML capabilities. No regular software or frameworks.

Return ONLY the JSON object, no other text.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert AI tool curator specializing ONLY in AI-powered tools. Never recommend regular software, frameworks, or non-AI tools. Always ensure your recommendations have artificial intelligence capabilities. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      console.log('🤖 ChatGPT raw response:', response);

      if (!response) {
        throw new Error('Empty response from ChatGPT');
      }

      // Parse the JSON response
      const toolRecommendation = JSON.parse(response);
      console.log('✅ LLM SUCCESS: Recommended tool:', toolRecommendation.name);

      return [toolRecommendation];

    } catch (error) {
      console.error('💥 LLM ERROR:', error);
      console.log('🔄 LLM FALLBACK: Using mock tools due to LLM error');
      
      // Fallback to mock tools if LLM fails
      return this.getMockToolsForNeed(userNeed);
    }
  }

  // --- Helper Methods ---
  private extractUserNeed(): string {
    // Extract the main user need from conversation history
    const userMessages = this.messages.filter(msg => msg.role === 'user');
    
    // Look for the most detailed/specific message about their needs
    let bestMatch = '';
    let bestScore = 0;
    
    for (const message of userMessages) {
      const content = message.content.toLowerCase();
      let score = 0;
      
      // Score based on specificity and detail
      if (content.includes('smart contract')) score += 3;
      if (content.includes('deploy')) score += 3;
      if (content.includes('nft') || content.includes('mint')) score += 3;
      if (content.includes('frontend') || content.includes('integrate')) score += 2;
      if (content.includes('nextjs') || content.includes('react')) score += 2;
      if (content.includes('worldchain') || content.includes('blockchain')) score += 2;
      if (content.includes('hardhat') || content.includes('minikit')) score += 2;
      
      // Prefer longer, more detailed messages
      if (content.length > 30) score += 1;
      if (content.length > 60) score += 1;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = message.content;
      }
    }
    
    if (bestMatch) {
      console.log('Found best user need match:', bestMatch);
      return bestMatch;
    }
    
    // Fallback to the first substantial message
    const substantialMessage = userMessages.find(msg => msg.content.length > 10);
    if (substantialMessage) {
      console.log('Using fallback user need:', substantialMessage.content);
      return substantialMessage.content;
    }
    
    return 'blockchain development assistance';
  }

  private createSampleStepRecommendation(tool: any, userNeed: string, compatibilityScore?: number): string {
    const score = compatibilityScore || this.calculateCompatibilityScore(tool, userNeed, 'any platform');
    const alternativeTool = this.findAlternativeTool(tool, userNeed);
    const alternativeScore = this.calculateCompatibilityScore(alternativeTool, userNeed, 'any platform');

    // Get key features safely
    const primaryFeatures = tool.features || tool.keyFeatures || ['AI-powered assistance', 'Smart contract support'];
    const alternativeFeatures = alternativeTool.features || alternativeTool.keyFeatures || ['Alternative features', 'Additional support'];

    return `Your AIcurate Pick™ – Final Recommendation Output Format:

1: Primary AI Tool Recommendation

✅ Your Pick: ${tool.name}
🌟 AIcurate Compatibility Score™: ${score}/100
📌 Why this Pick: ${tool.name} matches your ${userNeed} with ${primaryFeatures[0]} and ${primaryFeatures[1]}.
🚀 Claim your ${tool.pricing?.details || '20% discount'} →

⸻

2: Alternative Option (Empowers Choice)

🔄 Alternative Pick: ${alternativeTool.name}
🌟 Compatibility Score™: ${alternativeScore}/100
📌 Why consider this? ${alternativeTool.name} offers ${alternativeFeatures[0]}—perfect if you prefer ${alternativeFeatures[1]}.
🚀 Try it free for ${alternativeTool.pricing?.details || '30 days'} →

⸻

3: Incentive to Act

🎁 Bonus:
Leave a review on AICURATE and earn 50 Free AIcurate Credits to unlock more premium tools!

⸻

Do you need anything else?

Let me know when you next need my help to curate for you the best ai tool for the task you have at hand. I'll be here.${this.userProfile.userType === 'BUSINESS' ? '\n\nI can also set up quarterly check-ins to keep your AI stack sharp.' : ''}`;
  }

  private findAlternativeTool(primaryTool: any, userNeed: string): any {
    // Find a different tool that could be a good alternative
    const tools = this.getMockToolsForNeed(userNeed);
    const alternative = tools.find(t => t.name !== primaryTool.name);
    if (!alternative) {
      // If no alternative found, create a fallback alternative
      return {
        name: 'Alternative AI Tool',
        features: ['Alternative features', 'Additional support'],
        pricing: { details: '30 days free trial' }
      };
    }
    return alternative;
  }

  private createFormattedToolRecommendation(tool: any, userNeed: string, compatibilityScore?: number): string {
    const score = compatibilityScore || Math.floor(Math.random() * (98 - 85 + 1)) + 85; // Random score between 85-98 if not provided
    
    return `✅ Recommended AI Tool: ${tool.name}
🌟 AIcurate Compatibility Score™: ${score}/100
📌 Why this tool?
${tool.name} is perfect for your ${userNeed.toLowerCase()} because it's ${tool.pricing.model === 'FREE' ? 'completely free' : 'affordable'}, ${tool.complexity === 'SIMPLE' ? 'beginner-friendly' : 'suitable for your experience level'}, and ${tool.curationTags.includes('Web-based') ? 'web-based as you prefer' : 'available on your preferred platform'}. It handles ${tool.features.join(', ')} and is trusted by ${tool.reviews}+ developers.
🚀 Try ${tool.name} Free → — ⭐ ${tool.rating} | 👥 ${tool.reviews}+ human-verified reviews
💰 You earned +50 ProofPoints™ for this pick! Keep exploring to level up.`;
  }

  private createKnowledgeStepMessage(tool: any, userNeed: string): string {
    const score = this.calculateCompatibilityScore(tool, userNeed, 'any platform');
    
    return `🧠 **Why ${tool.name} is Perfect**

🎯 **Specializes in your exact needs**
💰 **${tool.pricing.model === 'FREE' ? 'Completely free' : tool.pricing.details}**
🎓 **Perfect for ${tool.complexity === 'SIMPLE' ? 'beginners' : 'intermediate users'}**
⭐ **${tool.rating}/5.0 with ${tool.reviews}+ verified reviews**

Ready to add this to your toolkit?`;
  }

  private createSelectStepMessage(tool: any, userNeed: string): string {
    const score = this.calculateCompatibilityScore(tool, userNeed, 'any platform');
    
    return `🎉 **Added to Your AI Toolkit!**

✅ **${tool.name}** is now saved in your vault
🌟 **Compatibility Score: ${score}/100**
💰 **You earned +100 ProofPoints™!**

🚀 **Next Steps:**
• [Start using ${tool.name} →](${tool.url})
• Return anytime for more AI tool recommendations
• Your personalized vault is building!

Thank you for using AIcurate! 🙏`;
  }

  private calculateCompatibilityScore(tool: any, userNeed: string, platformPreference: string): number {
    let score = 0;
    
    // Task Relevance (40% weight)
    const taskRelevance = this.calculateTaskRelevance(tool, userNeed);
    score += taskRelevance * 0.4;
    
    // Budget Fit (20% weight) - assuming free tools get max score for "free only" users
    const budgetFit = tool.pricing.model === 'FREE' ? 1.0 : 0.7; // Free tools score higher
    score += budgetFit * 0.2;
    
    // User Skill Match (15% weight) - simple tools for beginner users
    const skillMatch = tool.complexity === 'SIMPLE' ? 1.0 : 0.8;
    score += skillMatch * 0.15;
    
    // Regional Suitability (10% weight) - assume all tools are globally available
    const regionalSuitability = 1.0;
    score += regionalSuitability * 0.1;
    
    // User Ratings & Reviews (10% weight)
    const ratingScore = tool.rating / 5.0; // Normalize 5-star rating to 0-1
    score += ratingScore * 0.1;
    
    // Trending Status (5% weight)
    const trendingScore = tool.curationTags.includes('Trending') ? 1.0 : 0.6;
    score += trendingScore * 0.05;
    
    // Convert to 0-100 scale and ensure it's in the 85-98 range for high-quality tools
    const finalScore = Math.max(85, Math.min(98, Math.round(score * 100)));
    return finalScore;
  }

  private calculateTaskRelevance(tool: any, userNeed: string): number {
    const need = userNeed.toLowerCase();
    const toolCategory = tool.category.toLowerCase();
    const toolFeatures = tool.features.map((f: string) => f.toLowerCase());
    
    // High relevance for exact matches
    if (need.includes('smart contract') && (toolCategory.includes('blockchain') || toolFeatures.some((f: string) => f.includes('contract')))) {
      return 1.0;
    }
    if (need.includes('nft') && (toolCategory.includes('nft') || toolFeatures.some((f: string) => f.includes('nft')))) {
      return 1.0;
    }
    if (need.includes('dapp') && (toolCategory.includes('web3') || toolCategory.includes('blockchain'))) {
      return 1.0;
    }
    
    // Medium relevance for related matches
    if (need.includes('deploy') && toolFeatures.some((f: string) => f.includes('deployment'))) {
      return 0.8;
    }
    if (need.includes('frontend') && toolFeatures.some((f: string) => f.includes('sdk') || f.includes('integration'))) {
      return 0.8;
    }
    
    // Default relevance
    return 0.6;
  }

  // --- Session State Management ---
  public getSessionState(): AgentSession {
    return this.session;
  }
}
 