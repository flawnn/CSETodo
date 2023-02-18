import type { RequestHandler } from './$types';

export const GET = (({ params, url }) => {
 
  return new Response(String("GG"));
}) satisfies RequestHandler;

export const POST = (({ params, url }) => {
 
  return new Response(String("GG"));
}) satisfies RequestHandler;

export const PUT = (({ params, url }) => {
 
  return new Response(String("GG"));
}) satisfies RequestHandler;

export const DELETE = (({ params, url }) => {
 
  return new Response(String("GG"));
}) satisfies RequestHandler;