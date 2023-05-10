/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as g from '$root/components/utils/todos';
import { fireEvent, queryByAttribute, render } from '@testing-library/svelte';
import { describe } from 'vitest';
import TodoElement from '../../components/TodoElement.svelte';
import { ComponentFixtures } from '../fixtures/components/fixtures';

const { removeTodo, editTodo, completeTodo } = g;

const getById = queryByAttribute.bind(null, 'id');

vi.mock('../../components/utils/todos', () => {
	return { removeTodo: vi.fn(), editTodo: vi.fn(), completeTodo: vi.fn() };
});

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

		expect(completeTodo).toHaveBeenCalled();
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

		expect(editTodo).toHaveBeenCalled();
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

		expect(removeTodo).toHaveBeenCalled();
	});
});
