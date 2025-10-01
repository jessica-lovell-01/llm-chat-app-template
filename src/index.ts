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

  async fetch(request: Request, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const userMessage = url.searchParams.get("message") || url.searchParams.get("q") || "";
    const currentPhase = getMoonPhase(new Date());
    const ritual = getMoonPhaseRitual(currentPhase);
    const message = getMoonPhaseMessage(currentPhase);

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

    // Static assets
    if (url.pathname === "/" || url.pathname === "/favicon.ico") {
      return env.ASSETS.fetch(request);
    }

    // Chat API
    if (url.pathname === "/api/chat") {
      if (request.method === "POST") {
        return handleChatRequest(request, env);
      }
      return new Response("Method not allowed", { status: 405 });
    }

    // Fallback
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
} satisfies ExportedHandler<Env>;

      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
