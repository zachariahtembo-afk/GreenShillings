/**
 * GREENSHILLING OpenAI Chat Service
 *
 * Powers the AI assistant on the contact page, helping visitors understand
 * GREENSHILLING's mission, carbon methodologies, and project economics.
 * Bridges the "Standards Literacy" gap by making complex information accessible.
 *
 * Features:
 * - Rate limiting: 10 messages/hour for public, unlimited for partners
 * - Conversation logging for analytics
 * - Human handoff escalation
 */

import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// OpenAI client (lazy-initialized)
let openaiClient: OpenAI | null = null;

// Environment configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Rate limiting configuration
const PUBLIC_RATE_LIMIT = 3; // messages per session for public visitors
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24-hour window (session-like)

/**
 * GREENSHILLING knowledge base - core information for the AI assistant
 */
const GREENSHILLING_CONTEXT = `
You are the GREENSHILLING AI Assistant, helping visitors understand our mission and work.

## About GREENSHILLING
GREENSHILLING is an advocacy-led organisation focused on equitable carbon finance in Tanzania.
We use pilot projects to demonstrate what fair carbon finance looks like—not to scale carbon credit production.
Our name combines "Green" (environmental focus) with "Shillings" (East African currency), symbolising our mission to ensure climate finance benefits local communities.

## Our Three Pillars
1. **Pilot Projects**: High-integrity carbon projects developed with communities from day one, following Verra VCS, Gold Standard, and Plan Vivo frameworks.
2. **Advocacy & Standards Literacy**: We produce plain-language guides to carbon standards and policy recommendations for equitable markets.
3. **Capital & Knowledge Pipelines**: We connect impact-oriented capital directly to community-led restoration, reducing intermediation.

## Key Commitments
- 80% of every dollar goes directly to community projects
- 15% covers operations
- 5% funds advocacy and research
- 0% hidden fees - full transparency guaranteed

## Current Focus & Impact
- Agroforestry and land restoration in rural Tanzania
- Working with communities in Dedza, Ntchisi, and Zomba districts
- 5,000+ trees planted across active project sites
- 3 community partnerships established
- 12+ hectares under restoration
- Community ownership of outcomes and decision-making

## What We Are NOT
- We are NOT a carbon credit retailer or broker
- We do NOT prioritise credit volume over community benefit
- We do NOT obscure project economics from communities
- We are NOT a marketplace or platform connecting buyers and sellers

## Carbon Standards & Methodology
- **Verra VCS** (Verified Carbon Standard) - Most widely used voluntary standard
- **Gold Standard** - Highest integrity standard with strong co-benefits requirements
- **Plan Vivo** - Community-focused standard ideal for smallholder projects
- We use IPCC methodologies for carbon estimation
- All projects undergo third-party verification

## For Institutional Partners
Partners receive secure access to:
- Live progress tracking with real-time field updates
- Geographic verification through satellite imagery analysis
- Comprehensive outcome documentation
- Carbon sequestration estimates and vegetation health assessments

## How Donations Work
- One-time or monthly contributions accepted
- Donors can opt-in to milestone SMS/WhatsApp notifications
- Receive real-time updates when trees are planted, communities trained, or milestones reached
- Full transparency on how funds are allocated

## Response Guidelines
- Be helpful, accurate, and concise
- Explain complex carbon market concepts in plain language
- Direct users to specific pages: /work (advocacy work), /integrity (our integrity framework), /donate (support us), /projects (our projects), /partners (partner with us), /contact (get in touch)
- Be honest about limitations - we are in early stages
- For partnership inquiries, guide them to the contact page or suggest speaking with the team directly
- Never make up information - if unsure, say so
- If asked about detailed financials, partnerships, or custom arrangements, suggest they "speak with our team directly" and offer to connect them

## Handling Human Handoff
If users ask about:
- Detailed partnership terms or custom arrangements
- Large donations or institutional funding
- Technical questions you can't answer
- Expressing frustration or wanting to speak to a human
Respond helpfully but suggest: "For this kind of inquiry, I'd recommend speaking directly with our team. Would you like me to connect you with someone?"

## Contact Information
- Email: hello@greenshilling.org
- Partnership inquiries: hello@greenshilling.org
- Based in Dar es Salaam, Tanzania
`;

/**
 * Hash an IP address for privacy-preserving rate limiting
 */
