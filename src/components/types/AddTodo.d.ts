export type AddTodoType = (todos: Todos[], todo: string) => Promise<Todos[]>;
export type ToggleCompletedType = (todos: Todos[], event: MouseEvent) => Promise<Todos[]>;
export type TodosAmountType = number;
