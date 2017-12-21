/**
 * transformfeedback
 */
const TweenLite = require('gsap');
import { webGLShader } from 'tubuGL';

const vertexShaderSrc = `
#version 300 es
in vec4 positoin;
void main(void) {
   gl_PointSize = 20.;
   gl_Position = vec4(-positoin.x, positoin.yzw);
}
`;

const fragmentShaderSrc = `
#version 300 es
precision highp float;
  out vec4 fragColor;
void main(void) {
   fragColor = vec4( 1.,0.,0., 1. );
}
`;

export default class App {
	constructor(params) {
		this._isPlay = false;
		this._width = params.width ? params.width : window.innerWidth;
		this._height = params.height ? params.height : window.innerHeight;

		// console.log(this._width, this._height);

		this.canvas = params.canvas;
		this.gl = this.canvas.getContext('webgl2');

		this.createProgram();
		this.resize();
	}

	createProgram() {
		let vertexShader = webGLShader(
			this.gl,
			this.gl.VERTEX_SHADER,
			vertexShaderSrc.trim()
		);
		let fragmentShader = webGLShader(
			this.gl,
			this.gl.FRAGMENT_SHADER,
			fragmentShaderSrc.trim()
		);

		this._program = this.initProgram(vertexShader, fragmentShader);

		this.gl.useProgram(this._program);

		this._positionAttribLocation = this.gl.getAttribLocation(
			this._program,
			'positoin'
		);
		this.gl.enableVertexAttribArray(this._positionAttribLocation);

		let positionBufferA = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBufferA);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array([0.8, 0.0, 0.0, 1.0]),
			this.gl.DYNAMIC_COPY
		);
		this._positionBufferA = positionBufferA;

		let positionBufferB = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBufferB);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			Float32Array.BYTES_PER_ELEMENT * 4,
			this.gl.DYNAMIC_COPY
		);
		this._positionBufferB = positionBufferB;

		this._readBuffer = this._positionBufferA;
		this._outBuffer = this._positionBufferB;

		this._transformFeedback = this.gl.createTransformFeedback();
		this.gl.bindTransformFeedback(
			this.gl.TRANSFORM_FEEDBACK,
			this._transformFeedback
		);
	}

	initProgram(vertexShader, fragmentShader) {
		let program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.transformFeedbackVaryings(
			program,
			['gl_Position'],
			this.gl.SEPARATE_ATTRIBS
		);
		this.gl.linkProgram(program);
		let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (success) {
			return program;
		}

		// this.gl.deleteProgram(program);
	}

	start() {
		this._isPlay = true;
		TweenMax.ticker.addEventListener('tick', this.update, this);
	}

	update() {
		let gl = this.gl;
		// Clear the canvas
		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.gl.useProgram(this._program);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._readBuffer);
		this.gl.vertexAttribPointer(
			this._positionAttribLocation,
			4,
			this.gl.FLOAT,
			this.gl.FALSE,
			0,
			0
		);
		this.gl.bindBufferBase(
			this.gl.TRANSFORM_FEEDBACK_BUFFER,
			0,
			this._outBuffer
		);

		gl.beginTransformFeedback(gl.POINTS);
		gl.drawArrays(gl.POINTS, 0, 1);
		gl.endTransformFeedback();

		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

		if (this._readBuffer === this._positionBufferA) {
			this._readBuffer = this._positionBufferB;
			this._outBuffer = this._positionBufferA;
		} else {
			this._readBuffer = this._positionBufferA;
			this._outBuffer = this._positionBufferB;
		}
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
