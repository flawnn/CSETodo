<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		if (
			localStorage.getItem('dek') == undefined ||
			localStorage.getItem('public_key') == undefined
		) {
			localStorage.clear();

			// Clearing cookies
			document.cookie.split(';').forEach(function (c) {
				document.cookie = c
					.replace(/^ +/, '')
					.replace(/=.*/, '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
			});

			location.reload();
		}
	});
</script>

<svelte:head>
	<!-- For preloading avatar -->
	<link
		rel="preload"
		href="https://source.boringavatars.com/marble/120/${data.client_id}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51"
		as="image"
	/>
</svelte:head>

<SvelteToast options={{ pausable: true, duration: 10000 }} />
<slot />
