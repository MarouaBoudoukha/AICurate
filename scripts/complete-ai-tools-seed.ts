import { PrismaClient, PricingModel, Complexity, ToolStatus } from '@prisma/client';

const prisma = new PrismaClient();

// All AI Tools from both Top 50 lists
const allAITools = [
  // Web Products
  { name: "ChatGPT", slug: "chatgpt", description: "Advanced conversational AI assistant", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://chat.openai.com", rating: 4.8, popularity: 100, isVerified: true, isTrending: true, isFeatured: true },
  { name: "DeepSeek", slug: "deepseek", description: "AI-powered code completion assistant", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://deepseek.com", rating: 4.6, popularity: 85, isVerified: true },
  { name: "Character.ai", slug: "character-ai", description: "Create and chat with AI characters", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://character.ai", rating: 4.4, popularity: 90, isVerified: true, isTrending: true },
  { name: "Perplexity", slug: "perplexity", description: "AI-powered search engine", category: "Search & Research", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://perplexity.ai", rating: 4.7, popularity: 88, isVerified: true, isTrending: true },
  { name: "JanitorAI", slug: "janitor-ai", description: "AI chatbot platform for character interactions", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://janitorai.com", rating: 4.2, popularity: 75, isVerified: true },
  { name: "Claude", slug: "claude", description: "Anthropic's AI assistant", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://claude.ai", rating: 4.8, popularity: 92, isVerified: true, isTrending: true },
  { name: "QuillBot", slug: "quillbot", description: "AI-powered paraphrasing tool", category: "Writing Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://quillbot.com", rating: 4.5, popularity: 85, isVerified: true },
  { name: "SUNO", slug: "suno", description: "AI music generation platform", category: "Audio & Music", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://suno.ai", rating: 4.6, popularity: 80, isVerified: true, isTrending: true },
  { name: "Spicychat.ai", slug: "spicychat-ai", description: "AI chatbot platform", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://spicychat.ai", rating: 4.1, popularity: 65, isVerified: true },
  { name: "Doubao", slug: "doubao", description: "ByteDance's AI assistant", category: "Conversational AI", pricingModel: PricingModel.FREE, freeTier: true, complexity: Complexity.SIMPLE, website: "https://doubao.com", rating: 4.3, popularity: 70, isVerified: true, isRegionSpecific: "China" },
  { name: "Moonshot AI", slug: "moonshot-ai", description: "Chinese AI conversational platform", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://moonshot.ai", rating: 4.4, popularity: 60, isVerified: true },
  { name: "Hailuo AI", slug: "hailuo-ai", description: "AI video generation platform", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://hailuo.ai", rating: 4.2, popularity: 55, isVerified: true },
  { name: "Hugging Face", slug: "hugging-face", description: "Open-source AI model hub", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.ADVANCED, website: "https://huggingface.co", rating: 4.8, popularity: 95, isVerified: true, isTrending: true },
  { name: "Poe", slug: "poe", description: "Quora's AI chatbot platform", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://poe.com", rating: 4.5, popularity: 82, isVerified: true },
  { name: "Adot", slug: "adot", description: "AI-powered search platform", category: "Search & Research", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://adot.ai", rating: 4.1, popularity: 45, isVerified: true },
  { name: "Eden AI", slug: "eden-ai", description: "AI API aggregator platform", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.ADVANCED, website: "https://edenai.co", rating: 4.3, popularity: 50, isVerified: true },
  { name: "PolyBuzz", slug: "polybuzz", description: "AI social media content tool", category: "Social Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://polybuzz.ai", rating: 4.2, popularity: 55, isVerified: true },
  { name: "Serrat.ai", slug: "serrat-ai", description: "AI writing assistant", category: "Writing Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://serrat.ai", rating: 4.0, popularity: 40, isVerified: true },
  { name: "Liner", slug: "liner", description: "AI research and highlighting tool", category: "Productivity", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://liner.ai", rating: 4.4, popularity: 65, isVerified: true },
  { name: "Kling AI", slug: "kling-ai", description: "AI video generation platform", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://kling.ai", rating: 4.3, popularity: 60, isVerified: true, isTrending: true },
  { name: "CivitAI", slug: "civitai", description: "AI model sharing platform", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.ADVANCED, website: "https://civitai.com", rating: 4.5, popularity: 70, isVerified: true },
  { name: "ElevenLabs", slug: "elevenlabs", description: "AI voice generation platform", category: "Audio & Music", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://elevenlabs.io", rating: 4.7, popularity: 85, isVerified: true, isTrending: true },
  { name: "Sora", slug: "sora", description: "OpenAI's video generation model", category: "Video & Media", pricingModel: PricingModel.SUBSCRIPTION, freeTier: false, complexity: Complexity.MODERATE, website: "https://openai.com/sora", rating: 4.8, popularity: 95, isVerified: true, isTrending: true },
  { name: "Crushon AI", slug: "crushon-ai", description: "AI character chat platform", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://crushon.ai", rating: 4.2, popularity: 60, isVerified: true },
  { name: "Blackbox AI", slug: "blackbox-ai", description: "AI coding assistant", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://blackbox.ai", rating: 4.4, popularity: 65, isVerified: true },
  { name: "DeepAI", slug: "deepai", description: "AI tools and APIs platform", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://deepai.org", rating: 4.3, popularity: 55, isVerified: true },
  { name: "Gamma", slug: "gamma", description: "AI presentation creation tool", category: "Productivity", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://gamma.app", rating: 4.6, popularity: 78, isVerified: true, isTrending: true },
  { name: "Leonardo AI", slug: "leonardo-ai", description: "AI image generation platform", category: "Image Generation", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://leonardo.ai", rating: 4.5, popularity: 75, isVerified: true },
  { name: "Cutout.pro", slug: "cutout-pro", description: "AI photo editing platform", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://cutout.pro", rating: 4.3, popularity: 60, isVerified: true },
  { name: "Brainly", slug: "brainly", description: "AI-powered homework help", category: "Education", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://brainly.com", rating: 4.4, popularity: 80, isVerified: true },
  { name: "Photoroom", slug: "photoroom", description: "AI background removal tool", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://photoroom.com", rating: 4.5, popularity: 75, isVerified: true },
  { name: "Messcape AI", slug: "messcape-ai", description: "AI messaging platform", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://messcape.ai", rating: 4.2, popularity: 50, isVerified: true },
  { name: "Midjourney", slug: "midjourney", description: "AI image generation platform", category: "Image Generation", pricingModel: PricingModel.SUBSCRIPTION, freeTier: false, complexity: Complexity.MODERATE, website: "https://midjourney.com", rating: 4.7, popularity: 95, isVerified: true, isTrending: true, isFeatured: true },
  { name: "Candy.ai", slug: "candy-ai", description: "AI companion platform", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://candy.ai", rating: 4.1, popularity: 55, isVerified: true },
  { name: "Zeemo", slug: "zeemo", description: "AI video subtitle generator", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://zeemo.ai", rating: 4.4, popularity: 65, isVerified: true },
  { name: "Veed", slug: "veed", description: "AI video editing platform", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://veed.io", rating: 4.5, popularity: 70, isVerified: true },
  { name: "Invideo AI", slug: "invideo-ai", description: "AI video creation platform", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://invideo.io", rating: 4.4, popularity: 68, isVerified: true },
  { name: "Pixelcut", slug: "pixelcut", description: "AI photo editing app", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://pixelcut.ai", rating: 4.3, popularity: 60, isVerified: true },
  { name: "Talkie", slug: "talkie-web", description: "AI character chat platform", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://talkie.ai", rating: 4.3, popularity: 65, isVerified: true },
  { name: "PixAI", slug: "pixai", description: "AI art generation platform", category: "Image Generation", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://pixai.art", rating: 4.4, popularity: 70, isVerified: true },
  { name: "Monica", slug: "monica", description: "AI assistant browser extension", category: "Productivity", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://monica.im", rating: 4.3, popularity: 60, isVerified: true },
  { name: "Cursor", slug: "cursor", description: "AI code editor", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://cursor.sh", rating: 4.6, popularity: 75, isVerified: true, isTrending: true },
  { name: "Ideogram", slug: "ideogram", description: "AI image generation with text", category: "Image Generation", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.MODERATE, website: "https://ideogram.ai", rating: 4.5, popularity: 70, isVerified: true },
  { name: "Chub", slug: "chub", description: "AI character platform", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://chub.ai", rating: 4.2, popularity: 55, isVerified: true },
  { name: "Clipchamp", slug: "clipchamp", description: "Microsoft's AI video editor", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://clipchamp.com", rating: 4.4, popularity: 70, isVerified: true },
  { name: "Meta AI", slug: "meta-ai", description: "Meta's AI assistant", category: "Conversational AI", pricingModel: PricingModel.FREE, freeTier: true, complexity: Complexity.SIMPLE, website: "https://ai.meta.com", rating: 4.3, popularity: 80, isVerified: true },
  { name: "StudyX", slug: "studyx", description: "AI homework helper", category: "Education", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://studyx.ai", rating: 4.4, popularity: 65, isVerified: true },
  { name: "Bolt", slug: "bolt", description: "AI development platform", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.ADVANCED, website: "https://bolt.new", rating: 4.5, popularity: 70, isVerified: true, isTrending: true },
  { name: "PicWish", slug: "picwish", description: "AI photo editing tool", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://picwish.com", rating: 4.3, popularity: 60, isVerified: true },
  { name: "Joyland", slug: "joyland", description: "AI character roleplay platform", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, complexity: Complexity.SIMPLE, website: "https://joyland.ai", rating: 4.2, popularity: 55, isVerified: true },

  // Mobile Apps
  { name: "NOVA AI Chatbot", slug: "nova-ai-chatbot", description: "Advanced AI chatbot mobile app", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://nova-ai.app", rating: 4.5, popularity: 85, isVerified: true },
  { name: "Microsoft Edge Mobile", slug: "microsoft-edge-mobile", description: "AI-enhanced mobile browser", category: "Browsers", pricingModel: PricingModel.FREE, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://microsoft.com/edge", rating: 4.3, popularity: 90, isVerified: true },
  { name: "Baidu AI Search", slug: "baidu-ai-search", description: "AI-powered mobile search", category: "Search & Research", pricingModel: PricingModel.FREE, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://baidu.com", rating: 4.2, popularity: 80, isVerified: true, isRegionSpecific: "China" },
  { name: "PhotoMath", slug: "photomath", description: "AI math problem solver", category: "Education", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://photomath.com", rating: 4.7, popularity: 95, isVerified: true, isFeatured: true },
  { name: "Quark AI Assistant", slug: "quark-ai-assistant", description: "Comprehensive AI assistant app", category: "Productivity", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://quark.ai", rating: 4.4, popularity: 75, isVerified: true },
  { name: "Talkie Mobile", slug: "talkie-mobile", description: "AI character chat mobile app", category: "Entertainment", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://talkie.ai", rating: 4.3, popularity: 80, isVerified: true },
  { name: "B612", slug: "b612", description: "AI camera and photo editor", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://b612kaji.com", rating: 4.4, popularity: 75, isVerified: true },
  { name: "Remini", slug: "remini", description: "AI photo enhancer mobile app", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://remini.ai", rating: 4.6, popularity: 90, isVerified: true, isTrending: true },
  { name: "DeepSeek Mobile", slug: "deepseek-mobile", description: "AI coding assistant mobile", category: "Development Tools", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.MODERATE, website: "https://deepseek.com", rating: 4.5, popularity: 70, isVerified: true },
  { name: "VivaCut", slug: "vivacut", description: "AI video editing mobile app", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.MODERATE, website: "https://vivacut.app", rating: 4.5, popularity: 85, isVerified: true },
  { name: "Chatbot AI Search Assistant", slug: "chatbot-ai-search-assistant", description: "Mobile AI search assistant", category: "Conversational AI", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://chatbot-search.app", rating: 4.2, popularity: 70, isVerified: true },
  { name: "Mertu", slug: "mertu", description: "AI social networking app", category: "Social Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://mertu.app", rating: 4.1, popularity: 60, isVerified: true },
  { name: "FaceApp", slug: "faceapp", description: "AI face editing mobile app", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://faceapp.com", rating: 4.4, popularity: 88, isVerified: true },
  { name: "Filmora Mobile", slug: "filmora-mobile", description: "AI video editing mobile app", category: "Video & Media", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.MODERATE, website: "https://filmora.wondershare.com", rating: 4.5, popularity: 82, isVerified: true },
  { name: "BeautyPlus", slug: "beautyplus", description: "AI beauty camera app", category: "Photo & Video", pricingModel: PricingModel.FREEMIUM, freeTier: true, mobileApp: true, complexity: Complexity.SIMPLE, website: "https://beautyplus.com", rating: 4.3, popularity: 85, isVerified: true }
];

async function seedAllAITools() {
  console.log('🚀 Starting comprehensive AI tools database seeding...');
  console.log(`📊 Total tools to process: ${allAITools.length}`);

  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const tool of allAITools) {
    try {
      const existingTool = await prisma.aITool.findUnique({
        where: { slug: tool.slug }
      });

      if (existingTool) {
        console.log(`⏭️  ${tool.name} already exists, skipping...`);
        skippedCount++;
        continue;
      }

      await prisma.aITool.create({
        data: {
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          category: tool.category,
          subcategory: tool.subcategory || "General",
          pricingModel: tool.pricingModel,
          pricingDetails: tool.pricingDetails || "See website for pricing",
          freeTier: tool.freeTier || false,
          startingPrice: tool.startingPrice || null,
          features: tool.features || [],
          useCases: tool.useCases || [],
          complexity: tool.complexity,
          targetAudience: tool.targetAudience || ["General Users"],
          integrations: tool.integrations || [],
          apiAvailable: tool.apiAvailable || false,
          mobileApp: tool.mobileApp || false,
          browserExtension: tool.browserExtension || false,
          compliance: tool.compliance || [],
          rating: tool.rating || null,
          reviewCount: tool.reviewCount || 0,
          popularity: tool.popularity || 50,
          monthlyUsers: tool.monthlyUsers || null,
          website: tool.website,
          signupUrl: tool.signupUrl || null,
          demoUrl: tool.demoUrl || null,
          documentationUrl: tool.documentationUrl || null,
          supportUrl: tool.supportUrl || null,
          logo: tool.logo || null,
          screenshots: tool.screenshots || [],
          videoUrl: tool.videoUrl || null,
          isVerified: tool.isVerified || false,
          isTrending: tool.isTrending || false,
          isRegionSpecific: tool.isRegionSpecific || null,
          isFeatured: tool.isFeatured || false,
          launchDate: tool.launchDate || null,
          lastUpdate: tool.lastUpdate || null,
          addedBy: 'system-comprehensive-seed',
          verifiedBy: 'system-comprehensive-seed',
          status: ToolStatus.ACTIVE
        }
      });

      console.log(`✅ Added ${tool.name}`);
      addedCount++;

    } catch (error) {
      console.error(`❌ Error adding ${tool.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n🎉 Comprehensive AI tools seeding completed!');
  console.log(`📈 Summary:`);
  console.log(`   ✅ Added: ${addedCount} tools`);
  console.log(`   ⏭️  Skipped: ${skippedCount} tools`);
  console.log(`   ❌ Errors: ${errorCount} tools`);
  
  const totalTools = await prisma.aITool.count();
  console.log(`📊 Total AI tools in database: ${totalTools}`);
}

// Run the comprehensive seed function
seedAllAITools()
  .catch((e) => {
    console.error('💥 Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 