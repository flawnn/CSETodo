import { JWT_SECRET } from '$env/static/private';
import { db } from '$root/services/db';
import jwt from 'jsonwebtoken';

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

        const jwtData = {
            _id: newUser.id,
        }

        const token = jwt.sign(jwtData, JWT_SECRET)

        return {token}
    } else {
        return {
            error: "public_key_used"
        }
    }
}

export { createUser };

