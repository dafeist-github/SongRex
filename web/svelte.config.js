import adapter from '@sveltejs/adapter-node';
import replace from '@rollup/plugin-replace';

export default {
	kit: {
		adapter: adapter(),
	}
};