function hashIp(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + 'greenshilling-salt')
    .digest('hex')
    .slice(0, 32);
}

/**
 * Get or initialize the OpenAI client
 */
export function getOpenAIClient(): OpenAI | null {
  if (!OPENAI_API_KEY) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

/**
 * Check if OpenAI is configured and enabled
 */
export function isOpenAIEnabled(): boolean {
  return !!OPENAI_API_KEY;
}

/**
 * Chat message type
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Chat response result
 */
export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  tokensUsed?: number;
  conversationId?: string;
  remainingMessages?: number;
  escalationRequested?: boolean;
}

/**
 * Rate limit check result
 */
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt?: Date;
}

/**
 * Check rate limit for a user
 */
export async function checkRateLimit(
  identifier: string,
  isPartner: boolean = false,
): Promise<RateLimitResult> {
  // Partners have unlimited access
  if (isPartner) {
    return { allowed: true, remaining: Infinity };
  }

  const hashedId = hashIp(identifier);
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  // Get or create rate limit record
  const rateLimit = await prisma.chatRateLimit.findUnique({
    where: { identifier: hashedId },
  });

  if (!rateLimit) {
    // First message from this user
    const created = await prisma.chatRateLimit.create({
      data: {
        identifier: hashedId,
        messageCount: 1,
        windowStart: new Date(),
        isPartner: false,
      },
    });
    return {
      allowed: true,
      remaining: Math.max(PUBLIC_RATE_LIMIT - created.messageCount, 0),
    };
  }

  // Check if window has expired
  if (rateLimit.windowStart < windowStart) {
    // Reset the window
    const updated = await prisma.chatRateLimit.update({
      where: { identifier: hashedId },
      data: {
        messageCount: 1,
        windowStart: new Date(),
      },
    });
    return {
      allowed: true,
      remaining: Math.max(PUBLIC_RATE_LIMIT - updated.messageCount, 0),
    };
  }

  // Check if under limit
  if (rateLimit.messageCount >= PUBLIC_RATE_LIMIT) {
    const resetAt = new Date(rateLimit.windowStart.getTime() + RATE_LIMIT_WINDOW_MS);
    return { allowed: false, remaining: 0, resetAt };
  }

  // Increment and allow
  const updated = await prisma.chatRateLimit.update({
    where: { identifier: hashedId },
    data: { messageCount: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: Math.max(PUBLIC_RATE_LIMIT - updated.messageCount, 0),
  };
}

/**
 * Get or create a conversation
 */
export async function getOrCreateConversation(
  sessionId: string,
  visitorIp?: string,
  isPartner: boolean = false,
  partnerId?: string,
): Promise<string> {
  // Try to find existing conversation for this session
  const existing = await prisma.chatConversation.findFirst({
    where: {
      sessionId,
      startedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    },
    orderBy: { startedAt: 'desc' },
  });

  if (existing) {
    return existing.id;
  }

  // Create new conversation
  const conversation = await prisma.chatConversation.create({
    data: {
      sessionId,
      visitorIp: visitorIp ? hashIp(visitorIp) : undefined,
      isPartner,
      partnerId,
    },
  });

  return conversation.id;
}

/**
 * Log a message to a conversation
 */
async function logMessage(
  conversationId: string,
  role: 'USER' | 'ASSISTANT' | 'SYSTEM',
  content: string,
  tokensUsed?: number,
): Promise<void> {
  await prisma.chatMessage.create({
    data: {
      conversationId,
      role,
      content,
      tokensUsed,
    },
  });

  // Update conversation stats
  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      messageCount: { increment: 1 },
      tokensUsed: tokensUsed ? { increment: tokensUsed } : undefined,
      lastMessageAt: new Date(),
    },
  });
}

/**
 * Request human handoff for a conversation
 */
export async function requestHumanHandoff(
  conversationId: string,
  reason: string,
): Promise<{ success: boolean; message: string }> {
  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      escalatedAt: new Date(),
      escalationReason: reason,
    },
  });

  // TODO: In production, this would:
  // 1. Send email notification to team
  // 2. Create a support ticket
  // 3. Potentially trigger Slack/Teams notification

  return {
    success: true,
    message:
      "I've flagged this conversation for our team. Someone will reach out to you soon at the email address on your inquiry, or you can email us directly at hello@greenshilling.org.",
  };
}

