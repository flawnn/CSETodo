<script lang="ts">
	import '$root/styles/todos.css';
	import type { Todo } from '$root/types/Todo';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import AddTodo from './AddTodo.svelte';

	let todos: Todo[] = [
		{ id: '1', text: 'Todo 1', completed: true },
		{ id: '2', text: 'Todo 2', completed: false },
		{ id: '3', text: 'Todo 3', completed: false },
		{ id: '4', text: 'Todo 4', completed: false }
	];

	export let data: {};
</script>

<main in:fade={{ duration: 1000 }}>
	<div class="m-2 h-14 w-14 drop-shadow-xl rounded-full fixed top-0 right-0 avatar">
		<img
			id="avatar"
			src="https://source.boringavatars.com/marble/120/${data.user
				.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"
			class="rounded-full"
			alt="avatar"
		/>
		<div id="login-indicator" class="bg-red-500 absolute top-0 right-0 w-4 h-4 rounded-full" />
	</div>
	<div class="todos-container">
		<h1 class="title">to-dos 🚧</h1>
		<div class="todos">
			<AddTodo />
			<ul class="todo-list">
				{#each todos as todo (todo.id)}
					<li class="todo" transition:slide={{ delay: 250, duration: 300, easing: quintOut }}>
						<div class="todo-item">
							<div>
								<input checked={todo.completed} id="todo" class="toggle" type="checkbox" />
								<label aria-label="Check todo" class="todo-check" for="todo" />
							</div>
							<span class="todo-text">{todo.text}</span>
							<button aria-label="Remove todo" class="remove" />
						</div>
					</li>
				{/each}
			</ul>

			<div class="actions">
				<span class="todo-count">0 left</span>
				<div class="filters">
					<button class="filter">All</button>
					<button class="filter">Active</button>
					<button class="filter">Completed</button>
				</div>
				<button class="clear-completed">Clear completed</button>
			</div>
		</div>
	</div>
</main>
