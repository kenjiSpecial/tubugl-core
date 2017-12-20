/**
 * test with program, arrayBuffer, indexArrayBuffer, texture
 */

import { Program, ArrayBuffer, IndexArrayBuffer, Texture } from 'tubuGL';

const TweenLite = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

const vertexShaderSrc = `// an attribute will receive data from a buffer
  attribute vec4 a_position;
  attribute vec2 uv; 
  uniform float uTheta;
  
   varying vec2 vUv;
  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position + vec4(0.0 * cos(uTheta), 0.0 * sin(uTheta), 0.0, 0.0);
    vUv = uv;
  }`;

const fragmentShaderSrc = `
  precision mediump float;
  
  varying vec2 vUv;
  
  uniform sampler2D uTexture;

  void main() {
      vec4 color = texture2D( uTexture, vUv);
      gl_FragColor = color;
  }
`;

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

	_onload() {
		this._texture = new Texture(this.gl, 'uTexture');
		this._texture
			.bind()
			.setFilter()
			.wrap()
			.fromImage(this._image, this._image.width, this._image.height);

		this.play();
	}

	createProgram() {
		this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc);

		let pos0 = { x: 0, y: 0 };
		let side = 1.9;

		this.vertices = new Float32Array([
			-side / 2,
			-side / 2,
			side / 2,
			-side / 2,
			side / 2,
			side / 2,
			-side / 2,
			side / 2
		]);

		this._shapeCnt = 6;

		let shapeCnt = 4;
		this.indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

		let uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);

		this._arrayBuffer = new ArrayBuffer(this.gl, this.vertices);
		this._arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		this._uvBuffer = new ArrayBuffer(this.gl, uvs);
		this._uvBuffer.setAttribs('uv', 2, this.gl.FLOAT, false, 0, 0);

		this._indexBuffer = new IndexArrayBuffer(this.gl, this.indices);

		this._obj = {
			program: this._program,
			positionBuffer: this._arrayBuffer,
			uvBuffer: this._uvBuffer,
			indexBuffer: this._indexBuffer,
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
		this._image = new Image();
		this._image.onload = this._onload.bind(this);
		this._image.src = '/assets/images/uv_img.jpg';
	}

	play() {
		this._isPlay = true;
		TweenMax.ticker.addEventListener('tick', this.update, this);
	}

	stop() {
		this._isPlay = false;
		TweenMax.ticker.removeEventListener('tick', this.update, this);
	}

	update() {
		this.stats.update();

		this.gl.enable(this.gl.CULL_FACE);

		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this._obj.program.bind();

		this._obj.program.setUniformTexture(this._texture);
		this._texture.activeTexture().bind();

		this._obj.indexBuffer.bind();
		this._obj.positionBuffer.bind().attribPointer(this._obj.program);
		this._obj.uvBuffer.bind().attribPointer(this._obj.program);

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
