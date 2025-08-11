import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter()
	},
	preprocess: [
		sveltePreprocess({
			scss: true // 启用 SCSS 支持
		})
	]
};
