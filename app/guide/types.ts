export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ToolRecommendation {
  name: string;
  compatibilityScore: number;
  reason: string;
  nextSteps: string;
  tags: ('human-reviewed' | 'trending' | 'region-matched')[];
}

export interface ChatResponse {
  response: string;
  recommendations?: ToolRecommendation[];
  error?: string;
}

export interface UserContext {
  isCorporate: boolean;
  department?: string;
  budget?: string;
  region?: string;
  preferences?: string[];
} 