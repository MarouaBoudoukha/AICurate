export interface UserProfile {
  id: string;
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    budget: 'free' | 'low' | 'medium' | 'high';
    complexity: 'simple' | 'moderate' | 'advanced';
    useCase: 'personal' | 'business' | 'enterprise';
  };
}

export interface AITool {
  id?: string;
  name: string;
  description: string;
  category?: string;
  pricing: {
    model: 'free' | 'freemium' | 'subscription' | 'pay_per_use';
    details: string;
  };
  features: string[];
  complexity: 'simple' | 'moderate' | 'advanced';
  rating?: number;
  reviews?: number;
  url?: string;
}

export interface TasksSession {
  id: string;
  userId: string;
  step: 'target' | 'assess' | 'sample' | 'knowledge' | 'success' | 'complete';
  context: {
    userGoal: string;
    refinedGoal: string;
    constraints: Record<string, any>;
    recommendations: AITool[];
    userType?: 'individual' | 'business';
  };
  proofPointsEarned: number;
  startedAt: Date;
}

export interface AgentResponse {
  message: string;
  data?: {
    userType?: 'individual' | 'business';
    nextStep?: string;
    nextStepPreview?: string;
    constraints?: Record<string, any>;
    tools?: AITool[];
    comparison?: Record<string, {
      pros: string[];
      cons: string[];
      bestFor: string;
    }>;
    recommendation?: {
      tool: string;
      reasoning: string;
      nextSteps: string[];
      tips: string[];
      aiCurateScore: number;
    };
  };
  clarifyingQuestion?: string;
  nextStep: 'target' | 'assess' | 'sample' | 'knowledge' | 'success' | 'complete';
} 