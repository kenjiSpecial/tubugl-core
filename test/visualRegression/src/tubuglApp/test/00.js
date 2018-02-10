/**
 * test with program and arrayBuffer
 */
import { Program, ArrayBuffer, draw } from 'tubuGL';

const TweenMax = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

import { mat4 } from 'gl-matrix';

const vertexShaderSrc = `// an attribute will receive data from a buffer
  attribute vec4 a_position;

  uniform mat4 uMat;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = uMat * a_position ;
  }`;

function fragmentShaderSrc(colorR, colorG, colorB) {
	return `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;
  uniform float uColorB;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(${colorR}, ${colorG}, uColorB, 1); // return redish-purple
  }
`;
}

let urlParams = new URLSearchParams(window.location.search);
const isDebug = !(urlParams.has('NoDebug') || urlParams.has('NoDebug/'));

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
		if (isDebug) this._setDebug();
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
		this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc(1.0, 0.0, 0.0));
		let positions = [-0.5, -0.5, -0.3, 0.1, 0, -0.5];
		this._arrayBuffer = new ArrayBuffer(this.gl, new Float32Array(positions));
		this._arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		let uMat0 = mat4.create();
		mat4.scale(uMat0, uMat0, [1, 1, 1]);
		this._obj = {
			program: this._program,
			positionBuffer: this._arrayBuffer,
			uniforms: {
				uColorB: { value: 0.0 },
				uMat: { value: uMat0 }
			},
			count: 3
		};

		this._program1 = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc(1.0, 1.0, 0.0));
		let positions2 = [0, 0, 0, 0.5, 0.7, 0];
		this._arrayBuffer2 = new ArrayBuffer(this.gl, new Float32Array(positions2));
		this._arrayBuffer2.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		this._obj1 = {
			program: this._program1,
			positionBuffer: this._arrayBuffer2,
			uniforms: {
				uColorB: { value: 0 },
				uMat: { value: uMat0 }
			},
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
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions2), this.gl.STATIC_DRAW);
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
		if (this.stats) this.stats.update();

		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this._obj.program.bind();
		this._obj.positionBuffer.bind().attribPointer(this._obj.program);
		this._obj.program.uniform['uColorB'].update(this._obj.uniforms.uColorB.value);
		this._obj.program.uniform['uMat'].update(this._obj.uniforms.uMat.value);
		draw.array(this.gl, this._obj.count);

		this._obj1.program.bind();
		this._obj1.positionBuffer.bind().attribPointer(this._obj1.program);

		this.gl.uniform1f(
			this._obj1.program.uniform['uColorB'].location,
			this._obj1.uniforms.uColorB.value
		);

		this.gl.uniformMatrix4fv(
			this._obj1.program.uniform['uMat'].location,
			false,
			this._obj1.uniforms.uMat.value
		);

		draw.array(this.gl, this._obj.count);
	}

	resize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this.gl.viewport(0, 0, this._width, this._height);
	}
}
