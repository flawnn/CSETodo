import { JWT_SECRET } from '$env/static/private';
import { getDefaultCookieOptions } from '$root/lib/util';
import { findUser } from '$root/services/users';
import type { JwtData } from '$root/types/JwtData';
import type { users } from '@prisma/client';
import { error, type RequestHandler } from "@sveltejs/kit";
import { Base64 } from 'js-base64';
import jwt from 'jsonwebtoken';
import * as forge from 'node-forge';

type sanitizedUser = Omit<users, "active_sessions"> 

export const POST = (async ({ params, url, request, cookies }) => {
    try{
        let body = await request.json();

        let publicKey = Base64.decode(body.payload.public_key)
        let forgePublicKey = forge.pki.publicKeyFromPem(publicKey);
        
        var md = forge.md.sha1.create();
        md.update(JSON.stringify(body.payload), 'utf8');

        var verified = forgePublicKey.verify(md.digest().bytes(), body.signature);

        if(verified) {
            // check if public_key is in db 
            let user: users = await findUser(undefined, body.payload.public_key)

            if(!user){
                throw error(500, "User not found")
            }

            let token = jwt.sign({
                id: user.id,
                session: body.payload.client_id
            } satisfies JwtData, JWT_SECRET)

            cookies.set("sessiontoken", token, getDefaultCookieOptions());
            
            const sanitizedUser: sanitizedUser = user

            return new Response(JSON.stringify({
                user: sanitizedUser
            }))

        } else {
            throw error(500, "Malformed signature");
        }
    } catch (e) {
        throw error(500, "Malformed Body" + e)
    }
}) satisfies RequestHandler;

export type { sanitizedUser };

