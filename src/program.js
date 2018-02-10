import { webGLShader } from './utils/webglShader';
import { Uniform } from './uniform';
import {
	FLOAT,
	FLOAT_VEC2,
	FLOAT_VEC3,
	FLOAT_VEC4,
	TEXTURE_2D,
	SAMPLER_2D,
	VERTEX_SHADER,
	FRAGMENT_SHADER,
	LINK_STATUS,
	ACTIVE_UNIFORMS,
	ACTIVE_ATTRIBUTES,
	FLOAT_MAT2,
	FLOAT_MAT3,
	FLOAT_MAT4
} from 'tubugl-constants';

export class Program {
	/**
	 * constructor
	 * compile shaders and link them to gl context
	 *
	 * @param {WebGLRenderingContext} gl
	 * @param {string} vertSrc
	 * @param {string} fragSrc
	 * @param {Object} params
	 * @param {booean} params.isDebug
	 *
	 * @constructor Program
	 */
	constructor(gl, vertSrc, fragSrc, params = {}) {
		this._isReady = false;
		this._isDebgu = params.isDebug;

		this._gl = gl;

		if (vertSrc && fragSrc) {
			this.initProgram(vertSrc, fragSrc, params);
		}
	}

	/**
	 * crate the program and compile shader
	 *
	 * @param {string} vertSrc vertex hader
	 * @param {string} fragSrc fragment shader src
	 * @param {Object} params optinal paramters
	 */
	initProgram(vertSrc, fragSrc, params = {}) {
		this._vertexShader = webGLShader(this._gl, VERTEX_SHADER, vertSrc);
		this._fragmentShader = webGLShader(this._gl, FRAGMENT_SHADER, fragSrc);
		this._program = this._gl.createProgram();
		this._gl.attachShader(this._program, this._vertexShader);
		this._gl.attachShader(this._program, this._fragmentShader);
		this._gl.linkProgram(this._program);

		try {
			let success = this._gl.getProgramParameter(this._program, LINK_STATUS);
			if (!success) throw this._gl.getProgramInfoLog(this._program);
		} catch (error) {
			console.error(`WebGLProgram: ${error}`);
		}

		this._setProperties();
	}

	/**
	 * set properties such as uniforms and attributes
	 * @private
	 */
	_setProperties() {
		let ii;

		// uniforms
		const uniformNumber = this._gl.getProgramParameter(this._program, ACTIVE_UNIFORMS);

		this.uniform = {};
		for (ii = 0; ii < uniformNumber; ii++) {
			let uniformInfo = this._gl.getActiveUniform(this._program, ii);
			this.uniform[uniformInfo.name] = new Uniform(this._gl, this._program, uniformInfo);
		}

		//attributes
		const attributreNumber = this._gl.getProgramParameter(this._program, ACTIVE_ATTRIBUTES);
		this.attrib = {};
		for (ii = 0; ii < attributreNumber; ii++) {
			let attrib = this._gl.getActiveAttrib(this._program, ii);
			this.attrib[attrib.name] = {
				location: this._gl.getAttribLocation(this._program, attrib.name),
				type: attrib.type,
				size: attrib.size
			};
		}

		return this;
	}

	/**
	 * use program, as same function as bind()
	 */
	use() {
		return this.bind();
	}

	/**
	 * use program, as same function as use()
	 */
	bind() {
		this._gl.useProgram(this._program);
		return this;
	}

	/**
	 * get the value of the attribute of program(it will be remove)
	 *
	 * @param {string} name name of attributes
	 */
	getAttrib(name) {
		return this.attrib[name];
	}

	/**
	 * get the value of uniform of program(it will be removed)
	 * @param {string} name name of uniforms
	 */
	getUniforms(name) {
		return this.uniform[name];
	}
	/**
	 * set texture as uniform
	 * @param {Texture} texture
	 * @param {String} uniformName
	 */
	setUniformTexture(texture, uniformName) {
		let { textureNum } = texture;
		this.uniform[uniformName].update(textureNum);
	}

	/**
	 * dispose program
	 */
	dispose() {
		if (this._gl === null) return;

		this._gl.deleteProgram(this._program);
		this._gl.deleteShader(this._vertexShader);
		this._gl.deleteShader(this._fragmentShader);
		this._gl = null;
	}
}
