<script lang="ts">
	import Todo from '$root/components/Todo.svelte';
	import '$root/styles/global.css';
	import { onMount } from 'svelte';

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
</script>

<Todo {imagesLoaded} />
