<script lang="ts">
	import { encryptTodos, updateTodosFromServer } from '$root/lib/util';
	import '$root/styles/todos.css';
	import type { Todos } from '$root/types/Todo';
	import { toast } from '@zerodevx/svelte-toast';
	import { Base64 } from 'js-base64';
	import * as forge from 'node-forge';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import type { PageData } from '../routes/$types';
	import AddTodo from './AddTodo.svelte';
	import Avatar from './Avatar.svelte';

	export let initialTodos: Todos[];

	export let data: PageData;

	let todos = initialTodos.map((a) => {
		return { ...a };
	});

	let public_key = forge.pki
		.publicKeyFromPem(Base64.decode(localStorage.getItem('public_key') as string))
		.n.toString(16);

	// computed
	$: todosAmount = todos.length;
	$: pushTasksToDB(todos);

	async function pushTasksToDB(newTodos: Todos[]) {
		if (newTodos != initialTodos) {
			let encrypted = encryptTodos(Base64.decode(localStorage.getItem('dek')!), newTodos);

			let res = await fetch('/api/tasks', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: encrypted,
				credentials: 'same-origin'
			});

			console.log(await res.text());
			if (res.status == 500) {
				toast.push('Error while updating Todos. Try adding another one or reload page.');
			}
		}
	}
	// methods
	function generateRandomId(): string {
		return Math.random().toString(16).slice(2);
	}

	async function fetchTodos() {
		await updateTodosFromServer(
			initialTodos,
			data.user?.id!,
			Base64.decode(localStorage.getItem('dek')!)
		);

		todos = initialTodos;
	}

	async function addTodo(todo: string) {
		await fetchTodos();

		let newTodo: Todos = {
			id: generateRandomId(),
			text: todo,
			completed: false
		};
		todos = [...todos, newTodo];
	}

	async function toggleCompleted(event: MouseEvent) {
		await fetchTodos();
		let { checked } = event.target as HTMLInputElement;

		todos = todos.map((todo) => ({
			...todo,
			completed: checked
		}));
	}

	async function completeTodo(id: string) {
		await fetchTodos();
		todos = todos.map((todo) => {
			if (todo.id === id) {
				todo.completed = !todo.completed;
			}
			return todo;
		});
	}

	async function removeTodo(id: string) {
		await fetchTodos();
		todos = todos.filter((todo) => todo.id !== id);
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
			<AddTodo {addTodo} {toggleCompleted} {todosAmount} />
			{#if todosAmount}
				<ul class="todo-list">
					{#each todos as todo (todo.id)}
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
								<button
									aria-label="Remove todo"
									on:click={() => removeTodo(todo.id)}
									class="remove"
								/>
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
			{/if}
		</div>
	</div>
</main>
