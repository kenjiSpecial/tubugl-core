/**
 * test for gpgpu
 */

import { Program, ArrayBuffer, IndexArrayBuffer, FrameBuffer, Texture } from 'tubuGL';
import { FLOAT, UNPACK_FLIP_Y_WEBGL, RGBA, NEAREST } from 'tubugl-constants';
import { CLAMP_TO_EDGE } from 'tubugl-constants';

const TweenMax = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

let urlParams = new URLSearchParams(window.location.search);
const isDebug = !(urlParams.has('NoDebug') || urlParams.has('NoDebug/'));

const vertexShader = `
uniform sampler2D uInitPosTexture;

attribute vec4 position;
attribute vec2 uv;
attribute vec2 id;

varying vec2 vUv;
varying vec2 vId;

void main() {
	vec4 texColor = texture2D(uInitPosTexture, id);
	gl_Position = position + vec4(texColor.x/100., texColor.y, 0., 0.);
	gl_PointSize = 10.0;
	vUv = vec2(uv.x, 1.0-uv.x); 
	vId = id;
}`;

const fragmentShader = `
precision mediump float;

varying vec2 vUv;
varying vec2 vId;

void main(){
    gl_FragColor = vec4(vId/2. + vec2(0.5), 0.0, 1.0);
}
`;

let size = 2;

export default class App {
	constructor(params) {
		this._playAndStop = this._playAndStop.bind(this);

		this._isPlay = false;
		this._width = params.width ? params.width : window.innerWidth;
		this._height = params.height ? params.height : window.innerHeight;

		this.canvas = params.canvas;
		this.gl = this.canvas.getContext('webgl');
		if (!this.gl.getExtension('OES_texture_float')) {
			throw new Error('This sddemo requires the OES_texture_float extension');
		}

		this.gl.disable(this.gl.DEPTH_TEST);
		this._description = params.description;

		this.makeProgram();
		this.makeTexture();
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
		this._playAndStopGUI = this.gui.add(this, '_playAndStop').name('pause');
	}

	makeProgram() {
		this._program = new Program(this.gl, vertexShader, fragmentShader);
		let particleNum = size * size; //(size + 1) * (size + 1);
		let positions = [];
		let ids = [];

		for (let ii = 0; ii < particleNum; ii++) {
			positions[4 * ii + 0] = 0.0; //jj % 2 - 1;
			positions[4 * ii + 1] = 0.0; //parseInt(jj / 2) - 1;
			positions[4 * ii + 2] = 0.0;
			positions[4 * ii + 3] = 1.0;

			ids.push(parseInt(ii / size) / (size - 1));
			ids.push((ii % size) / (size - 1));
		}

		console.log(ids);
		positions = new Float32Array(positions);
		let positionBuffer = new ArrayBuffer(this.gl, positions);
		positionBuffer.setAttribs('position', 4);

		ids = new Float32Array(ids);
		let idBuffer = new ArrayBuffer(this.gl, ids);
		idBuffer.setAttribs('id', 2);

		this._obj = {
			program: this._program,
			positionBuffer: positionBuffer,
			idBuffer: idBuffer,
			count: particleNum
		};
	}

	makeTexture() {
		this._texture = new Texture(this.gl, RGBA, RGBA, FLOAT);

		let dataArr = [];
		for (let ii = 0; ii < size * size; ii++) {
			let xx = (ii % size) / (size - 1) - 0.5;
			let yy = parseInt(ii / size) / (size - 1) - 0.5;

			dataArr.push(xx * 100, yy, 0, 0);
		}
		console.log(dataArr);

		this._texture
			.bind()
			.setFilter(NEAREST)
			.wrap(CLAMP_TO_EDGE)
			.fromData(size, size, new Float32Array(dataArr));
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

		/**
		 * ===============================
		 */

		this._obj.program.bind();

		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.viewport(0, 0, this._width, this._height);

		this._obj.program.setUniformTexture(this._texture, 'uInitPosTexture');

		this._obj.positionBuffer.bind().attribPointer(this._obj.program);
		this._obj.idBuffer.bind().attribPointer(this._obj.program);

		this.gl.drawArrays(this.gl.POINTS, 0, this._obj.count);
	}

	resize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this.canvas.width = this._width;
		this.canvas.height = this._height;
		this.gl.viewport(0, 0, this._width, this._height);
	}
}
