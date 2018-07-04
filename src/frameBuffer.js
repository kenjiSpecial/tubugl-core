import {
	Texture
} from './texture';

/**
 * Class representing a Framebuffer
 */
export class FrameBuffer {
	/**
	 *
	 * @param {webglContext} gl
	 * @param {object} params
	 * @param {GLenum} params.format
	 * @param {GLenum} params.internalFormat
	 * @param {GLenum} params.type
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(gl, params, width = 256, height = 256) {
		if (typeof params == 'number') {
			console.error('Framebuffer api has been updated. make sure Framebuffer code');
		} else {
			params.internalFormat = params.internalFormat ? params.internalFormat : gl.RGBA;
			params.format = params.format ? params.format : gl.RGBA;

			params.type = params.type ? params.type : gl.UNSIGNED_BYTE;
		}

		/**
		 * @member {WebGLRenderingContext}
		 */
		this._gl = gl;
		/**
		 * @member {number}
		 */
		this._width = width;
		/**
		 * @member {number}
		 */
		this._height = height;
		/**
		 * @member {GLenum}
		 */
		this._type = params.type;
		/**
		 * @member {GLenum}
		 */
		this._internalFormat = params.internalFormat;
		/**
		 * @member {GLenum}
		 */
		this._format = params.format;

		/**
		 * @member {GLenum}
		 */
		this._filter = params.filter ? params.filter : this._gl.NEAREST;

		/**
		 * @member {texture}
		 */
		this.texture = this._makeTexture(params);
		/**
		 * @member WebGLFramebuffer
		 */
		this._frameBuffer = this._gl.createFramebuffer();
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);

		this._gl.framebufferTexture2D(
			this._gl.FRAMEBUFFER,
			this._gl.COLOR_ATTACHMENT0,
			this._gl.TEXTURE_2D,
			this.texture.getTexture(),
			0
		);
	}

	/**
	 * @description make depth buffer for framebuffer
	 *
	 * @returns {FrameBuffer}
	 */
	makeDepthBUffer() {
		/**
		 * https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html
		 */
		// create a depth renderbuffer
		let depthBuffer = this._gl.createRenderbuffer();
		this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, depthBuffer);

		// make a depth buffer and the same size as the targetTexture
		this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);
		this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, depthBuffer);

		return this;
	}

	/**
	 * @description update texture and return old texture
	 *
	 * @returns {texture}
	 */
	updateTexture() {
		let prevTexture = this.texture;
		let texture = this._makeTexture();

		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);

		this._gl.framebufferTexture2D(
			this._gl.FRAMEBUFFER,
			this._gl.COLOR_ATTACHMENT0,
			this._gl.TEXTURE_2D,
			texture.getTexture(),
			0
		);

		return prevTexture;
	}

	/**
	 * @description bind framebuffer
	 *
	 * @returns {FrameBuffer}
	 */
	bind() {
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);

		return this;
	}

	/**
	 * @description update view point for framebuffer
	 *
	 * @returns {FrameBuffer}
	 */
	updateViewport() {
		this._gl.viewport(0, 0, this._width, this._height);

		return this;
	}

	/**
	 * @description unbind framebuffer, make framebuffer null
	 *
	 * @returns FrameBuffer
	 */
	unbind() {
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
		return this;
	}

	/**
	 * @description update size of framebuffer and texture
	 *
	 * @param {number} width
	 * @param {number} height
	 *
	 * @returns FrameBuffer
	 */
	updateSize(width, height) {
		this._width = width;
		this._height = height;

		this.texture.bind().fromSize(this._width, this._height);

		if (this.depthBuffer) {
			this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this.depthBuffer);
			this._gl.renderbufferStorage(
				this._gl.RENDERBUFFER,
				this._gl.DEPTH_COMPONENT16,
				this._width,
				this._height
			);
		}
	}

	/**
	 *
	 * @private
	 *
	 * @param {Object} params
	 * @param {Float32Array | Float64Array} params.dataArray
	 *
	 * @returns Texture
	 */
	_makeTexture(params) {
		let texture = new Texture(this._gl, this._internalFormat, this._format, this._type);

		texture
			.bind()
			.setFilter(this._filter) //https://evanw.github.io/lightgl.js/docs/texture.html
			.wrap(this._gl.CLAMP_TO_EDGE);
		if (params && params.dataArray)
			texture.fromData(this._width, this._height, params.dataArray);
		else texture.fromSize(this._width, this._height);

		return texture;
	}

	/**
	 * @description reset texture
	 */
	reset() {
		this.texture.bind().fromSize(this._width, this._height);
	}

	/**
	 * @description delete texture
	 */
	delete() {
		this.texture.delete();
	}
}