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

// make program with vertexShaderSrc and fragmentShaderSrc
let program  = new Program( gl, vertexShaderSrc, fragmentShaderSrc )
```

### use program

``` JavaScript
// use program
program.use();
```

### update uniform

``` JavaScript
// update uniform
let uColorUniform = program.getUniforms('uColor');
gl.uniform3f(uColorUniform.location, 1.0, 0.0, 0.0);

// update uniform
program.uniform['uColor'].update(1.0, 0.0, 0.0);
```

### set texture as uniform

``` JavaScript
texture.activeTexture().bind();

program.setUniformTexture(texture, 'uTexture');
```

### enable attribute

``` JavaScript
// positionAttibute is the object made from ArrayBuffer
positionAttibute.bind().attribPointer(program);
```

