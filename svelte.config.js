import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from "svelte-preprocess";

export default {
  preprocess: sveltePreprocess(),

	kit: {
		adapter: adapter(),
		files: {
			template: "index.html",
		}
	}
};
