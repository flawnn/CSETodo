<script lang="ts"> 
	import '$root/components/styles/Todo.css';
	import type { FiltersType, Todos } from '$root/types/Todo';
	import { Base64 } from 'js-base64';
	import forge from 'node-forge';
	import { fade } from 'svelte/transition';
	import type { PageData } from '../routes/$types';
	import AddTodo from './AddTodo.svelte';
	import Avatar from './Avatar.svelte';
	import TodoElement from './TodoElement.svelte';
	import { pushTasksToDB } from './data/api_handler';
	import { addTodo, clearCompleted, completeTodo, editTodo, filterTodos, removeTodo, toggleCompleted } from './utils/todos';

	// Global Variables
	let filters = ['all', 'active', 'completed'];
		
	// Component Props
	export let initialTodos: Todos[];

	export let data: PageData;

	// Component State
	let selectedFilter: FiltersType = 'all';
	let todos = initialTodos.map((a) => {
		return { ...a };
	});
	let public_key = forge.pki
		.publicKeyFromPem(Base64.decode(localStorage.getItem('public_key') as string))
		.n.toString(16);

	// Reactive Assignments
	$: todosAmount = todos.length;
	$: incompleteTodos = todos.filter((todo) => !todo.completed).length;
	$: filteredTodos = filterTodos(todos, selectedFilter);
	$: completedTodos = todos.filter((todo) => todo.completed).length;
	$: pushTasksToDB(initialTodos, todos);

	function setFilter(newFilter: any): void {
		selectedFilter = newFilter;
	}
</script>

<main in:fade={{ duration: 1000 }}>
	<Avatar
		client_id={data.client_id}
		public_key={'0x' +
			public_key.slice(0, 5) +
			'...' +
			public_key.slice(public_key.length - 3, public_key.length)}
	/>
	<div class="todos-container">
		<h1 class="title">to-dos 🚧</h1>
		<div class="todos">
			<AddTodo bind:all_todos={todos} {addTodo} {toggleCompleted} {todosAmount} />
			{#if todosAmount}
				<ul class="todo-list">
					{#each filteredTodos as todo (todo.id)}
						<TodoElement bind:all_todos={todos} {removeTodo} {completeTodo} {todo} {editTodo} />
					{/each}
				</ul>

				<div class="actions">
					<span class="todo-count">
						{incompleteTodos}
						{incompleteTodos === 1 ? 'item' : 'items'} left</span
					>
					<div class="filters">
						{#each filters as filter}
							<button
								on:click={() => setFilter(filter)}
								class:selected={selectedFilter === filter}
								class="filter"
							>
								{filter}
							</button>
						{/each}
					</div>
					<button
						on:click={() => todos = clearCompleted(todos)}
						class:hidden={completedTodos === 0}
						class="clear-completed">Clear completed</button
					>
				</div>
			{/if}
		</div>
	</div>
</main>
