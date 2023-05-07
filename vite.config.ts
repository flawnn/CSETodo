import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$root: path.resolve('./src')
		}
	},
	test: {
		globals: true,
		environment: 'jsdom'
	}
});
