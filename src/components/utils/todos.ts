/**
 * Utility file for all general Todo operations
 */

import { generateRandomId } from '$root/lib/util';
import type { Todos } from '$root/types/helper/Todo';

function filterTodos(todos: Todos[], filter: unknown): Todos[] {
	switch (filter) {
		default:
			return todos;
		case 'active':
			return todos.filter((todo) => !todo.completed);
		case 'completed':
			return todos.filter((todo) => todo.completed);
	}
}

async function addTodo(todos: Todos[], todo: string): Promise<Todos[]> {
	const newTodo: Todos = {
		id: generateRandomId(),
		text: todo,
		completed: false
	};

	return [...todos, newTodo];
}

async function toggleCompleted(todos: Todos[], event: MouseEvent): Promise<Todos[]> {
	const { checked } = event.target as HTMLInputElement;

	return todos.map((todo) => ({
		...todo,
		completed: checked
	}));
}

async function completeTodo(todos: Todos[], id: string): Promise<Todos[]> {
	return todos.map((todo) => {
		if (todo.id === id) {
			todo.completed = !todo.completed;
		}
		return todo;
	});
}

async function removeTodo(todos: Todos[], id: string): Promise<Todos[]> {
	return todos.filter((todo) => todo.id !== id);
}

async function editTodo(todos: Todos[], id: string, newTodo: string): Promise<Todos[]> {
	const currentTodo = todos.findIndex((todo) => todo.id === id);
	todos[currentTodo].text = newTodo;
	return todos;
}

function clearCompleted(todos: Todos[]): Todos[] {
	return todos.filter((todo) => todo.completed !== true);
}

export {
	addTodo,
	clearCompleted,
	completeTodo,
	editTodo,
	filterTodos,
	removeTodo,
	toggleCompleted
};
