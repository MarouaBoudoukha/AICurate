import { UserProfile, TasksSession, AgentResponse, AITool } from '../types/agent';
import { useAICurate } from '../hooks/useAICurate';

export class AgentAICurate {
  private openAIApiKey: string;
  private userProfile: UserProfile;
  private session: TasksSession;

  constructor(apiKey: string, userProfile: UserProfile) {
    this.openAIApiKey = apiKey;
    this.userProfile = userProfile;
    this.session = {
      id: `session_${Date.now()}`,
      userId: userProfile.id,
      step: 'target',
      context: {
        userGoal: '',
        refinedGoal: '',
        constraints: {},
        recommendations: []
      },
      proofPointsEarned: 0,
      startedAt: new Date()
    };
  }

  async processUserInput(input: string): Promise<AgentResponse> {
    switch (this.session.step) {
      case 'target':
        return this.handleTarget(input);
      case 'assess':
        return this.handleAssess(input);
      case 'sample':
        return this.handleSample(input);
      case 'knowledge':
        return this.handleKnowledge(input);
      case 'success':
        return this.handleSuccess(input);
      default:
        return this.handleTarget(input);
    }
  }

  private async handleTarget(input: string): Promise<AgentResponse> {
    const prompt = `You are Agent AICurate, a friendly AI curator who helps people find the perfect AI tools. You're at the TARGET step of the TASKS™ method.

User Profile:
- Name: ${this.userProfile.name}
- Experience: ${this.userProfile.experienceLevel}
- Interests: ${this.userProfile.interests.join(', ')}
- Use Case: ${this.userProfile.preferences.useCase}

User Input: "${input}"

Your task: Welcome them warmly, understand their goal, and ask ONE follow-up question to clarify their needs.

Be conversational, encouraging, and concise. Think like a helpful friend who knows a lot about AI tools.

Respond in JSON format:
{
  "message": "Warm, conversational response that shows you understand their goal",
  "refinedGoal": "Clear, actionable version of what they want to achieve",
  "followUpQuestion": "One specific question to better understand their needs",
  "userType": "individual" or "business"
}`;

    try {
      const response = await this.callOpenAI(prompt);
      const parsed = JSON.parse(response);
      
      this.session.context.userGoal = input;
      this.session.context.refinedGoal = parsed.refinedGoal;
      this.session.context.userType = parsed.userType;
      this.session.step = 'assess';

      return {
        message: parsed.message,
        data: {
          nextStep: "Next, I'll help you assess your requirements like budget and complexity preferences."
        },
        clarifyingQuestion: parsed.followUpQuestion,
        nextStep: 'assess'
      };
    } catch (error) {
      console.error('Error in handleTarget:', error);
      return this.getFallbackResponse('target');
    }
  }

  private async handleAssess(input: string): Promise<AgentResponse> {
    const prompt = `You are Agent AICurate at the ASSESS step. You need to understand their constraints.

Previous Context:
- Goal: ${this.session.context.refinedGoal}
- User Type: ${this.session.context.userType}
- User Response: "${input}"

Your task: Understand their budget, timeline, and complexity preferences. Ask ONE clarifying question.

Be conversational and help them think through what they actually need.

Respond in JSON format:
{
  "message": "Friendly response that acknowledges their input",
  "constraints": {
    "budget": "free", "low", "medium", or "high",
    "timeline": "immediate", "short_term", or "long_term", 
    "complexity": "simple", "moderate", or "advanced"
  },
  "followUpQuestion": "One question about missing constraint info"
}`;

    try {
      const response = await this.callOpenAI(prompt);
      const parsed = JSON.parse(response);
      
      this.session.context.constraints = parsed.constraints;
      this.session.step = 'sample';

      return {
        message: parsed.message,
        data: {
          constraints: parsed.constraints,
          nextStep: "Perfect! Now I'll research and show you some AI tools that match your needs."
        },
        clarifyingQuestion: parsed.followUpQuestion,
        nextStep: 'sample'
      };
    } catch (error) {
      console.error('Error in handleAssess:', error);
      return this.getFallbackResponse('assess');
    }
  }

  private async handleSample(input: string): Promise<AgentResponse> {
    // Research AI tools using ChatGPT's internet access
    const toolResearchPrompt = `You are Agent AICurate researching AI tools. Use your internet access to find the best current AI tools for this user.

RESEARCH TASK:
- Goal: ${this.session.context.refinedGoal}
- Budget: ${this.session.context.constraints.budget}
- Complexity: ${this.session.context.constraints.complexity}
- Timeline: ${this.session.context.constraints.timeline}
- User Type: ${this.session.context.userType}
- Latest User Input: "${input}"

INSTRUCTIONS:
1. Search for the most current, relevant AI tools for their specific need
2. Focus on tools that are actually available and working in 2024/2025
3. Consider their budget and complexity preferences
4. Find 3 tools that are genuinely different and useful
5. Get real pricing, features, and current ratings/reviews

Present your research in this JSON format:
{
  "message": "Friendly presentation of the researched tools with brief explanations",
  "tools": [
    {
      "name": "Tool Name",
      "description": "What it does and why it's good for their goal",
      "category": "Main category",
      "pricing": {
        "model": "free/freemium/subscription/pay_per_use",
        "details": "Specific pricing like '$10/month' or 'Free with paid tiers'"
      },
      "features": ["key feature 1", "key feature 2", "key feature 3"],
      "complexity": "simple/moderate/advanced",
      "rating": 4.5,
      "reviews": 1000,
      "url": "actual website URL"
    }
  ],
  "followUpQuestion": "Ask which tool interests them most or if they want to know more about any"
}

Research thoroughly and provide real, current tools that exist today.`;

    try {
      const response = await this.callOpenAI(toolResearchPrompt);
      const parsed = JSON.parse(response);
      
      // Store researched tools in session
      this.session.context.recommendations = parsed.tools || [];
      this.session.step = 'knowledge';

      return {
        message: parsed.message,
        data: {
          tools: parsed.tools,
          nextStep: "I'll help you compare these tools in detail to make the best choice."
        },
        clarifyingQuestion: parsed.followUpQuestion,
        nextStep: 'knowledge'
      };
    } catch (error) {
      console.error('Error in handleSample:', error);
      return this.getFallbackResponse('sample');
    }
  }

