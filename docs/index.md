## tubugl core modules API

[API documents](https://kenjispecial.github.io/tubugl-core/api/)

## tubugl core modules Guide

- [Guide for Program](https://kenjispecial.github.io/tubugl-core/guide/program)
- [Guide for ArrayBuffer and IndexArrayBuffer](https://kenjispecial.github.io/tubugl-core/guide/buffer)

### test core functionalities

#### #00 -  test with program and arrayBuffer

![](./assets/test-00.png)

[program.js][source-program] | [arrayBuffer][source-arrayBuffer] 

#### #01 - test with program, arrayBuffer, and indexArrayBuffer

![](./assets/__image_snapshots__/index-spec-js-01-program-array-buffer-and-index-array-buffer-1-snap.png)

[program.js][source-program] | [arrayBuffer][source-arrayBuffer] 

#### #02 - test with program, arrayBuffer, indexArrayBuffer, texture

![](./assets/__image_snapshots__/index-spec-js-02-program-array-buffer-index-array-buffer-texture-1-snap.png)

[program.js][source-program] | [arrayBuffer][source-arrayBuffer] | [indexArrayBuffer][source-arrayBuffer] | [texture][source-texture]

#### #03 - test with draw function

![](./assets/__image_snapshots__/index-spec-js-03-draw-function-1-snap.png)

 [program.js][source-program] | [arrayBuffer][source-arrayBuffer] | [indexArrayBuffer][source-arrayBuffer] | [draw.js][source-draw]]

#### #04 - test with framebuffer

![](./assets/__image_snapshots__/index-spec-js-04-framebuffer-1-snap.png)

 [program.js][source-program] | [arrayBuffer][source-arrayBuffer] | [indexArrayBuffer][source-arrayBuffer] | [frameBuffer][source-frameBuffer]

#### #05 - test with vao

![](./assets/__image_snapshots__/index-spec-js-05-vao-webgl-2-1-snap.png)

 [program.js][source-program] | [arrayBuffer][source-arrayBuffer] | [indexArrayBuffer][source-arrayBuffer] | [frameBuffer][source-frameBuffera] | [VAO][source-vao]


#### #06 - test with transformfeedback

![](./assets/__image_snapshots__/index-spec-js-06-program-2-and-transform-feedback-webgl-2-1-snap.png)

 [program2.js][source-program2] | [arrayBuffer][source-arrayBuffer] [frameBuffer][source-frameBuffera] | [VAO][source-vao] | [transformFeedback][source-tranformFeedback]
 

#### #06 - test for gpgpu

![](./assets/__image_snapshots__/index-spec-js-07-program-and-gpgpu-based-on-frame-buffer-1-snap.png)

 [program.js][source-program] | [arrayBuffer][source-arrayBuffer] | [indexArrayBuffer][source-arrayBuffer] | [frameBuffer][source-frameBuffer]

[source-program]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/program.js
[source-program2]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/program2.js
[source-arrayBuffer]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/arrayBuffer.js
[source-draw]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/draw.js
[source-frameBuffer]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/frameBuffer.js
[source-indexArrayBuffer]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/indexArrayBuffer.js
[source-texture]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/texture.js
[source-tranformFeedback]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/tranformFeedback.js
[source-vao]: https://github.com/kenjiSpecial/tubugl-core/blob/master/src/vao.js
