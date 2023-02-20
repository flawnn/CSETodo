import { error, type Handle } from "@sveltejs/kit";
import { parse } from "cookie";
import { v4 as uuidv4 } from 'uuid';
import { getUserByCookies } from "./services/users";

export const handle: Handle = (async ({ event, resolve }) => {
  const { headers } = event.request;
  const cookies = parse(headers.get("cookie") ?? "");
  let jwtUser = await getUserByCookies(cookies);


  if(jwtUser == null && (event.url.pathname.startsWith("/api/tasks") || event.url.pathname.startsWith("/api/user"))){
    throw error(401, "Unauthorized")
  } 

  event.locals.user = jwtUser!;

  let uuid = event.cookies.get("device_id");
  if(uuid == null){
      uuid = uuidv4();
      event.cookies.set("device_id", uuid)
  } else if(event.locals.user != null && event.locals.user.session != uuid){
      // TODO: Reset everything, cookies have been tampered with
  }

  return await resolve(event);
}) satisfies Handle;