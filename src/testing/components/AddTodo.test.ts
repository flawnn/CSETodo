vi.mock('../../components/utils/todos', () => {
	return { addTodo: vi.fn(), toggleCompleted: vi.fn() };
});

import { fireEvent, queryByAttribute, render } from '@testing-library/svelte';
import { describe } from 'vitest';
import { ComponentFixtures } from '../fixtures/components/fixtures';

const getById = queryByAttribute.bind(null, 'id');

import * as g from '$root/components/utils/todos';
import AddTodo from '../../components/AddTodo.svelte';
const { addTodo, toggleCompleted } = g;

describe('AddTodo Component', () => {
	afterEach(async () => {
		vi.restoreAllMocks();
	});

	it('should toggle all todos', async () => {
		const comp = render(AddTodo, {
			all_todos: ComponentFixtures.todos,
			addTodo: addTodo,
			toggleCompleted: toggleCompleted,
			todosAmount: ComponentFixtures.todosAmount
		});

		const toggleAllForm = getById(comp.container, 'toggle-all');
		expect(toggleAllForm).not.toBeNull();

		await fireEvent.click(toggleAllForm!);

		expect(toggleCompleted).toHaveBeenCalled();
	});

	it('should add new todo with correct content', async () => {
		const comp = render(AddTodo, {
			all_todos: ComponentFixtures.todos,
			addTodo: addTodo,
			toggleCompleted: toggleCompleted,
			todosAmount: ComponentFixtures.todosAmount
		});

		const addTodoForm = getById(comp.container, 'new-todo');
		expect(addTodoForm).not.toBeNull();

		fireEvent.submit(addTodoForm!);

		expect(addTodo).toHaveBeenCalled();
	});
});
