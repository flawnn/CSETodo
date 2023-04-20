<script lang="ts">
	import Todo from '$root/components/Todo.svelte';
	import { clickOutside } from '$root/lib/click_outside';
	import { decryptTodos, getPublicKeyFromPrivateKey } from '$root/lib/encryption/util';
	import '$root/styles/global.css';
	import type { Todos } from '$root/types/Todo';
	import type { sanitizedUser } from '$root/types/User';
	import { toast } from '@zerodevx/svelte-toast';
	import { Base64 } from 'js-base64';
	import forge from 'node-forge';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loadDone = false;
	let showRegisterForm = false;
	let todos: Todos[];

	onMount(async () => {
		// Only to be executed after having registered to save relevant data in browser
		if (form != null) {
			if (form.error != undefined) {
				toast.push(form.error!);
			} else {
				localStorage.setItem('dek', form.dek!);
				localStorage.setItem('public_key', form.public_key!);
				sessionStorage.setItem('private_key', form.private_key!);

				location.href = '/';
			}
		}

		// Show private key on root page reload
		if (window.location.search == '' && sessionStorage.getItem('private_key') != null) {
			toast.push(
				'SAVE this private key! It is to authenticate yourself if you change devices. This is the only time you will be able to save it'
			);
			toast.push(sessionStorage.getItem('private_key')!, {
				theme: {
					'font-family': 'Space Mono',
					'font-size': '12px'
				}
			});

			sessionStorage.removeItem('private_key');
		}

		// Fetch background image from the server
		let blob = await (await fetch('https://source.unsplash.com/640x360/?mountains')).blob();
		document.body.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;

		if (data.user != undefined) {
			todos = decryptTodos(
				Base64.decode(localStorage.getItem('dek')!)!,
				await (await fetch('/api/tasks')).text()
			);
		}

		loadDone = !loadDone;
	});

	async function handleLogin(e: Event) {
		try {
			const formData = new FormData(e.target as HTMLFormElement);

			let private_key = forge.pki.privateKeyFromPem(
				(formData.get('private_key') as FormDataEntryValue).toString()
			);
			let public_key = getPublicKeyFromPrivateKey(private_key);

			let payload = {
				client_id: data.client_id,
				public_key: Base64.encode(public_key)
			};

			var md = forge.md.sha1.create();
			md.update(JSON.stringify(payload), 'utf8');
			let signature = private_key.sign(md);

			let body = {
				payload: payload,
				signature: signature
			};

			let res = await (
				await fetch('/api/auth/login', {
					body: JSON.stringify(body),
					method: 'POST'
				})
			).json();

			if (res.error ?? false) {
				toast.push('Error while logging in');
			} else {
				let user: sanitizedUser = res.user;

				let decrypted_dek = private_key.decrypt(Base64.decode(user.dek));
				localStorage.setItem('dek', Base64.encode(decrypted_dek));
				localStorage.setItem('public_key', Base64.encode(public_key, true));

				location.reload();
			}
		} catch (e) {
			toast.push(e as string);
		}
	}
</script>

<section>
	{#if !loadDone}
		<div class="spinner">
			<div class="lds-ring">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	{:else if data.user == undefined}
		{#if !showRegisterForm}
			<form id="register-form" method="POST" action="?/register">
				<div
					in:scale={{ duration: 100, start: 0.95 }}
					out:scale={{ duration: 75, start: 0.95 }}
					class="flex flex-col auth-container todos-container todos justify-center items-center p-8"
				>
					<span class="font-bold text-4xl mb-10 text-center">
						Welcome!<br />Please Login or Sign-Up
					</span>
					<div class="flex flex-row min-w-full justify-items-stretch">
						<button
							on:click|preventDefault={() => (showRegisterForm = true)}
							class="grow text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							>Login</button
						>

						<button
							class="grow text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							>Register</button
						>
					</div>
				</div>
			</form>
		{:else}
			<form id="login-form" method="POST" on:submit|preventDefault={handleLogin}>
				<div
					in:scale={{ duration: 100, start: 0.95 }}
					out:scale={{ duration: 75, start: 0.95 }}
					use:clickOutside
					on:click_outside={() => (showRegisterForm = false)}
					class="flex flex-col auth-container todos-container todos justify-center items-stretch p-8"
				>
					<span class="font-bold text-4xl mb-10 text-center"> What is your private key? </span>
					<div class="min-w-full h-48">
						<div class="min-w-full ">
							<label
								for="private_key"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Private Key</label
							>
							<textarea
								class="h-48 min-w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								name="private_key"
								form="login-form"
								placeholder="-----BEGIN RSA PRIVATE KEY----- ..."
								id="private_key"
								required
							/>
						</div>
					</div>
					<button
						class="mt-8 min-w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
						>Login</button
					>
				</div>
			</form>
		{/if}
	{:else}
		<Todo {data} initialTodos={todos} />
	{/if}
</section>

<style>
	.auth-container {
		min-height: 50%;
	}

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
