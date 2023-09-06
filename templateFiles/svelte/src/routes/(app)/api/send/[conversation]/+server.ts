import { database } from '$lib/Database';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  const rawBody = req.request.body
  if (!rawBody) return new Response('Missing body', { status: 400 });
  // readablestream to string
  const body = await req.request.text();
  if (!body) return new Response('Missing body', { status: 400 });
  let bodyParsed: Record<string, any>;
  try {
    // parse the string into a JSON object
    bodyParsed = JSON.parse(body);
  } catch (error) {
    return new Response('Malformed JSON', { status: 400 });
  }
  if (!bodyParsed.content)
    return new Response('Missing content', { status: 400 });

  // Replace with auth!
  if (!bodyParsed.author) return new Response('Not logged in', { status: 401 });

  // Demo of writing the conversation - yet again, replace with an actual DB
  const message = {
    id: Math.random().toString(36).substring(7),
    content: bodyParsed.content,
    time: Date.now(),
    author: bodyParsed.author,
  };
  const convo = req.params.conversation;
  database.conversations.find(v => v.id === convo)?.messages.push(message);
  return new Response(JSON.stringify(message), {
    headers: { 'content-type': 'application/json' },
  });
};
