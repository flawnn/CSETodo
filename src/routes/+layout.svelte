<script>
	import '../app.css';

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<svelte:head>
	<!-- For preloading avatar -->
	<link
		rel="preload"
		href="https://source.boringavatars.com/marble/120/${data.user.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"
		as="image"
	/>
</svelte:head>

<slot />