  private async handleKnowledge(input: string): Promise<AgentResponse> {
    const toolNames = this.session.context.recommendations.map(t => t.name).join(', ');
    
    const comparisonPrompt = `You are Agent AICurate at the KNOWLEDGE step. Provide detailed comparison of the tools you just researched.

Context:
- Researched Tools: ${toolNames}
- Tools Data: ${JSON.stringify(this.session.context.recommendations)}
- User Interest: "${input}"
- Original Goal: ${this.session.context.refinedGoal}
- User Constraints: ${JSON.stringify(this.session.context.constraints)}

Your task: Create a helpful, honest comparison focusing on pros/cons and best use cases for each tool.

Use your knowledge of these tools to provide:
1. Honest pros and cons for each
2. Specific use cases where each excels
3. Consider their stated constraints and preferences
4. Help them make an informed decision

Respond in JSON format:
{
  "message": "Detailed comparison with pros/cons for each tool, considering their specific needs",
  "comparison": {
    "Tool Name 1": {
      "pros": ["specific benefit relevant to their goal", "another strength"],
      "cons": ["honest limitation", "potential drawback"], 
      "bestFor": "specific use case where this tool excels"
    },
    "Tool Name 2": {
      "pros": ["benefit 1", "benefit 2"],
      "cons": ["limitation 1", "limitation 2"],
      "bestFor": "when to choose this tool"
    }
  },
  "followUpQuestion": "Ask which tool they're leaning towards or what's most important to them"
}`;

    try {
      const response = await this.callOpenAI(comparisonPrompt);
      const parsed = JSON.parse(response);
      
      this.session.step = 'success';

      return {
        message: parsed.message,
        data: {
          comparison: parsed.comparison,
          nextStep: "Based on everything we've discussed, I'll give you my final recommendation!"
        },
        clarifyingQuestion: parsed.followUpQuestion,
        nextStep: 'success'
      };
    } catch (error) {
      console.error('Error in handleKnowledge:', error);
      return this.getFallbackResponse('knowledge');
    }
  }

  private async handleSuccess(input: string): Promise<AgentResponse> {
    const finalRecommendationPrompt = `You are Agent AICurate at the SUCCESS step. Make your final recommendation based on the entire conversation.

Full Context:
- Original Goal: ${this.session.context.refinedGoal}
- User Type: ${this.session.context.userType}
- Constraints: ${JSON.stringify(this.session.context.constraints)}
- Researched Tools: ${JSON.stringify(this.session.context.recommendations)}
- User's Final Input: "${input}"

Your task: 
1. Choose the BEST tool for their specific situation
2. Give a confident recommendation with clear reasoning
3. Provide actionable next steps
4. Include helpful tips for success
5. Calculate an AICurate Score based on fit to their needs

Respond in JSON format:
{
  "message": "Confident final recommendation with encouraging tone and clear reasoning",
  "recommendation": {
    "tool": "selected tool name from your research",
    "reasoning": "Why this is the best choice for their specific needs",
    "nextSteps": ["actionable step 1", "actionable step 2", "step 3"],
    "tips": ["helpful tip for success", "pro tip for getting started"],
    "aiCurateScore": 85-98
  }
}

Choose the tool that BEST matches their goal, constraints, and experience level.`;

    try {
      const response = await this.callOpenAI(finalRecommendationPrompt);
      const parsed = JSON.parse(response);
      
      this.session.step = 'complete';

      return {
        message: parsed.message,
        data: {
          recommendation: parsed.recommendation,
          nextStep: "Awesome! You're all set. Come back anytime to discover more AI tools!"
        },
        nextStep: 'complete'
      };
    } catch (error) {
      console.error('Error in handleSuccess:', error);
      return this.getFallbackResponse('success');
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4o for internet access
        messages: [
          {
            role: 'system',
            content: `You are Agent AICurate, a friendly AI tool curator. You have internet access and should research current, real AI tools when needed. Always respond in valid JSON format. Be conversational, helpful, and concise. Focus on tools that actually exist and are available today.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private getFallbackResponse(step: string): AgentResponse {
    const fallbacks = {
      target: {
        message: "I'd love to help you find the perfect AI tool! What would you like to accomplish today?",
        nextStep: 'assess' as const
      },
      assess: {
        message: "Got it! Let me understand your preferences better. What's your budget like - are you looking for free tools or okay with paid options?",
        nextStep: 'sample' as const
      },
      sample: {
        message: "Let me research some current AI tools that would be perfect for your needs. Based on what you've told me, I'll find the best options available right now.",
        nextStep: 'knowledge' as const
      },
      knowledge: {
        message: "All of these tools have their strengths! What matters most to you - ease of use, advanced features, or value for money?",
        nextStep: 'success' as const
      },
      success: {
        message: "Perfect! Based on our conversation, I recommend starting with the tool that best fits your needs and experience level. You're all set to begin!",
        nextStep: 'complete' as const
      }
    };

    return {
      message: fallbacks[step as keyof typeof fallbacks]?.message || "Let's start over! What can I help you find today?",
      nextStep: fallbacks[step as keyof typeof fallbacks]?.nextStep || 'target'
    };
  }

  getSessionState(): TasksSession {
    return this.session;
  }
} 