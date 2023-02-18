<script lang="ts">
	import Todo from '$root/components/Todo.svelte';
	import '$root/styles/global.css';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let imagesLoaded = false;

	onMount(async () => {
		// Fetch background image from the server
		fetch('https://source.unsplash.com/640x360/?mountains')
			.then((response) => response.blob())
			.then((blob) => {
				// Convert blob to URL to use as image source & set background image of the page
				document.body.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;

				imagesLoaded = !imagesLoaded;
			});
	});

	function handleLogin(e: Event) {
		const formData = new FormData(e.target as HTMLFormElement);

		// TODO: Upload as file
		let private_key = formData.get('pkey') as FormDataEntryValue;
	}
</script>

<section>
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
		<Todo {data} />
	{/if}
</section>

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
