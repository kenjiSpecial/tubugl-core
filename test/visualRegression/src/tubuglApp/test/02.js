/**
 * test with program, arrayBuffer, indexArrayBuffer, texture
 */

import { Program, ArrayBuffer, IndexArrayBuffer, Texture } from 'tubuGL';

const TweenMax = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

const vertexShaderSrc = `// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec2 uv;
uniform float uTheta;

varying vec2 vUv;

void main() {
	gl_Position = a_position;
	vUv = uv;
}`;

const fragmentShaderSrc = `
precision mediump float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uTexture2;

void main() {
	
	vec4 color;
	if(vUv.x < 0.5) color = texture2D( uTexture, vUv);
	else color = texture2D( uTexture2, vUv);
	gl_FragColor = color;
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

    _onload() {
        this._cnt++;

        this._texture1 = new Texture(this.gl);
        this._texture1
            .bind()
            .setFilter()
            .wrap()
            .fromImage(this._image1, this._image1.width, this._image1.height);

        if (this._cnt == 2) this.play();
    }

    _onload2() {
        this._cnt++;

        this._texture2 = new Texture(this.gl);
        this._texture2
            .bind()
            .setFilter()
            .wrap()
            .fromImage(this._image2, this._image2.width, this._image2.height);

        if (this._cnt == 2) this.play();
    }

    createProgram() {
        this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc);

        let side = 0.9;
        let left = -0.5;
        let right = 0.5;

        let lVertices = new Float32Array([-side / 2 + left, -side / 2,
            side / 2 + left, -side / 2,
            side / 2 + left,
            side / 2, -side / 2 + left,
            side / 2
        ]);

        let rVertices = new Float32Array([-side / 2 + right, -side / 2,
            side / 2 + right, -side / 2,
            side / 2 + right,
            side / 2, -side / 2 + right,
            side / 2
        ]);

        this._shapeCnt = 6;

        this.indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        let uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);

        let lArrayBuffer = new ArrayBuffer(this.gl, lVertices);
        lArrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

        let rArrayBuffer = new ArrayBuffer(this.gl, rVertices);
        rArrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

        this._uvBuffer = new ArrayBuffer(this.gl, uvs);
        this._uvBuffer.setAttribs('uv', 2, this.gl.FLOAT, false, 0, 0);

        this._indexBuffer = new IndexArrayBuffer(this.gl, this.indices);

        this._obj = {
            program: this._program,
            lPositionBuffer: lArrayBuffer,
            rPositionBuffer: rArrayBuffer,
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
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions2), this.gl.STATIC_DRAW);
    }

    start() {
        this._cnt = 0;

        this._image1 = new Image();
        this._image1.onload = this._onload.bind(this);
        this._image1.src = '/assets/images/uv_img.jpg';

        this._image2 = new Image();
        this._image2.onload = this._onload2.bind(this);
        this._image2.src = '/assets/images/uv_img2.jpg';
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

        this.gl.enable(this.gl.CULL_FACE);

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this._obj.program.bind();
		this._obj.program.setUniformTexture(this._texture1, 'uTexture');
		this._obj.program.setUniformTexture(this._texture2, 'uTexture2');
        this._obj.indexBuffer.bind();
        this._obj.lPositionBuffer.bind().attribPointer(this._obj.program);
        this._obj.uvBuffer.bind().attribPointer(this._obj.program);


        let gl = this.gl;
        gl.drawElements(gl.TRIANGLES, this._shapeCnt, gl.UNSIGNED_SHORT, 0);

		this._obj.program.setUniformTexture(this._texture2, 'uTexture');
		this._obj.program.setUniformTexture(this._texture1, 'uTexture2');
        this._obj.rPositionBuffer.bind().attribPointer(this._obj.program);
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