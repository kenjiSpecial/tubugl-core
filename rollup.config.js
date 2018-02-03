import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/main.js',
    indent: '\t',
    // sourceMap: true,
    output: [
        {
            format: 'umd',
            name: 'TUBU',
            file: 'build/tubu.js'
        }
    ],
    plugins: [
        nodeResolve({ preferBuiltins: false }), // or `true`
    ]
};