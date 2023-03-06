import type { users } from "@prisma/client";
import type { Todos } from "./Todo";

export type User = {
    _id: string;
    public_key: string;
    dek: string;
    todos: Todos[]
}

export type sanitizedUser = Omit<users, "active_sessions"> 
