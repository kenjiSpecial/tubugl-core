const TweenLite = require('gsap');
import { webglShader } from 'tubuGL';

const vertexShaderSrc = `// an attribute will receive data from a buffer
  attribute vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }`;

const fragmentShaderSrc = `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
  }
`;

export default class App {
	constructor(params) {
		this._isPlay = false;
		this._width = params.width ? params.width : window.innerWidth;
		this._height = params.height ? params.height : window.innerHeight;

		// console.log(this._width, this._height);

		this.canvas = params.canvas;
		this.gl = this.canvas.getContext('webgl');

		this.createProgram();
		this.resize();
	}

	createProgram() {
		let vertexShader = webGLShader(
			this.gl,
			this.gl.VERTEX_SHADER,
			vertexShaderSrc
		);
		let fragmentShader = webGLShader(
			this.gl,
			this.gl.FRAGMENT_SHADER,
			fragmentShaderSrc
		);
		this._program = this.initProgram(vertexShader, fragmentShader);

		this._positionAttribLocation = this.gl.getAttribLocation(
			this._program,
			'a_position'
		);
		let positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

		var positions = [0, 0, 0, 0.5, 0.7, 0, 0.0];
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(positions),
			this.gl.STATIC_DRAW
		);

		this._positionBuffer = positionBuffer;
	}

	initProgram(vertexShader, fragmentShader) {
		let program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);
		let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (success) {
			return program;
		}

		this.gl.deleteProgram(program);
	}

	start() {
		this._isPlay = true;
		TweenMax.ticker.addEventListener('tick', this.update, this);
	}

	update() {
		// Clear the canvas
		this.gl.clearColor(0, 0, 0, 0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.gl.useProgram(this._program);

		// Turn on the attribute
		this.gl.enableVertexAttribArray(this._positionAttribLocation);

		// Bind the position buffer.
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 2; // 2 components per iteration
		var type = this.gl.FLOAT; // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0; // start at the beginning of the buffer
		this.gl.vertexAttribPointer(
			this._positionAttribLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);

		// draw
		var primitiveType = this.gl.TRIANGLES;
		var offset = 0;
		var count = 3;
		this.gl.drawArrays(primitiveType, offset, count);
	}

	stop() {
		TweenMax.ticker.addEventListener('tick', this.update, this);
	}

	resize(width, height) {
		console.log(width, height);

		if (width) this._width = width;
		if (height) this._height = height;

		this.gl.viewport(0, 0, this._width, this._height);
	}
}
