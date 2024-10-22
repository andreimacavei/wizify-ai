import OpenAI from 'openai';
// import { prisma } from '@/lib/db/db';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless' 
import { validateDomainAndUserKey } from '@/app/lib/actions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const language = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'nl': 'Dutch',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'tr': 'Turkish',
  'pl': 'Polish',
  'sv': 'Swedish',
  'da': 'Danish',
  'fi': 'Finnish',
  'el': 'Greek',
  'he': 'Hebrew',
  'ro': 'Romanian',
}

// TODO We cannot use edge runtime because of an incompatibility issue with NextAuth
// https://github.com/vercel/next.js/issues/50444
// We can either switch to Auth.js (Beta) or drop it and use a different auth provider such
// as Supabase

//  Set the runtime to edge for production and nodejs for development
export const runtime = process.env.NODE_ENV === "development"? 'nodejs':'edge';

// Create a new Prisma client
const neon = new Pool({ connectionString: process.env.POSTGRES_MICRO_AI_PRISMA_URL })
const adapter = new PrismaNeon(neon)
const prisma = new PrismaClient({ adapter })


export async function GET(req: Request) {
  // Extract the `prompt` from the body of the request
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const content = searchParams.get('content');

  if (!content || !action) {
    return new Response('Missing content or action', { status: 400 });
  }

  // Get domains with same hostname
  const domains = await prisma.domains.findMany({
    where: {
      hostname: req.headers.get('hostname'),
    },
  });
  if (!domains) {
    return new Response('Domain not found', { status: 401 });
  }

  // Check if any db entries is a validated domain
  let isValid = false, validatedDomain = null;
  domains.forEach((domain) => {
    if (domain.validated) {
      isValid = true;
      validatedDomain = domain;
    }
  });

  // If no validated domain found, validate the domain and user key
  if (!isValid) {
    validatedDomain = await validateDomainAndUserKey(domains, searchParams.get('userkey'));
  }
  
  if (!validatedDomain) {
    return new Response('Domain or userkey not found', { status: 403 });
  }
  const userId = validatedDomain.userId;
  
  // Check if the user has enough tokens to make the request
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      activeKey: searchParams.get('userkey'),
    },
  });
  
  if (!user) {
    return new Response('User has no active client keys', { status: 401 });
  }

  // Check if the current subscription has enough credits to make the request
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
    },
  });

  if (subscription.usedCredits >= subscription.credits) {
    return new Response('Not enough credits', { status: 402 });
  }

  let prompt = '';
  switch (action.toLowerCase()) {
    case 'fix_spelling':
      prompt = `Fix all grammar and spelling issues in the following text: "${content}". `;
      break;
    case 'change_tone':
      const tone = searchParams.get('tone') || 'friendly';
      prompt = `Change the tone of the following text to be more "${tone}: "${content}"`;
      break;
    case 'make_shorter':
      prompt = `Shorten the following text: "${content}"`;
      break;
    case 'make_longer':
      prompt = `Make the following text more verbose: "${content}"`;
      break;
    case 'translate':
      const langParam = searchParams.get('lang')?.toLowerCase() || 'en';
      const lang = language[langParam as keyof typeof language] || 'English';
      prompt = `Translate the following text to ${lang}: "${content}"`;
      break;
    case 'check_tone':
      prompt = "Analyze the tone of the following text and clasify it into one category of the following: "
      + "aggresive, threatening, ironic, sarcastic, professional, casual, friendly, straighforward, confident, casual, neutral: "
      + `"${content}". Format the answer as a single word.`;
      break;
    default:
      return new Response('Invalid action', { status: 400 });
  }

  // console.log('Prompt:', prompt);

  // Check if user has added an own OpenAI API key
  let userApiKeys = await prisma.apiKey.findMany({
    where: {
      userId: userId,
    },
  });
  // Check which API key is valid & enabled
  let validApiKey = null;
  userApiKeys.forEach((key) => {
    if (key.valid && key.enabled) {
      validApiKey = key;
      return;
    }
  });

  const isUsingUserApiKey = validApiKey && validApiKey.enabled ? true : false;
  let response;
  // Ask OpenAI for a streaming completion given the prompt
  if (isUsingUserApiKey) {
    const openai = new OpenAI({
      apiKey: validApiKey.key,
    });
    response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      });
  } else {
    // Use the default OpenAI API key
    response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      });
  }
  
  // console.log('Response:', response.choices[0].message.content.trim());
  // console.log("Usage:", response.usage);
  
  if (!isUsingUserApiKey) {
  // Update the credits count for the user's subscription
  const tokenCount = response.usage.total_tokens;
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        usedCredits: {
          increment: tokenCount,
        },
      },
    });
    // console.log(`Updated user ${user.email} credits: ${updatedSubscription.usedCredits}`);

  // Update the domain usage
  const updatedDomain = await prisma.domains.update({
    where: {
      id: validatedDomain.id,
    },
    data: {
      usage: {
        increment: tokenCount,
      },
    },
  });
  }

  let aiResponseText = response.choices[0].message.content.trim();

  // Check if the response text starts with double quotes and remove them
  if (aiResponseText.startsWith('"')) {
    // Remove the first and last characters (double quotes) from the response text
    aiResponseText = aiResponseText.substring(1, aiResponseText.length - 1);
  }

  // End the `Pool` inside the same request handler as per here:
  // https://github.com/prisma/prisma/issues/20566#issuecomment-1992552703
  // (unlike `await`, `waitUntil` won't hold up the response)
  // Not working with route handler => see workaround here: https://github.com/vercel/next.js/issues/50522
  // waitUntil(async () => await prisma.$disconnect());
  // waitUntil(async () => await pool.end());

  // Respond with the stream
  return new Response(aiResponseText, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

