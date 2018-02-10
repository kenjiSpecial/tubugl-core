Program
=====

- compile the vertex and fragment shader and link shader program to gl context
- set the program as the current rendering stage to render screen or framebuffer object
- get the properties of uniforms and attributes from program
- set the texture to program as the value of the uniform

## Usage

### Create Program

``` JavaScript
let {Program} = require( 'tubugl-core' );

// make a Program with a given gl context and vertex shader and fragment shader
var prgram = new Program( gl, vertexShaderSrc, fragmentShaderSrc )
```