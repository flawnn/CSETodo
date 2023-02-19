import type { RequestHandler } from './[[id]]/$types';

// Only one method as there is no sense in having multiple endpoints, as we only update the data over the server
export const POST = (({ params, url }) => {
 
  return new Response(String("GG"));
}) satisfies RequestHandler;