/**
 * Send a chat message and get a response
 */
export async function chat(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  options: {
    sessionId?: string;
    visitorIp?: string;
    isPartner?: boolean;
    partnerId?: string;
    conversationId?: string;
  } = {},
): Promise<ChatResponse> {
  const client = getOpenAIClient();

  if (!client) {
    return {
      success: false,
      error: 'AI chat is not available. Please contact us directly at hello@greenshilling.org',
    };
  }

  // Check rate limit for non-partners
  let remainingMessages: number | undefined;
  if (options.visitorIp && !options.isPartner) {
    const rateLimitResult = await checkRateLimit(options.visitorIp, options.isPartner);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: 'limit_reached',
        message:
          "Thanks for your interest in GreenShilling! For more detailed questions, our team would love to hear from you directly.",
        remainingMessages: 0,
      };
    }
    remainingMessages = rateLimitResult.remaining;
  }

  // Get or create conversation for logging
  let conversationId = options.conversationId;
  if (options.sessionId && !conversationId) {
    conversationId = await getOrCreateConversation(
      options.sessionId,
      options.visitorIp,
      options.isPartner,
      options.partnerId,
    );
  }

  try {
    // Check if user is asking to speak to a human
    const humanHandoffKeywords = [
      'speak to human',
      'talk to someone',
      'real person',
      'speak to a person',
      'contact team',
      'talk to team',
      'human please',
      'actual person',
    ];
    const lowerMessage = userMessage.toLowerCase();
    const wantsHuman = humanHandoffKeywords.some((kw) => lowerMessage.includes(kw));

    if (wantsHuman && conversationId) {
      const handoffResult = await requestHumanHandoff(conversationId, userMessage);
      return {
        success: true,
        message: handoffResult.message,
        conversationId,
        escalationRequested: true,
      };
    }

    // Log user message
    if (conversationId) {
      await logMessage(conversationId, 'USER', userMessage);
    }

    // Build messages array with system context
    const messages: ChatMessage[] = [
      { role: 'system', content: GREENSHILLING_CONTEXT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage },
    ];

    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content;
    const tokensUsed = response.usage?.total_tokens;

    if (!assistantMessage) {
      return {
        success: false,
        error: 'No response from AI',
      };
    }

    // Log assistant response
    if (conversationId) {
      await logMessage(conversationId, 'ASSISTANT', assistantMessage, tokensUsed);
    }

    return {
      success: true,
      message: assistantMessage,
      tokensUsed,
      conversationId,
      remainingMessages,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('OpenAI chat error:', errorMessage);

    return {
      success: false,
      error: 'Sorry, I encountered an issue. Please try again or contact us directly.',
    };
  }
}

/**
 * Get a quick answer to common questions (no conversation history)
 */
export async function quickAnswer(question: string): Promise<ChatResponse> {
  return chat(question, []);
}

/**
 * Suggested questions for the chat interface
 */
export const SUGGESTED_QUESTIONS = [
  'How does GREENSHILLING ensure 80% reaches communities?',
  'What carbon standards do you follow?',
  'How can I support your work?',
  'What makes your approach different?',
  'How do you measure impact?',
  'Can I visit your projects in Tanzania?',
];

/**
 * Get conversation history for a session (for partners)
 */
export async function getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
  const messages = await prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });

  return messages.map((m) => ({
    role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
    content: m.content,
  }));
}

/**
 * Get chat analytics (for admin dashboard)
 */
export async function getChatAnalytics(days: number = 30): Promise<{
  totalConversations: number;
  totalMessages: number;
  escalations: number;
  partnerConversations: number;
  publicConversations: number;
}> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [total, escalated, partner, messages] = await Promise.all([
    prisma.chatConversation.count({ where: { startedAt: { gte: since } } }),
    prisma.chatConversation.count({
      where: { startedAt: { gte: since }, escalatedAt: { not: null } },
    }),
    prisma.chatConversation.count({ where: { startedAt: { gte: since }, isPartner: true } }),
    prisma.chatMessage.count({ where: { createdAt: { gte: since } } }),
  ]);

  return {
    totalConversations: total,
    totalMessages: messages,
    escalations: escalated,
    partnerConversations: partner,
    publicConversations: total - partner,
  };
}
