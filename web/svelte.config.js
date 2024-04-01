import adapter from '@sveltejs/adapter-node';
import replace from '@rollup/plugin-replace';

export default {
	kit: {
		adapter: adapter(),
			vite: {
				plugins: [
				  replace({
					preventAssignment: true,
					'process.env.SERVER_HOST': JSON.stringify(process.env.SERVER_HOST || 'http://localhost'),
				  }),
				],
			  },
	}
};

