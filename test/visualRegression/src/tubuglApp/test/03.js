/**
 * test for draw function
 */

import { Program, ArrayBuffer, IndexArrayBuffer, Texture, draw } from 'tubuGL';

const TweenMax = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

const vertexShaderSrc = `// an attribute will receive data from a buffer
  attribute vec4 a_position;
  uniform vec2 uTrans;
  
  void main() {

    gl_PointSize = 2.;
    gl_Position = a_position + vec4(uTrans, 0.0, 0.0);
  }`;

const fragmentShaderSrc = `
  precision mediump float;
  
  void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

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
		this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc);

		this._pointNum = 100;

		this.vertices = [];
		let side = 0.2;
		for (let ii = 0; ii < this._pointNum; ii++) {
			let xPos = parseInt(ii / 10) / 10 * -side + side / 2;
			let yPos = (ii % 10) / 10 * -side + side / 2;

			this.vertices.push(xPos);
			this.vertices.push(yPos);
		}

		this.indices = [];
		this._shapeCnt = 0;
		for (var xx = 0; xx < 10 - 1; xx++) {
			for (var yy = 0; yy < 10 - 1; yy++) {
				var num = xx * 10 + yy;
				this.indices.push(num);
				this.indices.push(num + 1);
				this.indices.push(num + 10);
				this.indices.push(num + 1);
				this.indices.push(num + 10);
				this.indices.push(num + 11);
				this._shapeCnt += 6;
			}
		}
		this.indices = new Uint16Array(this.indices);

		this.vertices = new Float32Array(this.vertices);
		// this.vertices = new Float32Array( [
		//     -side/2, -side/2,
		//     side/2, -side/2,
		//     side/2,  side/2,
		//     -side/2,  side/2,
		// ] );

		this._arrayBuffer = new ArrayBuffer(this.gl, this.vertices);
		this._arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		this._indexBuffer = new IndexArrayBuffer(this.gl, this.indices);
		this._obj = {
			program: this._program,
			positionBuffer: this._arrayBuffer,
			indexBuffer: this._indexBuffer,
			count: this._pointNum
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
		this.play();
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
		if (this.stats) this.stats.update();

		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this._obj.program.bind();
		this._obj.indexBuffer.bind();
		this._obj.positionBuffer.bind().attribPointer(this._obj.program);

		let uTrans = this._obj.program.getUniforms('uTrans');

		this.gl.uniform2f(uTrans.location, -0.3, 0.0);
		draw.arrayLines(this.gl, this._obj.count);

		this.gl.uniform2f(uTrans.location, 0.0, 0.0);
		draw.arrayPoint(this.gl, this._obj.count);

		this.gl.uniform2f(uTrans.location, 0.3, 0.0);
		draw.element(this.gl, this._shapeCnt);
	}

	resize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this.canvas.width = this._width;
		this.canvas.height = this._height;
		this.gl.viewport(0, 0, this._width, this._height);
	}
}
