import { JWT_SECRET } from '$env/static/private';
import { db } from '$root/services/db';
import type { Todo } from '$root/types/Todo';
import type { users } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as forge from 'node-forge';
import type { JwtData } from './../types/JwtData';

const createUser = async (session_id: string, dek: string, public_key: string) => {
    let existingUser = await db.users.findFirst({
        where: {
            public_key
        }
    })

    if(!existingUser){
        var newUser;
        try {
            type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

            newUser = await db.users.create({
                data: {
                    public_key: public_key,
                    active_sessions: [session_id],
                    dek: dek
                }
            }) as Partial<ThenArg<ReturnType<typeof db.users.create>>>

        } catch {
            return {
                error: "db_error"
            }
        }

        const jwtData: JwtData = {
            id: newUser.id!,
            session: session_id
        }

        const token = jwt.sign(jwtData, JWT_SECRET)

        return {token}
    } else {
        return {
            error: "public_key_used"
        }
    }
}

const findUser = async (id: string | undefined, public_key: string | undefined): Promise<users> => {
    let key = id != null ? "id" : "public_key"
    let query: {[k: string]: any} = {}
    if(id != null){
        query.id = id
    } else if(public_key != null){
        query.public_key = public_key
    } else {
        throw new Error("Missing params")
    }

    const user = await db.users.findUnique({
        where: query
    });

    if (!user) {
       throw new Error("User not found");
    }

    return user;
}

const getUserByCookies = async (cookies: Record<string, string>): Promise<JwtData | null> => {
    if (cookies.AuthorizationToken) {
    const token = cookies.AuthorizationToken.split(" ")[1];

    try {
      const jwtUser = jwt.verify(token, JWT_SECRET);
      if (typeof jwtUser === "string") {
        throw new Error("Something went wrong");
      }

    const user = await db.users.findUnique({
    where: {
        id: jwtUser.id,
    },
    });

    if (!user) {
    throw new Error("User not found");
    }

    const sessionUser: JwtData = {
        id: user.id,
        session: jwtUser.session as string,
    } satisfies JwtData

    return sessionUser;
    } catch (error) {
      console.error(error);
    }
  }

  return null;
}

const getTodos = async (id: string, dek: string): Promise<Todo[]> {
    let dbUser = await findUser(id, undefined);

    var decipher = forge.cipher.createDecipher('AES-CBC', dek);

    // TODO: DON'T USE CONSTANT IV
    decipher.start({ iv: 'GGGGGGGGGGGGGGGG' })
    decipher.update(forge.util.createBuffer(dbUser.todos));
    decipher.finish()

    const decrypted: Todo[] = JSON.parse(decipher.output.toString())

    return decrypted;
}
export { getTodos, createUser, getUserByCookies, findUser };

