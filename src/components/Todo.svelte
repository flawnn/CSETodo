<script type="ts">
	import '$root/styles/todos.css';

	let username = 'flawn';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let isImageLoaded = false;

	// Load background iamge
	onMount(async () => {
		// Fetch the image from the server
		fetch('https://source.unsplash.com/640x360/?mountains')
			.then((response) => response.blob())
			.then((blob) => {
				// Convert the blob to a URL that can be used as the image source
				const imageUrl = URL.createObjectURL(blob);

				// Save the image URL in local storage
				localStorage.setItem('backgroundImage', imageUrl);

				// Set the background image of the page
				document.body.style.backgroundImage = `url(${imageUrl})`;

				isImageLoaded = !isImageLoaded;
			});
	});
</script>

{#if !isImageLoaded}
	<div class="spinner">
		<div class="lds-ring">
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
{:else}
	<main in:fade={{ duration: 1000 }} style="--isLoaded: {isImageLoaded ? 1 : 0}">
		<div class="m-2 h-14 w-14 drop-shadow-xl rounded-full fixed top-0 right-0 avatar">
			<img
				class="rounded-full"
				src="https://source.boringavatars.com/marble/120/{username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"
				alt="avatar"
			/>
			<div id="login-indicator" class="bg-red-500 absolute top-0 right-0 w-4 h-4 rounded-full" />
		</div>
		<div class="todos-container">
			<h1 class="title">to-dos 🚧</h1>
			<div class="todos">
				<form>
					<input type="checkbox" id="toggle-all" class="toggle-all" />
					<label aria-label="Mark all as complete" for="toggle-all"> Mark all as complete </label>

					<input id="new-todo" class="new-todo" placeholder="What's on your mind?" type="text" />
				</form>

				<ul class="todo-list">
					<li class="todo">
						<div class="todo-item">
							<div>
								<input id="todo" class="toggle" type="checkbox" />
								<label aria-label="Check todo" class="todo-check" for="todo" />
							</div>
							<span class="todo-text">Test Todo</span>
							<button aria-label="Remove todo" class="remove" />
						</div>
					</li>
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
