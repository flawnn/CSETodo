<script lang="ts">
	import '$root/styles/todos.css';
	import type { Todos } from '$root/types/Todo';
	import { Base64 } from 'js-base64';
	import * as forge from 'node-forge';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import type { PageData } from '../routes/$types';
	import AddTodo from './AddTodo.svelte';
	import Avatar from './Avatar.svelte';

	export let initialTodos: Todos[];

	export let data: PageData;

	let todos = initialTodos;

	let public_key = forge.pki
		.publicKeyFromPem(Base64.decode(localStorage.getItem('public_key') as string))
		.n.toString(16);
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
