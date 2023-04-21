<script lang="ts">
	import { isUserDataInteger } from '$root/lib/util';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		// Checks if there is any data missing and if yes, resets cookies & localStorage and then reloads
		if (isUserDataInteger(localStorage, data)) {
			localStorage.clear();

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

<SvelteToast options={{ pausable: true, duration: 8000, dismissable: true }} />
<slot />
