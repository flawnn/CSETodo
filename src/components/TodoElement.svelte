<script lang="ts">
	import type { Todos } from '$root/types/Todo';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	type CompleteTodoType = (id: string) => void;
	type RemoveTodoType = (id: string) => void;

	export let todo: Todos;
	export let completeTodo: CompleteTodoType;
    export let removeTodo: RemoveTodoType;
</script>

<li class="todo" transition:slide={{ delay: 250, duration: 300, easing: quintOut }}>
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
		<span class:completed={todo.completed} class="todo-text">{todo.text}</span>
		<button aria-label="Remove todo" on:click={() => removeTodo(todo.id)} class="remove" />
	</div>
</li>
