import { database } from '$lib/Database';
import type { PageServerLoad } from './$types';

// simple demo - usually you'd call database functions or an api here

export const load = (async (page) => {
  return {
    conversation: database.conversations.find(c => c.id === page.params.conversation),
  };
}) satisfies PageServerLoad;