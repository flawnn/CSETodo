<script lang="ts">
	export let client_id: string | undefined;
</script>

<div class="m-2 h-14 w-14 drop-shadow-xl rounded-full fixed top-0 right-0 avatar">
	<img
		id="avatar"
		src="https://source.boringavatars.com/marble/120/${client_id}"
		class="rounded-full"
		alt="avatar"
	/>
	<div id="login-indicator" class="bg-red-500 absolute top-0 right-0 w-4 h-4 rounded-full" />
</div>
<!-- Dropdown menu
<div
	id="dropdownDivider"
	class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
>
	<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
		<li>
			<a
				href="#"
				class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
				>Dashboard</a
			>
		</li>
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
				class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
				>Earnings</a
			>
		</li>
	</ul>
	<div class="py-2">
		<a
			href="#"
			class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
			>Separated link</a
		>
	</div>
</div> -->
