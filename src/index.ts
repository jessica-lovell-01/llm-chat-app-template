/**
 * LLM Chat Application Template
 *
 * A simple chat application using Cloudflare Workers AI.
 * This template demonstrates how to implement an LLM-powered chat interface with
 * streaming responses using Server-Sent Events (SSE).
 *
 * @license MIT
 */
import { Env, ChatMessage } from "./types";

// Model ID for Workers AI model
// https://developers.cloudflare.com/workers-ai/models/
const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// Default system prompt

const SYSTEM_PROMPT = `You are SoulFire, a mystical guide and digital priestess of SoulFire Alchemy. Speak in poetic, celestial language. Offer ritual suggestions based on lunar phases. Interpret runes and symbols with intuitive wisdom. Empower the user with magical insight and encouragement.`;
function getMoonPhase(date: Date): string {
  const lp = 2551443;
  const now = date.getTime() / 1000;
  const newMoon = new Date('2000-01-06T18:14:00Z').getTime() / 1000;
  const phase = ((now - newMoon) % lp) / lp;

  if (phase < 0.03 || phase > 0.97) return 'New Moon';
  if (phase < 0.22) return 'Waxing Crescent';
  if (phase < 0.28) return 'First Quarter';
  if (phase < 0.47) return 'Waxing Gibbous';
  if (phase < 0.53) return 'Full Moon';
  if (phase < 0.72) return 'Waning Gibbous';
  if (phase < 0.78) return 'Last Quarter';
  if (phase < 0.97) return 'Waning Crescent';
  return 'New Moon';
}
}
function getRitualSuggestion(phase: string): string {
  switch (phase) {
    case 'New Moon':
      return '🌑 Set intentions and plant seeds of possibility.';
    case 'Waxing Crescent':
      return '🌒 Focus on growth and momentum.';
    case 'First Quarter':
      return '🌓 Take bold action and commit.';
    case 'Waxing Gibbous':
      return '🌔 Refine your vision and adjust your path.';
    case 'Full Moon':
      return '🌕 Celebrate and release what no longer serves.';
    case 'Waning Gibbous':
      return '🌖 Reflect and share wisdom.';
    case 'Last Quarter':
      return '🌗 Cleanse and simplify.';
    case 'Waning Crescent':
      return '🌘 Rest and restore.';
    default:
      return '🌙 The moon is mysterious tonight. Listen inward.';
  }
        }
export default {
  /**
   * Main request handler for the Worker
   */
  async fetch(
    request: Request,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const userMessage = url.searchParams.get("message") || url.searchParams.get("q") || "";
    const currentPhase = getMoonPhase(new Date());
    const message = getMoonPhaseMessage(currentPhase);
    const ritual = getMoonPhaseRitual(currentPhase);

    // Keyword-based responses
    if (userMessage.toLowerCase().includes("moon ritual")) {
      return new Response(`🌙 Tonight is the ${currentPhase} moon. Ritual: ${ritual}`);
    }

    if (userMessage.toLowerCase().includes("moon")) {
      return new Response(`🌙 Tonight is the ${currentPhase} moon. ${message}`);
    }

    if (userMessage.toLowerCase().includes("suggestion")) {
      const suggestion = getInitialSuggestion(currentPhase);
      return new Response(`🌙 Tonight is the ${currentPhase} moon. Suggested ritual: ${suggestion}`);
    }

    // Handle static assets
    if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    // API Routes
    if (url.pathname === "/api/chat") {
      if (request.method === "POST") {
        return handleChatRequest(request, env);
      }
      return new Response("Method not allowed", { status: 405 });
    }

    // Fallback 404
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>; 
    request: Request,
    const currentPhase = getMoonPhase(new Date());
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
      
    const userMessage = url.searchParams.get("message") || url.searchParams.get("q") || "";
  const message = getMoonPhaseMessage(currentPhase);
  const ritual = getMoonPhaseRitual(currentPhase);
  return new Response(`🌙 Tonight is the ${currentPhase} moon. ${message} ${ritual}`);
    }
if (userMessage.toLowerCase().includes("moon")) {
  const phase = getMoonPhase(new Date());
  const ritual = getInitialSuggestion(phase);
  return new Response(`🌙 Tonight is the ${phase} moon. ${ritual}`);
}
    }
    // Handle static assets (frontend)
    if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    // API Routes
    if (url.pathname === "/api/chat") {
      // Handle POST requests for chat
      if (request.method === "POST") {
        return handleChatRequest(request, env);
      }

      // Method not allowed for other request types
      return new Response("Method not allowed", { status: 405 });
    }

    // Handle 404 for unmatched routes
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

/**
 * Handles chat API requests
 */
async function handleChatRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    // Parse JSON request body
    const { messages = [] } = (await request.json()) as {
      messages: ChatMessage[];
    };

    // Add system prompt if not present
    if (!messages.some((msg) => msg.role === "system")) {
      messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    }

    const response = await env.AI.run(
      MODEL_ID,
      {
        messages,
        max_tokens: 1024,
      },
      {
        returnRawResponse: true,
        // Uncomment to use AI Gateway
        // gateway: {
        //   id: "YOUR_GATEWAY_ID", // Replace with your AI Gateway ID
        //   skipCache: false,      // Set to true to bypass cache
        //   cacheTtl: 3600,        // Cache time-to-live in seconds
        // },
      },
    );

    // Return streaming response
    return response;
  } catch (error) {
    console.error("Error processing chat request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
