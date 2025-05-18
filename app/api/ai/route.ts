import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, hasCredits } = await req.json();

    if (!hasCredits) {
      return new Response(
        JSON.stringify({ error: "Payment required for consultation" }),
        { status: 402 }
      );
    }

    const result = streamText({
      model: openai('gpt-4-turbo-preview'),
      messages: [
        {
          role: "system",
          content: `You are Madame Dappai, a sophisticated and knowledgeable AI consultant specializing in AI tools and applications. 
          You have a warm yet professional demeanor and speak with authority about AI technology.
          Your responses should be insightful, practical, and occasionally include relevant examples or use cases.
          When recommending tools, consider factors like:
          - User's specific needs and use cases
          - Tool's features and limitations
          - Pricing and value proposition
          - Integration capabilities
          - Learning curve and user experience
          Always maintain a helpful and encouraging tone while being honest about both benefits and limitations.`
        },
        ...messages
      ]
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('AI consultation error:', error);
    return new Response(
      JSON.stringify({ error: "Failed to process consultation" }),
      { status: 500 }
    );
  }
} 