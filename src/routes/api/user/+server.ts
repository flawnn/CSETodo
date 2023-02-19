import type { RequestHandler } from "@sveltejs/kit";

export const POST = (({ params, url }) => {
  return new Response(String("GG"));
}) satisfies RequestHandler;