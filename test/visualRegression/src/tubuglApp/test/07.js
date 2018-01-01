/**
 * test for gpgpu
 */

import { Program, ArrayBuffer, IndexArrayBuffer, FrameBuffer } from 'tubuGL';
import { FLOAT, UNPACK_FLIP_Y_WEBGL } from 'tubugl-constants';

const TweenMax = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

let urlParams = new URLSearchParams(window.location.search);
const isDebug = !(urlParams.has('NoDebug') || urlParams.has('NoDebug/'));

const vertexShaderSrc = `
attribute vec4 a_position;
attribute vec2 uv;

varying vec2 vUv;
void main() {
    gl_Position = a_position;
    vUv = uv; 
}`;

const fragmentSrc = `
precision mediump float;

uniform sampler2D uTexture;
varying vec2 vUv;

void main(){
	vec4 textureColor = texture2D(uTexture, vec2(vUv.x, 1.0 - vUv.y) );
	textureColor.x += (vUv.x - 0.5)/100.;
	textureColor.y += -(vUv.y - 0.5)/100.;
    
    gl_FragColor = vec4(textureColor.rgb, 1.0);
}
`;

const vertexShader = `// an attribute will receive data from a buffer
attribute vec4 position;

uniform sampler2D uTexture;

void main() {
    vec4 pos = texture2D(uTexture, position.zw);
    gl_Position = vec4(position.xy + pos.xy, 0.0, 1.0);
    gl_PointSize = 10.0;
}`;

const fragmentShader = `
precision mediump float;

void main() {
    float alpha = clamp( 4.0 * (1.0 - distance(gl_PointCoord, vec2(0.5))/0.5 ), 0.0, 1.0);
    if(alpha < 0.001 ) discard;

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`;

const debugFragmentShader = `
precision mediump float;

uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
	vec4 textureColor = texture2D(uTexture, vec2(vUv.x, 1.0 - vUv.y));
    gl_FragColor = vec4( textureColor.rgb, 1.0);
}
`;

export default class App {
	constructor(params) {
		this.reset = this.reset.bind(this);
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

		this.createFrameBuffer();
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
		this.gui.add(this, 'reset');
		this._playAndStopGUI = this.gui.add(this, '_playAndStop').name('pause');
	}

	createFrameBuffer() {
		this.gl.pixelStorei(UNPACK_FLIP_Y_WEBGL, 1);
		let frameBuffer0 = new FrameBuffer(this.gl, { type: FLOAT }, window.innerWidth, window.innerHeight);
		frameBuffer0.unbind();

		let frameBuffer1 = new FrameBuffer(this.gl, { type: FLOAT }, window.innerWidth, window.innerHeight);
		frameBuffer1.unbind();

		this._buffers = {
			read: frameBuffer0,
			write: frameBuffer1,
			front: frameBuffer0,
			back: frameBuffer1
		};

		// this.gl.pixelStorei(UNPACK_FLIP_Y_WEBGL, 0);
	}

	createProgram() {
		this._program = new Program(this.gl, vertexShader, fragmentShader);
		let particleNum = 16 * 16;
		let positions = [];

		for (let ii = 0; ii < particleNum; ii++) {
			// let xPos = Math.random() * 2 - 1;
			// let yPos = Math.random() * 2 - 1;

			positions[4 * ii + 0] = (ii % 16) / 16 * 1.4 - 0.7;
			positions[4 * ii + 1] = parseInt(ii / 16) / 16 * 1.4 - 0.7;
			positions[4 * ii + 2] = (ii % 16) / 16;
			positions[4 * ii + 3] = parseInt(ii / 16) / 16;
		}

		positions = new Float32Array(positions);
		let positionBuffer = new ArrayBuffer(this.gl, positions);
		positionBuffer.setAttribs('position', 4);

		this._obj = {
			program: this._program,
			positionBuffer: positionBuffer,
			count: particleNum
		};

		let program2 = new Program(this.gl, vertexShaderSrc, fragmentSrc);

		let side = 2.0;
		let indices2 = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let vertices2 = new Float32Array([
			-side / 2,
			-side / 2,
			side / 2,
			-side / 2,
			side / 2,
			side / 2,
			-side / 2,
			side / 2
		]);
		let uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);

		let arrayBuffer = new ArrayBuffer(this.gl, vertices2);
		arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		let uvBuffer = new ArrayBuffer(this.gl, uvs);
		uvBuffer.setAttribs('uv', 2, this.gl.FLOAT, false, 0, 0);

		let indexBuffer2 = new IndexArrayBuffer(this.gl, indices2);

		this._position = {
			program: program2,
			indexBuffer: indexBuffer2,
			positionBuffer: arrayBuffer,
			uvBuffer: uvBuffer,
			count: 6
		};

		this._debugProgram = new Program(this.gl, vertexShaderSrc, debugFragmentShader);
	}

	reset() {
		this._buffers.front.reset();
		this._buffers.back.reset();
	}

	start() {
		this._isPlay = true;

		if (isDebug) {
			TweenMax.ticker.addEventListener('tick', this.update, this);
		} else {
			for (let ii = 0; ii < 10; ii++) {
				this.update();
			}
		}
	}

	stop() {
		this._isPlay = false;
		TweenMax.ticker.removeEventListener('tick', this.update, this);
	}

	update() {
		if (this.stats) this.stats.update();

		/**
		 * =====================================
		 */

		this._buffers.write.bind().updateViewport();
		this.gl.unif;

		this._position.program.bind();

		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this._position.program.setUniformTexture(this._buffers.read.texture, 'uTexture');
		this._buffers.read.texture.activeTexture().bind();

		this._position.indexBuffer.bind();
		this._position.positionBuffer.bind().attribPointer(this._position.program);
		this._position.uvBuffer.bind().attribPointer(this._position.program);
		this.gl.drawElements(this.gl.TRIANGLES, this._position.count, this.gl.UNSIGNED_SHORT, 0);

		this._buffers.write.unbind();

		this._obj.program.bind();
		// this._debugProgram.bind();

		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.viewport(0, 0, this._width, this._height);

		/**
		 * rendering of position texture;
		 */
		/** 
		this._debugProgram.setUniformTexture(this._buffers.write.texture, 'uTexture');
		this._buffers.write.texture.activeTexture().bind();

		this._position.indexBuffer.bind();
		this._position.positionBuffer.bind().attribPointer(this._debugProgram);
		this._position.uvBuffer.bind().attribPointer(this._debugProgram);
		this.gl.drawElements(this.gl.TRIANGLES, this._position.count, this.gl.UNSIGNED_SHORT, 0);
		*/

		this._obj.program.setUniformTexture(this._buffers.write.texture, 'uTexture');
		this._buffers.write.texture.activeTexture().bind();

		this._obj.positionBuffer.bind().attribPointer(this._obj.program);
		this.gl.drawArrays(this.gl.POINTS, 0, this._obj.count);

		if (this._buffers.read === this._buffers.front) {
			this._buffers.read = this._buffers.back;
			this._buffers.write = this._buffers.front;
		} else {
			this._buffers.read = this._buffers.front;
			this._buffers.write = this._buffers.back;
		}
	}

	resize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this.canvas.width = this._width;
		this.canvas.height = this._height;
		this.gl.viewport(0, 0, this._width, this._height);
	}
}
