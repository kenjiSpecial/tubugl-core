import React from 'react';

const path = require('path');

export default {
	getSiteProps: () => ({
		title: 'Tubu'
	}),
	Document: ({ Html, Head, Body, children, siteProps, renderMeta }) => (
		<Html lang="en-US">
			<Head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Body>{children}</Body>
		</Html>
	),
	webpack: (config, { defaultLoaders }) => {
		config.resolve.alias = {
			tubuGL$: path.resolve(__dirname, '../../src/main.js'),
			'tubugl-constants$': path.resolve(__dirname, '../../node_modules/tubugl-constants')
		};

		return config;
	}
};
