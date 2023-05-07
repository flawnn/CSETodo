/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireEvent, queryByAttribute, render } from '@testing-library/svelte';
import { describe } from 'vitest';
import AddTodo from '../../components/AddTodo.svelte';
import { ComponentFixtures } from '../fixtures/components/fixtures';

const getById = queryByAttribute.bind(null, 'id');

const addTodoMock = vi.fn();
const toggleCompletedMock = vi.fn();

vi.mock('../../components/utils/todos', () => {
	return { addTodo: addTodoMock, toggleCompleted: toggleCompletedMock };
});

import * as g from '$root/components/utils/todos';
const { addTodo, toggleCompleted } = g;

describe('AddTodo Component', () => {
	afterEach(async () => {
		vi.restoreAllMocks();
	});

	// it('should show number of all todos', async () => {
	// 	render(AddTodo, {
	// 		all_todos: ComponentFixtures.todos,
	// 		addTodo: addTodo,
	// 		toggleCompleted: toggleCompleted,
	// 		todosAmount: ComponentFixtures.todosAmount
	// 	});

	// 	expect(await screen.findByText(ComponentFixtures.todosAmount)).toBeInTheDocument();
	// });

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

		expect(toggleCompletedMock).toHaveBeenCalled();
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

		expect(addTodoMock).toHaveBeenCalled();
	});
});
