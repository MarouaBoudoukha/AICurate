import { UserContext, ToolRecommendation } from './types';

export const formatToolRecommendation = (tool: ToolRecommendation): string => {
  const tags = tool.tags.map(tag => {
    switch (tag) {
      case 'human-reviewed':
        return '✅ Human-reviewed';
      case 'trending':
        return '🔥 Trending';
      case 'region-matched':
        return '🌍 Region-Matched';
      default:
        return '';
    }
  }).filter(Boolean).join(' | ');

  return `
✅ Recommended AI Tool: ${tool.name}
🌟 AIcurate Compatibility Score™: ${tool.compatibilityScore}/100
📌 Why this tool? ${tool.reason}
🚀 Next Steps: ${tool.nextSteps}
${tags ? `\nTags: ${tags}` : ''}
  `.trim();
};

export const getInitialContext = (): UserContext => ({
  isCorporate: false,
  preferences: [],
});

export const updateUserContext = (
  currentContext: UserContext,
  message: string
): UserContext => {
  const context = { ...currentContext };
  
  // Detect if user is corporate
  if (message.toLowerCase().includes('company') || 
      message.toLowerCase().includes('business') ||
      message.toLowerCase().includes('enterprise')) {
    context.isCorporate = true;
  }

  // Extract department if mentioned
  const departments = ['hr', 'marketing', 'sales', 'operations', 'it'];
  departments.forEach(dept => {
    if (message.toLowerCase().includes(dept)) {
      context.department = dept;
    }
  });

  // Extract budget information
  const budgetMatch = message.match(/\$(\d+)/);
  if (budgetMatch) {
    context.budget = budgetMatch[1];
  }

  return context;
};

export const getConversationStarter = (context: UserContext): string => {
  if (context.isCorporate) {
    return "Which department(s) will primarily use these AI solutions?";
  }
  return "What task do you want to get done today?";
}; 