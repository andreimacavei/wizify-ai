import OpenAI from 'openai';
import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/db/db';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless' 

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


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

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

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

  // Get the user from the database
  const domain = await prisma.domains.findFirst({
    where: {
      hostname: req.headers.get('hostname'),
    },
  });
  if (!domain) {
    return new Response('Domain not found', { status: 404 });
  }
  const userId = domain?.userId;
  
  // Check if the user has enough tokens to make the request
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user.credits < 10) {
    return new Response('Not enough credits', { status: 402 });
  }

  console.log('Prompt:', content);
  console.log('Action:', action);
 
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
    case 'lucky':
      prompt = `Generate a random thought using the following: "${content}"`;
      break;
    default:
      return new Response('Invalid action', { status: 400 });
  }

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    max_tokens: 150,
    prompt,
  });
 
  // Mock response data for now
  // const response = {
  //   choices: [
  //     {
  //       text: 'This is a mock response. Make money online with this one weird trick!',
  //     },
  //   ],
  // };

  console.log('Response usage:', response.usage);
  
  // Update the token count for the user
  const tokenCount = response.usage.total_tokens;
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      credits: {
        decrement: tokenCount,
      },
    },
  });
  console.log('Updated user credits:', updatedUser.credits);

  let aiResponseText = response.choices[0].text.trim();

  // Check if the response text starts with double quotes and remove them
  if (aiResponseText.startsWith('"')) {
    // Remove the first and last characters (double quotes) from the response text
    aiResponseText = aiResponseText.substring(1, aiResponseText.length - 1);
  }

  // Respond with the stream
  return new Response(aiResponseText, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

