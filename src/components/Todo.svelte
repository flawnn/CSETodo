<script lang="ts">
	import '$root/styles/todos.css';
	import type { ITodo } from '$root/types/ITodo';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import AddTodo from './AddTodo.svelte';

	let username = 'flawn';
	export let imagesLoaded: boolean;

	let todos: ITodo[] = [
		{ id: '1', text: 'Todo 1', completed: true },
		{ id: '2', text: 'Todo 2', completed: false },
		{ id: '3', text: 'Todo 3', completed: false },
		{ id: '4', text: 'Todo 4', completed: false }
	];
</script>

<!-- For preloading avatar -->
<link
	rel="preload"
	href="https://source.boringavatars.com/marble/120/${username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"
	as="image"
/>
{#if !imagesLoaded}
	<div class="spinner">
		<div class="lds-ring">
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
{:else}
	<main in:fade={{ duration: 1000 }} style="--isLoaded: {imagesLoaded ? 1 : 0}">
		<div class="m-2 h-14 w-14 drop-shadow-xl rounded-full fixed top-0 right-0 avatar">
			<img
				id="avatar"
				src="https://source.boringavatars.com/marble/120/${username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"
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
{/if}

<style>
	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	/* Courtesy of https://loading.io/css/ */
	.lds-ring {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-ring div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 64px;
		height: 64px;
		margin: 8px;
		border: 8px solid #fff;
		border-radius: 50%;
		animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: #fff transparent transparent transparent;
	}
	.lds-ring div:nth-child(1) {
		animation-delay: -0.45s;
	}
	.lds-ring div:nth-child(2) {
		animation-delay: -0.3s;
	}
	.lds-ring div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
