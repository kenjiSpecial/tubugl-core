/**
 * http://www.realtimerendering.com/blog/webgl-2-new-features/
 * http://webglsamples.org/WebGL2Samples/#fbo_multisample
 */
import { Program, Program2, ArrayBuffer, IndexArrayBuffer, FrameBuffer, VAO } from 'tubuGL';
import { UNSIGNED_SHORT } from 'tubugl-constants';
import { PerspectiveCamera, CameraController } from 'tubugl-camera';
import { Cube } from './components/cube';
import { mat4 } from 'gl-matrix';
console.log(PerspectiveCamera);

const TweenLite = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

const vsRender = `#version 300 es
#define POSITION_LOCATION 0

precision highp float;
precision highp int;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

layout(location = POSITION_LOCATION) in vec3 position;

void main()
{

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`;

const fsRender = `#version 300 es
precision highp float;
precision highp int;

out vec4 color;

void main()
{
	color = vec4(1.0, 1.0, 0.0, 1.0);
}`;

const vsSplash = `#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec2 position;
layout(location = 1) in vec2 texcoord;

out vec2 uv;

void main()
{
	uv = vec2(texcoord.x, 1.0 - texcoord.y);
	gl_Position = vec4(position, 0.0, 1.0);
}`;

const fsSplash = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D diffuse;

in vec2 uv;

out vec4 color;

