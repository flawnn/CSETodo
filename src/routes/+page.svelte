<script lang="ts">
	import Todo from '$root/components/Todo.svelte';
	import { getPublicKeyFromPrivateKey } from '$root/lib/util';
	import '$root/styles/global.css';
	import type { Todos } from '$root/types/Todo';
	import { Base64 } from 'js-base64';
	import * as forge from 'node-forge';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { sanitizedUser } from './api/auth/login/+server';

	export let data: PageData;

	let imagesLoaded = false;

	// set to data.todos
	let todos: Todos[] = [
		{ id: '1', text: 'Todo 1', completed: true },
		{ id: '2', text: 'Todo 2', completed: false },
		{ id: '3', text: 'Todo 3', completed: false },
		{ id: '4', text: 'Todo 4', completed: false }
	];

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
			// Show error message in UI, something went wrong; Show Toast or smth
		} else {
			// Show sucess toast, move on to DEK decryption
			let user: sanitizedUser = res.user;

			let decrypted_dek = private_key.decrypt(user.dek);
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
		<Todo {data} {todos} />
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
