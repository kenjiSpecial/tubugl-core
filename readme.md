# tubugl-core
[![NPM version][npm-image]][npm-url] 

[tubugl](https://github.com/kenjiSpecial/tubugl) (personal micro webgl framework) core modules.

## Contents
[Framework API Document](https://kenjispecial.github.io/tubugl-core/api/)

### Program
In program class, parogram is created, shaders are compiled, and they are liked to gl context to render frambebuffers.

[program.js](https://github.com/kenjiSpecial/tubugl-core/blob/master/src/program.js) | [guide](https://kenjispecial.github.io/tubugl-core/guide/program) | [docs](https://kenjispecial.github.io/tubugl-core/api/Program.html)

###  ArrayBuffer

[arrayBuffer.js](https://github.com/kenjiSpecial/tubugl-core/blob/master/src/arrayBuffer.js) | [guide](https://kenjispecial.github.io/tubugl-core/guide/buffer) | [docs](https://kenjispecial.github.io/tubugl-core/api/ArrayBuffer.html)

### IndexArrayBuffer

[indexArrayBuffer.js](https://github.com/kenjiSpecial/tubugl-core/blob/master/src/indexArrayBuffer.js) | [guide](https://kenjispecial.github.io/tubugl-core/guide/buffer) | [docs](https://kenjispecial.github.io/tubugl-core/api/FrameBuffer.html)

### Texture

[texture.js](https://github.com/kenjiSpecial/tubugl-core/blob/master/src/texture.js) | [docs](https://kenjispecial.github.io/tubugl-core/api/Texture.html)

### FrameBuffer

[FrameBuffer.js](https://github.com/kenjiSpecial/tubugl-core/blob/master/src/frameBuffer.js) | [docs](https://kenjispecial.github.io/tubugl-core/api/FrameBuffer.html)


 
## functionality test

https://kenjispecial.github.io/tubugl-core/

source: https://github.com/kenjiSpecial/tubugl-core/tree/master/test/visualRegression

## other modules

- [tubugl-constants](https://github.com/kenjiSpecial/tubugl-constants)


## referrences

- [three.js](https://github.com/mrdoob/three.js/)
- [nanogl](https://github.com/plepers/nanogl/)
- [stack.gl](http://stack.gl/)
- [stack.gl/fbo.js](https://github.com/stackgl/gl-fbo/blob/master/fbo.js)
- [picogl](https://tsherif.github.io/picogl.js/)

[npm-image]: https://img.shields.io/npm/v/tubugl-core.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/tubugl-core 


## TODO

- [ ] add test for build(amd, cjs, esm)
- [ ] update pace from react static(there are some issue to build from react static) 
- [x] update version
- [x] add api doc.md in docs like nano.gl
