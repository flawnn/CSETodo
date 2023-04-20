<script lang="ts">
	import type { Todos } from '$root/types/Todo';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import type { CompleteTodoType, EditTodoType, RemoveTodoType } from './types/TodoElement';

	// Component Exports
	export let all_todos: Todos[];
	export let todo: Todos;
	export let completeTodo: CompleteTodoType;
	export let removeTodo: RemoveTodoType;
	export let editTodo: EditTodoType;

	// Component State
	let editing = false;

	async function handleEdit(event: KeyboardEvent, id: string) {
		let pressedKey = event.key;
		let targetElement = event.target as HTMLInputElement;
		let newTodo = targetElement.value;

		switch (pressedKey) {
			case 'Escape':
				targetElement.blur();
				break;
			case 'Enter':
				all_todos = await editTodo(all_todos, id, newTodo);
				targetElement.blur();
				break;
		}
	}

	async function handleBlur(event: FocusEvent, id: string){
		let targetElement = event.target as HTMLInputElement;
		let newTodo = targetElement.value;

		all_todos = await editTodo(all_todos, id, newTodo);
		targetElement.blur();
		editing = false;
	}
</script>

<li class:editing class="todo" transition:slide={{ delay: 250, duration: 300, easing: quintOut }}>
	<div class="todo-item">
		<div>
			<input
				on:change={async () => all_todos = await completeTodo(all_todos, todo.id)}
				checked={todo.completed}
				id="todo"
				class="toggle"
				type="checkbox"
			/>
			<label aria-label="Check todo" class="todo-check" for="todo" />
		</div>
		<span on:dblclick={() => editing = true} class:completed={todo.completed} class="todo-text"
			>{todo.text}</span
		>
		<button aria-label="Remove todo" on:click={async () => all_todos = await removeTodo(all_todos, todo.id)} class="remove" />
	</div>

	{#if editing}
		<input
			on:keydown={(event) => handleEdit(event, todo.id)}
			on:blur={(event) => handleBlur(event, todo.id)}
			class="edit"
			type="text"
			value={todo.text}
		/>
	{/if}
</li>
