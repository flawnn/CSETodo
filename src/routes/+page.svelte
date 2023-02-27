<script lang="ts">
	import Todo from '$root/components/Todo.svelte';
	import { decryptTodos, getPublicKeyFromPrivateKey } from '$root/lib/util';
	import '$root/styles/global.css';
	import type { Todos } from '$root/types/Todo';
	import { toast } from '@zerodevx/svelte-toast';
	import { Base64 } from 'js-base64';
	import * as forge from 'node-forge';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import type { sanitizedUser } from './api/auth/login/+server';

	export let data: PageData;

	export let form: ActionData;

	let loadDone = false;

	let todos: Todos[] = [
		{ id: '1', text: 'Todo 1', completed: true },
		{ id: '2', text: 'Todo 2', completed: false },
		{ id: '3', text: 'Todo 3', completed: false },
		{ id: '4', text: 'Todo 4', completed: false }
	];

	onMount(async () => {
		if (form != null) {
			localStorage.setItem('dek', form.dek!);
			localStorage.setItem('public_key', form.public_key!);

			if (form.error != undefined) {
				toast.push(form.error!);
			}

			toast.push(form?.dek + ' and ' + form?.private_key);

			form = null;
		}

		// LOAD before Page shown section
		// Fetch background image from the server
		let blob = await (await fetch('https://source.unsplash.com/640x360/?mountains')).blob();
		document.body.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;

		if (data.user != undefined) {
			todos = decryptTodos(
				Base64.decode(localStorage.getItem('dek')!)!,
				await (await fetch('api/tasks')).text()
			);
		}

		loadDone = !loadDone;
	});

	async function handleLogin(e: Event) {
		const formData = new FormData(e.target as HTMLFormElement);

		let private_key = forge.pki.privateKeyFromPem(
			(formData.get('pkey') as FormDataEntryValue).toString()
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
			// Show sucess toast, move on to DEK decryption
			let user: sanitizedUser = res.user;

			let decrypted_dek = private_key.decrypt(Base64.decode(user.dek));
			localStorage.setItem('dek', decrypted_dek);
			localStorage.setItem('public_key', public_key);

			// Populate todo object
			var decipher = forge.cipher.createDecipher('AES-CBC', decrypted_dek);

			// TODO: DON'T USE CONSTANT IV
			decipher.start({ iv: 'GGGGGGGGGGGGGGGG' });
			decipher.update(forge.util.createBuffer(user.todos));
			decipher.finish();

			todos = JSON.parse(decipher.output.toString());
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
		<form id="register-form" method="POST" action="?/register">
			<div
				class="flex flex-col auth-container todos-container todos justify-center items-center p-8"
			>
				<span class="font-bold text-4xl mb-10 text-center">
					Welcome!<br />Please Login or Sign-Up
				</span>
				<div class="flex flex-row min-w-full justify-items-stretch">
					<button
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
