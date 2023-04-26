import {
	addTodo,
	clearCompleted,
	completeTodo,
	editTodo,
	filterTodos,
	removeTodo,
	toggleCompleted
} from '$root/components/utils/todos';
import { describe, expect, it } from 'vitest';
import type { Todos } from '../../types/helper/Todo';

describe('Todo operations', () => {
	let defaultTodos = [
		{ id: '1', text: 'Todo 1', completed: true },
		{ id: '2', text: 'Todo 2', completed: false },
		{ id: '3', text: 'Todo 3', completed: false },
		{ id: '4', text: 'Todo 4', completed: false }
	];

	describe('filters', () => {
		it('completed todos', () => {
			let result = filterTodos(defaultTodos, 'completed');

			expect(result).toEqual([{ id: '1', text: 'Todo 1', completed: true }]);
		});

		it('active todo', () => {
			let result = filterTodos(defaultTodos, 'active');

			expect(result).toEqual([
				{ id: '2', text: 'Todo 2', completed: false },
				{ id: '3', text: 'Todo 3', completed: false },
				{ id: '4', text: 'Todo 4', completed: false }
			]);
		});
	});

	it('adds todo', async () => {
		let result = await addTodo(JSON.parse(JSON.stringify(defaultTodos)), 'Test!');

		expect(result[result.length - 1]).toSatisfy(
			(e: Todos) => e.text == 'Test!' && e.completed == false
		);
	});

	it('check all todos', async () => {
		let result = await toggleCompleted(JSON.parse(JSON.stringify(defaultTodos)), {
			target: { checked: true }
		} as unknown as MouseEvent);

		expect(result).toSatisfy((e: Todos[]) => {
			return e.find((x) => x.completed == false) == undefined ? true : false;
		});
	});

	it('toggle complete prop of todo', async () => {
		let result = await completeTodo(JSON.parse(JSON.stringify(defaultTodos)), defaultTodos[0].id);

		expect(result[0].completed).toEqual(false);
	});

	it('remove todo', async () => {
		let result = await removeTodo(JSON.parse(JSON.stringify(defaultTodos)), defaultTodos[0].id);

		expect(result).toEqual(defaultTodos.filter((x) => x.id != defaultTodos[0].id));
	});
	it('edit todo', async () => {
		let result = await editTodo(
			JSON.parse(JSON.stringify(defaultTodos)),
			defaultTodos[0].id,
			'Test!'
		);

		expect(result[0].text).toEqual('Test!');
	});
	it('clear completed todos', () => {
		let result = clearCompleted(JSON.parse(JSON.stringify(defaultTodos)));

		expect(result).toEqual([
			{ id: '2', text: 'Todo 2', completed: false },
			{ id: '3', text: 'Todo 3', completed: false },
			{ id: '4', text: 'Todo 4', completed: false }
		]);
	});
});
