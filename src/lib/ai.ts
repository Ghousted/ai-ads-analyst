import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { and, count, eq, gte } from 'drizzle-orm';
import { db, schema } from '@/db';

// Claude, through a gateway when one is configured. Order: AI_BASE_URL + AI_AUTH_TOKEN (e.g. the Eden gateway),
// then OpenRouter (OPENROUTER_API_KEY), then Anthropic directly (ANTHROPIC_API_KEY).
// Reports use Claude Sonnet 5.5; AI_MODEL overrides it.
const OPENROUTER = 'https://openrouter.ai/api';

function config() {
  if (process.env.AI_BASE_URL && process.env.AI_AUTH_TOKEN) return { baseURL: process.env.AI_BASE_URL, authToken: process.env.AI_AUTH_TOKEN, model: 'claude-sonnet-5-5' };
  if (process.env.OPENROUTER_API_KEY) return { baseURL: OPENROUTER, authToken: process.env.OPENROUTER_API_KEY, model: 'anthropic/claude-sonnet-5.5' };
  if (process.env.ANTHROPIC_API_KEY) return { baseURL: undefined, authToken: undefined, model: 'claude-sonnet-5-5' };
  return null;
}

let client: Anthropic | null | undefined;
export function getClaude(): Anthropic | null {
  if (client !== undefined) return client;
  const c = config();
  client = !c ? null : c.authToken ? new Anthropic({ baseURL: c.baseURL, authToken: c.authToken, apiKey: null }) : new Anthropic();
  return client;
}
export const aiModel = () => process.env.AI_MODEL || config()?.model || 'claude-sonnet-5-5';

// Per-agency daily limits on paid AI calls. Override with AI_LIMIT_<ACTION>, e.g. AI_LIMIT_REPORT=100.
const LIMITS: Record<string, number> = { report: 40, revise: 80, chat: 150 };

export async function takeAiQuota(agencyId: string, action: string): Promise<boolean> {
  const limit = Number(process.env['AI_LIMIT_' + action.toUpperCase()]) || LIMITS[action] || 20;
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  const [{ n }] = await db.select({ n: count() }).from(schema.aiUsage)
    .where(and(eq(schema.aiUsage.agencyId, agencyId), eq(schema.aiUsage.action, action), gte(schema.aiUsage.createdAt, since)));
  return n < limit;
}

export async function recordAiUsage(agencyId: string, action: string, usage?: { input_tokens?: number | null; output_tokens?: number | null }) {
  await db.insert(schema.aiUsage).values({ agencyId, action, inputTokens: usage?.input_tokens ?? 0, outputTokens: usage?.output_tokens ?? 0 });
}

// A short, user-facing reason for a failed AI call. Typed SDK errors, most specific first.
export function aiErrorMessage(e: unknown, fallback = 'Writing the report failed. Try again.'): string {
  if (e instanceof Anthropic.RateLimitError) return 'The AI service is busy. Try again in a minute.';
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return 'The AI key was rejected. Check the AI settings on the server.';
  if (e instanceof Anthropic.BadRequestError) return 'The AI service rejected the request.';
  if (e instanceof Anthropic.APIConnectionError) return 'Couldn’t reach the AI service. Try again.';
  if (e instanceof Anthropic.APIError) return 'The AI service had a problem (' + e.status + '). Try again.';
  return fallback;
}
