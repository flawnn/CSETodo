export type CompleteTodoType = (todos: Todos[], id: string) => Promise<Todos[]>;
export type RemoveTodoType = (todos: Todos[], id: string) => Promise<Todos[]>;
export type EditTodoType = (todos: Todos[], id: string, newTodo: string) => Promise<Todos[]>;
