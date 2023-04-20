<script lang="ts">
	import '$root/components/styles/AddTodo.css';
	import type { Todos } from '$root/types/Todo';
	import type { AddTodoType, TodosAmountType, ToggleCompletedType } from './types/AddTodo';

	export let all_todos: Todos[];
	export let addTodo: AddTodoType;
	export let toggleCompleted: ToggleCompletedType;
	export let todosAmount: TodosAmountType;

	let todo_content = '';

	async function handleSubmit() {
		all_todos = await addTodo(all_todos, todo_content);
		todo_content = '';
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	{#if todosAmount > 0}
		<input on:click={async (event) => all_todos = await toggleCompleted(all_todos, event)} type="checkbox" id="toggle-all" class="toggle-all" />
		<label aria-label="Mark all as complete" for="toggle-all"> Mark all as complete </label>
	{/if}
	<input
		bind:value={todo_content}
		id="new-todo"
		class="new-todo"
		placeholder="What needs to be done?"
		type="text"
	/>
</form>