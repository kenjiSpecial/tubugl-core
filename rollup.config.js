// https://github.com/rollup/rollup
// https://github.com/rollup/rollup-starter-lib
// https://github.com/rollup

import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import replace from 'rollup-plugin-replace';

console.log('library name' + pkg.libName + ', version: ' + pkg.version);

export default [
	// browser-friendly UMD build
	{
		input: './src/index.js',
		output: {
			name: pkg.libName,
			file: pkg.main,
			format: 'umd',
			extend: true
		},
		plugins: [
			babel(babelrc()),
			// resolve(), // so Rollup can find `ms`
			commonjs(),
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	},
	{
		input: './src/index2.js',
		output: {
			name: pkg.libName,
			file: pkg.main2,
			format: 'umd',
			extend: true
		},
		plugins: [
			babel(babelrc()),
			// resolve(), // so Rollup can find `ms`
			commonjs(),
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	},
	{
		input: './src/index.js',
		output: {
			name: pkg.libName,
			file: './docs/example/vendor/tubu.js',
			format: 'umd',
			extend: true
		},
		plugins: [
			babel(babelrc()),
			commonjs(),
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	},
	{
		input: './src/index2.js',
		output: {
			name: pkg.libName,
			file: './docs/example/vendor/tubu2.js',
			format: 'umd',
			extend: true
		},
		plugins: [
			babel(babelrc()),
			commonjs(),
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	},
	{
		input: './src/index.js',
		output: [{ file: pkg.cjs, format: 'cjs' }],
		plugins: [
			babel(babelrc()),
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	},
	{
		input: './src/index2.js',
		output: [{ file: pkg.cjs2, format: 'cjs' }],
		plugins: [
			babel(babelrc()),
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	},
	{
		input: './src/index.js',
		output: [{ file: pkg.esm, format: 'es' }],
		plugins: [
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	},
	{
		input: './src/index2.js',
		output: [{ file: pkg.esm2, format: 'es' }],
		plugins: [
			replace({
				TUBUGL_VERSOIN: pkg.version
			})
		]
	}
];
