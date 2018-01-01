import { FRAMEBUFFER, COLOR_ATTACHMENT0, RGB, LINEAR, UNSIGNALED } from 'tubugl-constants';
import {
	TEXTURE_2D,
	TEXTURE_WRAP_S,
	TEXTURE_WRAP_T,
	CLAMP_TO_EDGE,
	TEXTURE_MIN_FILTER,
	TEXTURE_MAG_FILTER,
	NEAREST
} from 'tubugl-constants';
import { RGBA, UNSIGNED_BYTE } from 'tubugl-constants';
import { isPowerOf2 } from './utils/functions';
import { Texture } from './texture';

export class FrameBuffer {
	/**
	 *
	 * @param {webglContext} gl
	 * @param {{internalFormat: GLenum, format, GLenum, type: GLenum }} params
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(gl, params, width = 256, height = 256) {
		console.log(params);
		if (typeof params == 'number') {
			console.error('Framebuffer api has been updated. make sure Framebuffer code');
		} else {
			params.internalFormat = params.internalFormat ? params.internalFormat : RGBA;
			params.format = params.format ? params.format : RGBA;

			params.type = params.type ? params.type : UNSIGNED_BYTE;
		}

		this._gl = gl;
		this._width = width;
		this._height = height;

		this.texture = this._makeTexture(params);
		this._frameBuffer = this._gl.createFramebuffer();
		this._gl.bindFramebuffer(FRAMEBUFFER, this._frameBuffer);

		this._gl.framebufferTexture2D(FRAMEBUFFER, COLOR_ATTACHMENT0, TEXTURE_2D, this.texture.getTexture(), 0);
	}

	bind() {
		this._gl.bindFramebuffer(FRAMEBUFFER, this._frameBuffer);

		return this;
	}

	updateViewport() {
		this._gl.viewport(0, 0, this._width, this._height);

		return this;
	}

	unbind() {
		this._gl.bindFramebuffer(FRAMEBUFFER, null);
		return this;
	}

	updateSize(width, height) {
		this._width = width;
		this._height = height;
		// this.texture
	}

	_makeTexture(params) {
		let texture = new Texture(this._gl, params.internalFormat, params.format, params.type);
		texture
			.bind()
			.setFilter(NEAREST) //https://evanw.github.io/lightgl.js/docs/texture.html
			.wrap(CLAMP_TO_EDGE)
			.fromSize(this._width, this._height);

		return texture;
	}

	reset() {
		this.texture.bind().fromSize(this._width, this._height);
	}
}