void main()
{
	color = texture(diffuse, uv);
	// color = vec4(0.5, uv.x, uv.y, 1.0);
	// color = vec4(1.0, 0.0, 0.0, 1.0);
}`;

export default class App {
	constructor(params) {
		this.updateAttribute = this.updateAttribute.bind(this);
		this._playAndStop = this._playAndStop.bind(this);

		this._isPlay = false;
		this._width = params.width ? params.width : window.innerWidth;
		this._height = params.height ? params.height : window.innerHeight;

		this._modelMatrix = mat4.create();
		this._rot = 0;

		this.canvas = params.canvas;
		this.gl = this.canvas.getContext('webgl2', { antialias: true });
		this._description = params.description;

		// this.createFrameBuffer();
		this._makeProgram();
		this._makeFramebuffer();
		this._makeCamera();
		this._makeCameraControler();
		this._setDebug();

		this.resize();
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

	_makeProgram() {
		this._renderProgram = createProgram(this.gl, vsRender, fsRender);
		this._splashProgram = createProgram(this.gl, vsSplash, fsSplash);

		this._modelMatrixLocation = this.gl.getUniformLocation(this._renderProgram, 'modelMatrix');
		this._viewMatrixLocation = this.gl.getUniformLocation(this._renderProgram, 'viewMatrix');
		this._projectionMatrixLocation = this.gl.getUniformLocation(
			this._renderProgram,
			'projectionMatrix'
		);
		this._diffuseLocation = this.gl.getUniformLocation(this._splashProgram, 'diffuse');
		// -- Init primitive data
		let cubeObj = Cube.getVertice(1, 1, 1, 1, 1, 1);
		let indices = Cube.getIndices(1, 1, 1);

		let gl = this.gl;
		// -- Init bufferas
		this._vertexDataBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexDataBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeObj.vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		this._indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		this._cnt = indices.length;
		// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		var positions = new Float32Array([
			-1.0,
			-1.0,
			1.0,
			-1.0,
			1.0,
			1.0,
			1.0,
			1.0,
			-1.0,
			1.0,
			-1.0,
			-1.0
		]);
		var vertexPosBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		this._vertexPosBuffer = vertexPosBuffer;

		var texCoords = new Float32Array([
			0.0,
			1.0,
			1.0,
			1.0,
			1.0,
			0.0,
			1.0,
			0.0,
			0.0,
			0.0,
			0.0,
			1.0
		]);
		var vertexTexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		this._vertexTexBuffer = vertexTexBuffer;
	}

	_makeFramebuffer() {
		let gl = this.gl;
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			window.innerWidth,
			window.innerHeight,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			null
		);
		gl.bindTexture(gl.TEXTURE_2D, null);

		this._renderFrameBuffer = gl.createFramebuffer();
		this._colorFrameBuffer = gl.createFramebuffer();

		let colorRenderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
		gl.renderbufferStorageMultisample(
			gl.RENDERBUFFER,
			8,
			gl.RGBA8,
			window.innerWidth,
			window.innerHeight
		);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this._renderFrameBuffer);
		gl.framebufferRenderbuffer(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.RENDERBUFFER,
			colorRenderbuffer
		);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this._colorFrameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		this.texture = texture;

		var vertexPosLocation = 0;
		this._textureVertexArray = gl.createVertexArray();

		gl.bindVertexArray(this._textureVertexArray);
		gl.enableVertexAttribArray(vertexPosLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexDataBuffer);
		gl.vertexAttribPointer(vertexPosLocation, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
		gl.bindVertexArray(null);

		// =============

		this._splashVertexArray = gl.createVertexArray();
		gl.bindVertexArray(this._splashVertexArray);

		gl.enableVertexAttribArray(vertexPosLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexPosBuffer);
		gl.vertexAttribPointer(vertexPosLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		// gl.bindVertexArray(null);

		// console.log(vertexTexLocation);
		gl.enableVertexAttribArray(1);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexTexBuffer);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindVertexArray(null);

		const attributreNumber = gl.getProgramParameter(this._splashProgram, gl.ACTIVE_ATTRIBUTES);
		this._attrib = {};

		for (let ii = 0; ii < attributreNumber; ii++) {
			let attrib = gl.getActiveAttrib(this._splashProgram, ii);
			console.log(attrib);
			// this._attrib[attrib.name] = {
			// 	location: this._gl.getAttribLocation(this._program, attrib.name),
			// 	type: attrib.type,
			// 	size: attrib.size
			// };
		}
	}

	_makeCamera() {
		this._camera = new PerspectiveCamera();
		this._camera.position.z = 10;
	}

	_makeCameraControler() {
		this._cameraControler = new CameraController(this._camera, this.canvas);
		this._cameraControler.minDistance = 0.01;
		this._cameraControler.maxDistance = 2;
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

	_renderCube(isUniformUpdate = true) {
		this.gl.useProgram(this._renderProgram);
		this.gl.bindVertexArray(this._textureVertexArray);

		if (isUniformUpdate) {
			this.gl.uniformMatrix4fv(this._modelMatrixLocation, false, this._modelMatrix);
			this.gl.uniformMatrix4fv(this._viewMatrixLocation, false, this._camera.viewMatrix);
			this.gl.uniformMatrix4fv(
				this._projectionMatrixLocation,
				false,
				this._camera.projectionMatrix
			);
		}
		this.gl.drawElements(this.gl.TRIANGLES, this._cnt, this.gl.UNSIGNED_SHORT, 0);
	}

	_renderNoPass() {
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
		this.gl.viewport(0, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
		this._renderCube(true);
	}

	_renderPostProcessing() {
		let gl = this.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this._colorFrameBuffer);
		gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
		gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		this._renderCube(false);

		// pass 2
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.useProgram(this._splashProgram); // works

		gl.uniform1i(this._diffuseLocation, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.bindVertexArray(this._splashVertexArray); //

		gl.viewport(0, 0, window.innerWidth / 2, window.innerHeight / 2);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	_renderPostProcessingWithMultiSamples() {
		let gl = this.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this._renderFrameBuffer);
		gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
		gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		this._renderCube(false);

		gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._renderFrameBuffer);
		gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._colorFrameBuffer);
		gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 1.0, 1.0]);
		gl.blitFramebuffer(
			0,
			0,
			window.innerWidth,
			window.innerHeight,
			0,
			0,
			window.innerWidth,
			window.innerHeight,
			gl.COLOR_BUFFER_BIT,
			gl.NEAREST
		);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.useProgram(this._splashProgram); // works

		gl.uniform1i(this._diffuseLocation, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.bindVertexArray(this._splashVertexArray);

		gl.viewport(
			window.innerWidth / 2,
			window.innerHeight / 2,
			window.innerWidth / 2,
			window.innerHeight / 2
		);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	update() {
		this.stats.update();

		this._camera.update();

		let gl = this.gl;
		this._rot += 1 / 60;
		mat4.fromYRotation(this._modelMatrix, this._rot);

		gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.BLEND);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// update uniforms

		this._renderNoPass();
		this._renderPostProcessing();
		this._renderPostProcessingWithMultiSamples();
	}

	resize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this.canvas.width = this._width;
		this.canvas.height = this._height;
		this.gl.viewport(0, 0, this._width, this._height);
	}
}

function createShader(gl, source, type) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
	var program = gl.createProgram();
	var vshader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
	var fshader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
	gl.attachShader(program, vshader);
	gl.deleteShader(vshader);
	gl.attachShader(program, fshader);
	gl.deleteShader(fshader);
	gl.linkProgram(program);

	var log = gl.getProgramInfoLog(program);
	if (log) {
		console.log(log);
	}

	log = gl.getShaderInfoLog(vshader);
	if (log) {
		console.log(log);
	}

	log = gl.getShaderInfoLog(fshader);
	if (log) {
		console.log(log);
	}

	return program;
}
