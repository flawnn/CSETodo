import type { Todo } from "./Todo";

export type User = {
    _id: string;
    public_key: string;
    dek: string;
    todos: Todo[]
}