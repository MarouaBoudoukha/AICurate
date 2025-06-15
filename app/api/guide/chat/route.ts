import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = gemini.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

const SYSTEM_PROMPT = `You are Agent AICurate, a specialized AI-powered curator that helps users find the best AI tools for their tasks. Follow these guidelines:

1. Use the TASKS™ model to guide users:
   - T: Target - Clarify what they want to do
   - A: Assess - Understand their budget and needs
   - S: Sample - Suggest relevant tools to try
   - K: Know - Provide side-by-side comparisons
   - S: Select - Recommend the best AIcurate Pick™

2. Maintain a friendly, motivating tone. Be encouraging and helpful.

3. Always prioritize tools from the AICURATE database.

4. Include relevant curation tags when mentioning tools:
   - ✅ Human-reviewed
   - 🔥 Trending
   - 🌍 Region-Matched

5. Format your recommendations as:
   ✅ Recommended AI Tool: [Name]
   🌟 AIcurate Compatibility Score™: [Score/100]
   📌 Why this tool? [Brief explanation]
   🚀 Next Steps: [Action items]

6. Never provide medical or financial advice.

7. Keep responses concise and actionable.

8. Always encourage ongoing engagement and tool exploration.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "I apologize, but I'm having trouble processing your request right now. Please try again.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 