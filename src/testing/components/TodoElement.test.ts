/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireEvent, queryByAttribute, render } from '@testing-library/svelte';
import { describe } from 'vitest';
import TodoElement from '../../components/TodoElement.svelte';
import { ComponentFixtures } from '../fixtures/components/fixtures';

const getById = queryByAttribute.bind(null, 'id');

const removeTodoMock = vi.fn();
const editTodoMock = vi.fn();
const completeTodoMock = vi.fn();

vi.mock('../../components/utils/todos', () => {
	return { removeTodo: removeTodoMock, editTodo: editTodoMock, completeTodo: completeTodoMock };
});

import * as g from '$root/components/utils/todos';
const { removeTodo, editTodo, completeTodo } = g;

describe('TodoElement Component', () => {
	afterEach(async () => {
		vi.restoreAllMocks();
	});

	it('completes the todo', async () => {
		const comp = render(TodoElement, {
			all_todos: ComponentFixtures.todos,
			completeTodo: completeTodo,
			removeTodo: removeTodo,
			editTodo: editTodo,
			todo: ComponentFixtures.todo
		});

		const completeCheckBox = getById(comp.container, 'todo');
		expect(completeCheckBox).not.toBeNull();

		await fireEvent.click(completeCheckBox!);

		expect(completeTodoMock).toHaveBeenCalled();
	});

	it('edits the todo', async () => {
		const comp = render(TodoElement, {
			all_todos: ComponentFixtures.todos,
			completeTodo: completeTodo,
			removeTodo: removeTodo,
			editTodo: editTodo,
			todo: ComponentFixtures.todo
		});

		const editButton = comp.queryByLabelText('Edit Todo');
		expect(editButton).not.toBeNull();

		await fireEvent.dblClick(editButton!);

		const editTodoForm = getById(comp.container, 'todo-edit');
		expect(editTodoForm).not.toBeNull();

		await fireEvent.keyDown(editTodoForm!, { key: 'Enter', value: 'gg', target: {} });

		expect(editTodoMock).toHaveBeenCalled();
	});

	it('removes the todo', async () => {
		const comp = render(TodoElement, {
			all_todos: ComponentFixtures.todos,
			completeTodo: completeTodo,
			removeTodo: removeTodo,
			editTodo: editTodo,
			todo: ComponentFixtures.todo
		});

		const removeTodoButton = comp.queryByLabelText('Remove todo');

		expect(removeTodoButton).not.toBeNull();

		fireEvent.click(removeTodoButton!);

		expect(removeTodoMock).toHaveBeenCalled();
	});
});
