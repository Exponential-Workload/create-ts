import { database } from '$lib/Database';
import type { LayoutServerLoad } from './$types';

// simple demo - usually you'd call database functions or an api here

export const load = (async () => {
  return {
    conversations: database.conversations.map((conversation) => ({
      id: conversation.id,
      name: conversation.name,
      lastMessageTime: conversation.lastMessageTime,
      avatar: conversation.icon ?? conversation.users[0].avatar,
    })),
    you: database.you,
  };
}) satisfies LayoutServerLoad;