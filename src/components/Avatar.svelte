<script lang="ts">
	import { clickOutside } from '$root/lib/click_outside';
	import { scale } from 'svelte/transition';

	export let client_id: string | undefined;

	export let public_key: string;

	let show = false;

	function logout() {
		localStorage.clear();

		// Clearing cookies
		document.cookie.split(';').forEach(function (c) {
			document.cookie = c
				.replace(/^ +/, '')
				.replace(/=.*/, '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
		});

		location.reload();
	}
</script>

<div class="fixed top-0 right-0 avatar">
	<button
		id="dropdownDividerButton"
		on:click={() => (show = !show)}
		use:clickOutside
		on:click_outside={() => (show = false)}
		class="m-2 h-14 w-14 drop-shadow-xl rounded-full avatar"
		type="button"
	>
		<img
			id="avatar"
			src="https://source.boringavatars.com/marble/120/${client_id}"
			class="rounded-full"
			alt="avatar"
		/>
		{#if show}
			<div
				in:scale={{ duration: 100, start: 0.95 }}
				out:scale={{ duration: 75, start: 0.95 }}
				class="fixed mt-1 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
			>
				<div class="py-2">
					<a
						href="#"
						class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
						>Public key: <span style="font-family: Space Mono;">{public_key}</span></a
					>
				</div>
				<ul
					class="py-2 text-sm text-gray-700 dark:text-gray-200"
					aria-labelledby="dropdownDividerButton"
				>
					<li>
						<a
							href="#"
							class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
							>Settings</a
						>
					</li>
					<li>
						<a
							href="#"
							on:click={logout}
							class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
							>Logout</a
						>
					</li>
				</ul>

				<!--	<div class="py-2">
					<a
						href="#"
						class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
						>Separated link</a
					>
				</div> -->
			</div>
		{/if}
	</button>
</div>

<style>
	.avatar {
		z-index: 10;
	}
</style>
