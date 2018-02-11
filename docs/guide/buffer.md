ArrayBuffer
====

- make custom ArrayBuffer for tubugl

## Usage

### make the arrayBuffer 

```JavaScript
let vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]);

// initialize array buffer with vertice data array(Float32Array or Float64Array) 
arrayBuffer = new ArrayBuffer(this.gl, vertices);
```

### Set the attribute from arrayBuffer

```JavaScript 
arrayBuffer.setAttribs('a_position', 2)
```

### Bind the arrayBuffer to the prgoram as the attribute

```JavaScript
program.use();

arrayBuffer.bind().attribPointer(program);
```

IndexBuffer
====

- make indexArrayBuffer

## Usage

### make the indexArrayBuffer

```JavaScript

// initialize indexArrayBuffer with Uint16Array or Uint32Array
let indexBuffer = new IndexArrayBuffer(this.gl, new Uint16Array([0, 1, 2, 0, 2, 3]));
```

### bind the indexArrayBuffer

```JavaScript
program.use();

indexBuffer.bind();
```