// prisma/seed-data/ai-tools.ts
import { PricingModel, Complexity, ToolStatus } from '@prisma/client';

export const aiToolsData = [
  // 1. ChatGPT
  {
    name: "ChatGPT",
    slug: "chatgpt",
    description: "Advanced conversational AI for writing, coding, research, and general assistance.",
    category: "Conversational AI",
    pricingModel: "FREEMIUM",
    features: ["Text generation", "Code assistance", "Research help"],
    regionTags: ["global"],
    curationTags: ["✅ Human-reviewed", "🔥 Trending"],
    website: "https://chat.openai.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    status: "ACTIVE"
  },
  {
    name: "deepseek",
    slug: "deepseek",
    description: "AI-powered search and research assistant.",
    category: "Search AI",
    pricingModel: "FREEMIUM",
    features: ["Web search", "Research summarization"],
    regionTags: ["global"],
    curationTags: ["✅ Human-reviewed"],
    website: "https://www.deepseek.com",
    logo: "",
    status: "ACTIVE"
  },
  {
    name: "character.ai",
    slug: "character-ai",
    description: "Conversational AI for roleplay and character simulation.",
    category: "Conversational AI",
    pricingModel: "FREEMIUM",
    features: ["Roleplay", "Custom characters"],
    regionTags: ["global"],
    curationTags: ["✅ Human-reviewed"],
    website: "https://character.ai",
    logo: "",
    status: "ACTIVE"
  },
  // ...
  // Repeat for all 50 tools from the image, using placeholders for missing metadata
  // Example:
  // {
  //   name: "Midjourney",
  //   slug: "midjourney",
  //   description: "AI-powered image generation from text prompts.",
  //   category: "Image Generation",
  //   pricingModel: "SUBSCRIPTION",
  //   features: ["Text-to-image", "Artistic styles"],
  //   regionTags: ["global"],
  //   curationTags: ["✅ Human-reviewed", "🔥 Trending"],
  //   website: "https://www.midjourney.com",
  //   logo: "",
  //   status: "ACTIVE"
  // },
];

// Export categories for easier management
export const categories = [
  "Conversational AI",
  "Image Generation",
  "Video Generation", 
  "Content Creation",
  "Writing Assistant",
  "Productivity",
  "Development",
  "Design",
  "Automation",
  "Analytics",
  "Customer Support",
  "Sales & Marketing",
  "HR & Recruiting",
  "Finance & Accounting",
  "Research & Data",
  "Translation",
  "Education",
  "Healthcare",
  "Legal",
  "Audio & Music"
];

export const complexityLevels = ["SIMPLE", "MODERATE", "ADVANCED"];
export const pricingModels = ["FREE", "FREEMIUM", "SUBSCRIPTION", "PAY_PER_USE", "ENTERPRISE", "ONE_TIME"];
export const targetAudiences = ["individual", "small_business", "enterprise"];
 