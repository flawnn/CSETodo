<script lang="ts">
	import type { Todos } from '$root/types/Todo';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	type CompleteTodoType = (id: string) => void;
	type RemoveTodoType = (id: string) => void;
	type EditTodoType = (id: string, newTodo: string) => void;

	export let todo: Todos;
	export let completeTodo: CompleteTodoType;
	export let removeTodo: RemoveTodoType;
	export let editTodo: EditTodoType;

	let editing = false;

	function toggleEdit(): void {
		editing = true;
	}

	function handleEdit(event: KeyboardEvent, id: string): void {
		let pressedKey = event.key;
		let targetElement = event.target as HTMLInputElement;
		let newTodo = targetElement.value;

		switch (pressedKey) {
			case 'Escape':
				targetElement.blur();
				break;
			case 'Enter':
				editTodo(id, newTodo);
				targetElement.blur();
				break;
		}
	}

	function handleBlur(event: FocusEvent, id: string): void {
		let targetElement = event.target as HTMLInputElement;
		let newTodo = targetElement.value;

		editTodo(id, newTodo);
		targetElement.blur();
		editing = false;
	}
</script>

<li class:editing class="todo" transition:slide={{ delay: 250, duration: 300, easing: quintOut }}>
	<div class="todo-item">
		<div>
			<input
				on:change={() => completeTodo(todo.id)}
				checked={todo.completed}
				id="todo"
				class="toggle"
				type="checkbox"
			/>
			<label aria-label="Check todo" class="todo-check" for="todo" />
		</div>
		<span on:dblclick={toggleEdit} class:completed={todo.completed} class="todo-text"
			>{todo.text}</span
		>
		<button aria-label="Remove todo" on:click={() => removeTodo(todo.id)} class="remove" />
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
