import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';

export default defineConfig({
	plugins: [sveltekit(),
		replace({
			preventAssignment: true,
			'process.env.SERVER_HOST': JSON.stringify(import.meta.env.VITE_SERVER_HOST || 'http://localhost'),
		  }),
	]
});
