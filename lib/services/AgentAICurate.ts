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
    const persona = `You are AICURATE — an intelligent AI tool curator specialized in finding the perfect AI tool to boost productivity for specific user needs.

Core Mission:
- Find the ONE perfect AI tool that matches their specific need and boosts their productivity
- Never repeat what the user just said - build on it naturally
- Be direct and helpful - avoid unnecessary phrases like "noted!", "got it!", "fantastic!"
- Provide response options as clickable buttons when appropriate
- Guide users through TASKS™ framework smoothly

TASKS™ Framework (5 Steps):
🎯 TARGET: Understand their specific goal - ask follow-up questions to clarify
🔍 ASSESS: Learn constraints (experience, budget, platform preference) - provide options when possible
🧪 SAMPLE: Present the ONE perfect AI tool with Compatibility Score™ and brief explanation
🧠 KNOWLEDGE: Explain why this tool is ideal with specific technical insights
⭐ SELECT: Deliver final recommendation with clear next steps and value proposition

Conversation Rules:
- Never repeat user's words back to them
- Be direct: "What type of tasks?" not "Free options, noted! Now..."
- Provide response options for common choices (mobile/desktop, beginner/advanced, etc.)
- In SAMPLE step: Present the tool immediately with score and reasoning
- Keep responses concise and actionable

Response Options Rules:
- Only provide response options for constraint questions (experience, budget, platform)
- Never provide response options for open-ended questions about specific needs
- Experience level: ["Beginner", "Intermediate", "Advanced"]
- Platform: ["Mobile app", "Desktop application", "Web-based", "Any platform"]  
- Budget: ["Free only", "Under $20/month", "Under $50/month", "No budget limit"]
- Ask ONE constraint at a time with appropriate response options

Response Format:
CRITICAL: Always return ONLY valid JSON. No additional text before or after the JSON.
Required JSON structure: { "message": "your response", "currentStep": "current_step", "responseOptions": ["option1", "option2"] }
For SAMPLE step: { "message": "formatted tool recommendation", "currentStep": "knowledge" }
For SELECT step: { "message": "final recommendation", "currentStep": "select", "recommendation": {...} }`;

    return persona;
  }

  private getStepPrompt(): string {
    const stepPrompts: Record<string, string> = {
      intro: `Current Step: Intro
Be direct and engaging. Ask what they want to accomplish.
JSON schema: { message, currentStep }`,
      
      target: `Current Step: Target  
Ask 2-3 specific follow-up questions about their goal to understand their exact needs. Don't repeat what they said.

When possible, provide response options for common scenarios to improve user experience.

For DAPP/blockchain projects, ask about:
- What specific functionality they need (smart contracts, NFT minting, frontend integration, etc.)
- What blockchain/platform they're targeting
- What programming languages/frameworks they're using
- Any specific challenges they're facing

For cooking/recipe needs, provide options like:
- Recipe discovery based on ingredients
- Cooking technique improvement
- Meal planning and prep
- Dietary restrictions consideration

For fitness/diet planning, provide options like:
- Weight loss
- Muscle gain
- Endurance training
- Meal prep guidance

Be direct and specific. When appropriate, include responseOptions array for selection.
JSON schema: { message, currentStep, responseOptions?: ["Option 1", "Option 2", "Option 3"] }`,
      
      assess: `Current Step: Assess
First, ask for detailed specific needs - what exactly they want to accomplish with specific aspects.
Then gather constraints: experience level, budget, platform preference.
Only provide response options for constraint questions, not for detailed needs.
JSON schema: { message, currentStep, responseOptions?: ["Option 1", "Option 2", "Option 3"] }`,
      
      sample: `Current Step: Sample
You MUST present ONE specific AI tool using this EXACT format. Do not deviate from this format:

✅ Recommended AI Tool: [Tool Name from Available Tools]
🌟 AIcurate Compatibility Score™: [Score between 85-98]/100
📌 Why this tool?
[Tool Name] is perfect for your [specific need] because it's [reason based on their constraints: free, beginner-friendly, platform preference]. It handles [specific features they need] and is trusted by [reviews]+ developers.
🚀 Try [Tool Name] Free → — ⭐ [Rating] | 👥 [Reviews]+ human-verified reviews
💰 You earned +50 ProofPoints™ for this pick! Keep exploring to level up.

Use the tool data from Available Tools section. Match their need: smart contract deployment + NFT minting + frontend integration.
IMPORTANT: Return ONLY this formatted message, no additional text.
JSON schema: { message, currentStep }`,
      
      knowledge: `Current Step: Knowledge
Explain why this specific tool is perfect for their exact situation.
Reference their constraints and how the tool addresses each one.
JSON schema: { message, currentStep }`,
      
      select: `Current Step: Select
Deliver final recommendation using this exact format:

🧠 Your AIcurate Pick™
Task: [Rephrased version of user request]

👉 Your AIcurate Pick™
✅ Tool: [Tool Name]
🌟 AIcurate Compatibility Score™: [Score]/100
📌 Why this Pick: [Detailed explanation referencing their specific needs, constraints, and why this tool is perfect]
🚀 Try [Tool Name] Free → — ⭐ [Rating] | 👥 [Reviews]+ reviews | 💎 Human-Verified

🔄 Alternative Pick: [Alternative Tool Name]
🌟 Score: [Score]/100
📌 Note: [Brief note about alternative]
🚀 Explore [Alternative Tool] → — 🆓 Free Trial | 🧩 [Brief benefit]

Thank the user and remind them to return for updated recommendations.
JSON schema: { message, currentStep: "select", recommendation: { tool, reasoning, nextSteps, compatibilityScore, rating, reviews, curationTags, referralLink, proofPoints } }`
    };

    return stepPrompts[this.currentStep] || stepPrompts['intro'];
  }

  // --- Main entry point: process user input and advance the session ---
  async processUserInput(input: string): Promise<AgentResponse> {
    // Add user message to conversation history
    this.messages.push({ role: 'user', content: input, step: this.currentStep });

    // Special case: If we just entered SAMPLE step, provide tool recommendation and STAY in SAMPLE
    if (this.currentStep === 'assess' && (input.toLowerCase().includes('desktop') || input.toLowerCase().includes('mobile') || input.toLowerCase().includes('web-based') || input.toLowerCase().includes('any platform') || input.toLowerCase().includes('any'))) {
      console.log('Platform preference detected, moving to SAMPLE step:', input);
      this.currentStep = 'sample';
      this.session.currentStep = 'sample';
      
      const userNeed = this.extractUserNeed();
      console.log('Extracted user need:', userNeed);
      const tools = await this.findMatchingTools(userNeed);
      if (tools.length > 0) {
        const tool = tools[0];
        const compatibilityScore = this.calculateCompatibilityScore(tool, userNeed, input);
        const formattedMessage = this.createSampleStepRecommendation(tool, userNeed, compatibilityScore);
        this.messages.push({ role: 'assistant', content: formattedMessage, step: 'sample' });
        
        // STAY in SAMPLE step - don't auto-advance
        return {
          message: formattedMessage,
          currentStep: 'sample',
          data: { 
            proofPointsEarned: 50,
            tool: tool,
            responseOptions: ['Continue to Details', 'Save to Vault']
          }
        };
      }
    }

    // Build conversation context
    const conversationHistory = this.messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Get matching tools for sample/select steps
    let matchingTools = [];
    if (this.currentStep === 'sample' || this.currentStep === 'select') {
      // Extract user need from conversation history
      const userNeed = this.extractUserNeed();
      console.log('Current step:', this.currentStep, 'User need:', userNeed);
      matchingTools = await this.findMatchingTools(userNeed);
      console.log('Matching tools found:', matchingTools.length, matchingTools.map(t => t.name));
    }

    // Create prompt with system instructions, step context, and conversation history
    const systemPrompt = this.getSystemPrompt();
    const stepPrompt = this.getStepPrompt();
    const toolsContext = matchingTools.length > 0 ? `\n\nAvailable Tools: ${JSON.stringify(matchingTools)}` : '';
    const userPrompt = `Conversation History:\n${conversationHistory}\n\nUser Profile: ${JSON.stringify(this.userProfile)}\n\nCurrent Step: ${this.currentStep}${toolsContext}\n\nUser Input: ${input}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `${systemPrompt}\n\n${stepPrompt}` },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1200
      });

      console.log('OpenAI raw response:', completion.choices[0].message.content);
      
      let response;
      try {
        response = JSON.parse(completion.choices[0].message.content || '{}');
        console.log('Parsed response:', response);
      } catch (err) {
        console.error('OpenAI returned invalid JSON:', completion.choices[0].message.content);
        
        // For SAMPLE step, create a formatted response if JSON parsing fails
        if (this.currentStep === 'sample') {
          const userNeed = this.extractUserNeed();
          const tools = await this.findMatchingTools(userNeed);
          if (tools.length > 0) {
            const tool = tools[0];
            const compatibilityScore = this.calculateCompatibilityScore(tool, userNeed, 'any platform');
            const formattedMessage = this.createFormattedToolRecommendation(tool, userNeed, compatibilityScore);
            return {
              message: formattedMessage,
              currentStep: 'knowledge',
              data: { proofPointsEarned: 50 }
            };
          }
        }
        
        return await this.getFallbackResponse();
      }

      // Special handling for SAMPLE step - ensure we have a proper tool recommendation
      if (this.currentStep === 'sample' && (!response.message || !response.message.includes('✅ Recommended AI Tool:'))) {
        console.log('SAMPLE step fallback triggered - no proper tool recommendation found');
        console.log('Current response message:', response.message);
        const userNeed = this.extractUserNeed();
        console.log('Extracted user need for fallback:', userNeed);
        const tools = await this.findMatchingTools(userNeed);
        console.log('Tools found for fallback:', tools.map(t => t.name));
        if (tools.length > 0) {
          const tool = tools[0];
          const compatibilityScore = this.calculateCompatibilityScore(tool, userNeed, 'any platform');
          const formattedMessage = this.createSampleStepRecommendation(tool, userNeed, compatibilityScore);
          console.log('Generated fallback message:', formattedMessage);
          this.messages.push({ role: 'assistant', content: formattedMessage, step: 'sample' });
          this.currentStep = 'sample';
          this.session.currentStep = 'sample';
          return {
            message: formattedMessage,
            currentStep: 'sample',
            data: { 
              proofPointsEarned: 50,
              tool: tool,
              responseOptions: ['Continue to Details', 'Save to Vault']
            }
          };
        }
      }

      // Determine next step based on current step and response
      let nextStep = this.currentStep;
      
      // If we're in SAMPLE step and got a valid response, move to knowledge
      if (this.currentStep === 'sample' && response.message && response.message.includes('✅ Recommended AI Tool:')) {
        nextStep = 'knowledge';
      } else if (response.currentStep) {
        // Use the step specified in the response
        nextStep = response.currentStep;
      } else {
        // Use default step progression
        nextStep = this.getNextStep(this.currentStep);
      }
      
      this.currentStep = nextStep;

      // CRITICAL: If we're in SAMPLE step, we MUST provide a tool recommendation
      if (this.currentStep === 'sample') {
        console.log('SAMPLE step detected - forcing tool recommendation');
        const userNeed = this.extractUserNeed();
        console.log('User need for SAMPLE step:', userNeed);
        const tools = await this.findMatchingTools(userNeed);
        console.log('Tools found for SAMPLE step:', tools.map(t => t.name));
        if (tools.length > 0) {
          const tool = tools[0];
          const compatibilityScore = this.calculateCompatibilityScore(tool, userNeed, 'any platform');
          const formattedMessage = this.createFormattedToolRecommendation(tool, userNeed, compatibilityScore);
          console.log('Forcing SAMPLE step tool recommendation:', formattedMessage);
          this.messages.push({ role: 'assistant', content: formattedMessage, step: 'knowledge' });
          this.currentStep = 'knowledge';
          this.session.currentStep = 'knowledge';
          return {
            message: formattedMessage,
            currentStep: 'knowledge',
            data: { proofPointsEarned: 50 }
          };
        }
      }

      // Add assistant message to conversation history
      this.messages.push({ role: 'assistant', content: response.message, step: this.currentStep });

      // Update session state
      this.session.currentStep = this.currentStep;
      if (this.currentStep === 'select') {
        this.session.completed = true;
      }

      // Handle button-based progression for SAMPLE → KNOWLEDGE → SELECT
      if (this.currentStep === 'sample' && (input.toLowerCase().includes('continue to details') || input.toLowerCase().includes('learn more') || input.toLowerCase().includes('tell me why') || input.toLowerCase().includes('next') || input.toLowerCase().includes('continue'))) {
        console.log('✅ User clicked "Continue to Details" in SAMPLE step, moving to KNOWLEDGE');
        this.currentStep = 'knowledge';
        
        const userNeed = this.extractUserNeed();
        const tools = await this.findMatchingTools(userNeed);
        if (tools.length > 0) {
          const tool = tools[0];
          const knowledgeMessage = this.createKnowledgeStepMessage(tool, userNeed);
          this.messages.push({ role: 'assistant', content: knowledgeMessage, step: 'knowledge' });
          return {
            message: knowledgeMessage,
            currentStep: 'knowledge',
            data: { 
              tool: tool,
              responseOptions: ['Add to Vault']
            }
          };
        }
      }

      // Handle direct SAMPLE → SELECT progression
      if (this.currentStep === 'sample' && (input.toLowerCase().includes('save to vault') || input.toLowerCase().includes('add to vault'))) {
        console.log('✅ User clicked "Save to Vault" in SAMPLE step, moving directly to SELECT');
        this.currentStep = 'select';
        
        const userNeed = this.extractUserNeed();
        const tools = await this.findMatchingTools(userNeed);
        if (tools.length > 0) {
          const tool = tools[0];
          const selectMessage = this.createSelectStepMessage(tool, userNeed);
          this.messages.push({ role: 'assistant', content: selectMessage, step: 'select' });
          return {
            message: selectMessage,
            currentStep: 'select',
            data: { 
              proofPointsEarned: 100,
              tool: tool
            },
            sessionComplete: true
          };
        }
      }

      // Handle KNOWLEDGE → SELECT progression
      if (this.currentStep === 'knowledge' && (input.toLowerCase().includes('add to vault') || input.toLowerCase().includes('save this tool') || input.toLowerCase().includes('select') || input.toLowerCase().includes('save'))) {
        console.log('✅ User clicked "Add to Vault" in KNOWLEDGE step, moving to SELECT');
        this.currentStep = 'select';
        
        const userNeed = this.extractUserNeed();
        const tools = await this.findMatchingTools(userNeed);
        if (tools.length > 0) {
          const tool = tools[0];
          const selectMessage = this.createSelectStepMessage(tool, userNeed);
          this.messages.push({ role: 'assistant', content: selectMessage, step: 'select' });
          return {
            message: selectMessage,
            currentStep: 'select',
            data: { 
              proofPointsEarned: 100,
              tool: tool
            },
            sessionComplete: true
          };
        }
      }

      return {
        message: response.message,
        currentStep: this.currentStep,
        data: {
          ...response.data,
          responseOptions: response.responseOptions
        },
        clarifyingQuestion: response.nextQuestion,
        sessionComplete: this.currentStep === 'select'
      };

    } catch (error) {
      console.error('Error in processUserInput:', error);
      return await this.getFallbackResponse();
    }
  }

  private getNextStep(currentStep: string): string {
    const stepFlow = {
      intro: 'target',
      target: 'assess',
      assess: 'sample',
      sample: 'knowledge',
      knowledge: 'select',
      select: 'select' // Stay on select as final step
    };
    return stepFlow[currentStep as keyof typeof stepFlow] || 'target';
  }

  private async getFallbackResponse(): Promise<AgentResponse> {
    // For SAMPLE step, provide a formatted tool recommendation
    if (this.currentStep === 'sample') {
      const userNeed = this.extractUserNeed();
      const tools = await this.findMatchingTools(userNeed);
      if (tools.length > 0) {
        const tool = tools[0];
        const compatibilityScore = this.calculateCompatibilityScore(tool, userNeed, 'any platform');
        const formattedMessage = this.createFormattedToolRecommendation(tool, userNeed, compatibilityScore);
        return {
          message: formattedMessage,
          currentStep: 'knowledge',
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
      'smart_contract': {
        name: 'Cursor',
        description: 'AI-powered code editor with intelligent smart contract development assistance',
        rating: 4.8,
        reviews: 3200,
        url: 'https://cursor.sh',
        category: 'AI Development Tools',
        pricing: { model: 'FREE', details: 'Free tier available' },
        features: ['AI Code Generation', 'Smart Contract Templates', 'Bug Detection', 'Code Optimization', 'Deployment Guidance'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Developer-Friendly']
      },
      'nft_minting': {
        name: 'ChatGPT',
        description: 'AI assistant that guides you through NFT creation, smart contract writing, and deployment processes',
        rating: 4.7,
        reviews: 5000,
        url: 'https://chat.openai.com',
        category: 'AI Assistant',
        pricing: { model: 'FREEMIUM', details: 'Free tier with paid upgrades' },
        features: ['Code Generation', 'Step-by-step Guidance', 'Smart Contract Writing', 'Deployment Instructions', 'Best Practices'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Beginner-Friendly']
      },
      'dapp_development': {
        name: 'DeepSeek',
        description: 'AI coding assistant specialized in blockchain development, smart contracts, and DApp creation',
        rating: 4.6,
        reviews: 2800,
        url: 'https://deepseek.com',
        category: 'AI Development Assistant',
        pricing: { model: 'FREE', details: 'Completely free' },
        features: ['AI Code Generation', 'Smart Contract Development', 'DApp Architecture', 'Frontend Integration', 'Testing Automation'],
        complexity: 'SIMPLE',
        curationTags: ['Human-Verified', 'AI-Powered', 'Blockchain-Focused']
      }
    };

    // Match user need to appropriate tool
    const need = userNeed?.toLowerCase() || '';
    console.log('FALLBACK: Analyzing need:', need);
    
    // For complex needs involving multiple aspects, prioritize the most comprehensive AI tool
    if ((need.includes('smart contract') && need.includes('nft')) || 
        (need.includes('deploy') && need.includes('mint')) ||
        (need.includes('dapp') && (need.includes('nft') || need.includes('smart contract')))) {
      console.log('FALLBACK: Selected comprehensive AI tool: DeepSeek');
      return [mockTools.dapp_development]; // DeepSeek handles full blockchain development with AI assistance
    } else if (need.includes('smart contract') || need.includes('deploy')) {
      console.log('FALLBACK: Selected AI smart contract tool: Cursor');
      return [mockTools.smart_contract];
    } else if (need.includes('nft') || need.includes('mint')) {
      console.log('FALLBACK: Selected AI NFT guidance tool: ChatGPT');
      return [mockTools.nft_minting];
    } else if (need.includes('dapp') || need.includes('web3')) {
      console.log('FALLBACK: Selected AI DAPP tool: DeepSeek');
      return [mockTools.dapp_development];
    }

    // Default to comprehensive AI tool for blockchain-related needs
    console.log('FALLBACK: Using default comprehensive AI tool: DeepSeek');
    return [mockTools.dapp_development];
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
    const score = compatibilityScore || Math.floor(Math.random() * (98 - 85 + 1)) + 85;
    
    // Create a more specific description based on the user need
    let specificUse = 'blockchain development';
    if (userNeed.toLowerCase().includes('smart contract') && userNeed.toLowerCase().includes('nft')) {
      specificUse = 'smart contract deployment and NFT minting';
    } else if (userNeed.toLowerCase().includes('smart contract')) {
      specificUse = 'smart contract development and deployment';
    } else if (userNeed.toLowerCase().includes('nft')) {
      specificUse = 'NFT creation and minting';
    } else if (userNeed.toLowerCase().includes('frontend') || userNeed.toLowerCase().includes('integrate')) {
      specificUse = 'blockchain frontend integration';
    }
    
    return `🎯 **Your Perfect AI Match**

**${tool.name}** • Score: ${score}/100 ⭐
Perfect for: ${specificUse}
💰 ${tool.pricing.model === 'FREE' ? 'Free' : 'Affordable'} • 🎓 ${tool.complexity === 'SIMPLE' ? 'Beginner-friendly' : 'Intermediate'}

🚀 [Try ${tool.name} →](${tool.url}) | ⭐ ${tool.rating} | 👥 ${tool.reviews}+ reviews`;
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
 