/**
 * test with program, arrayBuffer, and indexArrayBuffer
 */

import { Program, ArrayBuffer, IndexArrayBuffer } from 'tubuGL';

const TweenLite = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

const vertexShaderSrc = `// an attribute will receive data from a buffer
  attribute vec4 a_position;
  uniform float uTheta;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position + vec4(0.0 * cos(uTheta), 0.0 * sin(uTheta), 0.0, 0.0);
  }`;

function fragmentShaderSrc(colorR, colorG, colorB) {
	return `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    float colorR = gl_FrontFacing ? 1.0 : 0.0;
    float colorG = gl_FrontFacing ? 0.0 : 1.0;
    
    gl_FragColor = vec4(colorR, colorG, 0.0, 1.0);
    
  }
`;
}

export default class App {
	constructor(params) {
		this.updateAttribute = this.updateAttribute.bind(this);
		this._playAndStop = this._playAndStop.bind(this);

		this._isPlay = false;
		this._width = params.width ? params.width : window.innerWidth;
		this._height = params.height ? params.height : window.innerHeight;

		this.canvas = params.canvas;
		this.gl = this.canvas.getContext('webgl');
		this._description = params.description;

		this.createProgram();
		this.resize();
		this._setDebug();
	}

	_playAndStop() {
		if (this._isPlay) {
			this.stop();
			this._playAndStopGUI.name('play');
		} else {
			this.start();
			this._playAndStopGUI.name('pause');
		}
	}

	_setDebug() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
		let descriptionDom = document.createElement('div');
		descriptionDom.style.color = '#ffffff';
		descriptionDom.style.fontSize = '12px';
		descriptionDom.style.marginTop = '5px';
		descriptionDom.style.marginLeft = '4px';
		this.stats.dom.appendChild(descriptionDom);
		descriptionDom.innerHTML = this._description;

		this.gui = new dat.GUI();

		this.gui.add(this, 'updateAttribute');
		this._playAndStopGUI = this.gui.add(this, '_playAndStop').name('pause');
	}

	createProgram() {
		this._program = new Program(
			this.gl,
			vertexShaderSrc,
			fragmentShaderSrc(1.0, 0.0, 0.0)
		);
		let positions = [-0.5, -0.5, -0.5, 0.1, -0.1, 0.1, -0.1, -0.5];
		let indices = [0, 1, 2, 0, 2, 3];

		let pos0 = { x: 0.4, y: 0.2 };
		let pos1 = { x: -0.5, y: -0.1 };
		let side = 0.1;
		this.vertices = new Float32Array([
			-side / 2 + pos0.x,
			-side / 2 + pos1.y,
			side / 2 + pos0.x,
			-side / 2 + pos1.y,
			side / 2 + pos0.x,
			side / 2 + pos1.y,
			-side / 2 + pos0.x,
			side / 2 + pos1.y,

			-side / 2 + pos1.x,
			-side / 2 + pos1.y,
			side / 2 + pos1.x,
			-side / 2 + pos1.y,
			side / 2 + pos1.x,
			side / 2 + pos1.y,
			-side / 2 + pos1.x,
			side / 2 + pos1.y
		]);

		this._shapeCnt = 6 * 2;

		let shapeCnt = 4;
		this.indices = new Uint16Array([
			0,
			1,
			2,
			0,
			2,
			3,
			0 + shapeCnt,
			1 + shapeCnt,
			2 + shapeCnt,
			0 + shapeCnt,
			2 + shapeCnt,
			3 + shapeCnt
		]);

		this._arrayBuffer = new ArrayBuffer(this.gl, this.vertices);
		this._arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		this._indexBuffer = new IndexArrayBuffer(this.gl, this.indices);

		this._obj = {
			program: this._program,
			positionBuffer: this._arrayBuffer,
			indexBuffer: this._indexBuffer,
			count: 3
		};

		this._program1 = new Program(
			this.gl,
			vertexShaderSrc,
			fragmentShaderSrc(1.0, 1.0, 0.0)
		);
		let positions2 = [0, 0, 0, 0.5, 0.7, 0];

		this._arrayBuffer2 = new ArrayBuffer(this.gl, new Float32Array(positions2));
		this._arrayBuffer2.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		this._obj1 = {
			program: this._program1,
			positionBuffer: this._arrayBuffer2,
			count: 3
		};
	}

	updateAttribute() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer1);
		let positions2 = [
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5
		];
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(positions2),
			this.gl.STATIC_DRAW
		);
	}

	start() {
		this._isPlay = true;
		TweenMax.ticker.addEventListener('tick', this.update, this);
	}

	stop() {
		this._isPlay = false;
		TweenMax.ticker.removeEventListener('tick', this.update, this);
	}

	update() {
		this.stats.update();

		// this.gl.frontFace(this.gl.CW);
		this.gl.enable(this.gl.CULL_FACE);
		// this.gl.cullFace(this.gl.BACK);

		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this._obj.program.bind();
		this._obj.indexBuffer.bind();
		this._obj.positionBuffer.bind().attribPointer(this._obj.program);
		// this.gl.drawElements(this.gl.TRIANGLES, 3 * 2 , this.gl.UNSIGNED_SHORT, 0);
		let gl = this.gl;

		gl.drawElements(gl.TRIANGLES, this._shapeCnt, gl.UNSIGNED_SHORT, 0);
	}

	resize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this.canvas.width = this._width;
		this.canvas.height = this._height;
		this.gl.viewport(0, 0, this._width, this._height);
	}
}
