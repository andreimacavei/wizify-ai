import OpenAI from 'openai';
 
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
 
export async function GET(req: Request) {
  // Extract the `prompt` from the body of the request
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const content = searchParams.get('content');

  if (!content || !action) {
    return new Response('Missing content or action', { status: 400 });
  }
  
  console.log('Prompt:', content);
  console.log('Action:', action);
 
  let prompt = '';
  switch (action.toLowerCase()) {
    case 'fix_spelling':
      prompt = `Fix all grammar and spelling issues in the following text: "${content}"`;
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
  // const response = await openai.completions.create({
  //   model: 'gpt-3.5-turbo-instruct',
  //   max_tokens: 200,
  //   prompt,
  // });
 
  // Mock response data for now
  const response = {
    choices: [
      {
        text: 'This is a mock response. Make money online with this one weird trick!',
      },
    ],
  };

  // console.log('Response:', response.choices[0].text.trim());

  // Respond with the stream
  return new Response(response.choices[0].text.trim(), {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
}

