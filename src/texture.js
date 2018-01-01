export let textureNum = 0;

import {
	TEXTURE_2D,
	RGB,
	UNSIGNED_BYTE,
	TEXTURE0,
	LINEAR,
	NEAREST,
	TEXTURE_MIN_FILTER,
	TEXTURE_MAG_FILTER
} from 'tubugl-constants';
import { TEXTURE_WRAP_T, TEXTURE_WRAP_S, CLAMP_TO_EDGE } from 'tubugl-constants';

export class Texture {
	constructor(gl, format = RGB, internalFormat = RGB, type = UNSIGNED_BYTE, unit = textureNum) {
		this._gl = gl;
		if (!this._gl) {
			console.error('[Texture]gl is missed');
			return;
		}

		this._texture = this._gl.createTexture();
		this.textureNum = textureNum;
		this.unit = TEXTURE0 + textureNum;

		this.setFormat(format, internalFormat, type);

		textureNum++;

		// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		return this;
	}
	activeTexture() {
		this._gl.activeTexture(this.unit);
		return this;
	}
	bind() {
		this._gl.bindTexture(TEXTURE_2D, this._texture);
		return this;
	}
	fromImage(image, width, height) {
		this._width = width ? width : image.width;
		this._height = height ? height : image.height;

		this._gl.texImage2D(TEXTURE_2D, 0, this._internalFormt, this._format, this._type, image);

		return this;
	}
	fromSize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this._gl.texImage2D(
			TEXTURE_2D,
			0,
			this._internalFormt,
			this._width,
			this._height,
			0,
			this._format,
			this._type,
			null
		);

		return this;
	}
	fromData(width, height, dataArray) {
		if (width) this._width = width;
		if (height) this._height = height;

		this._gl.texImage2D(
			TEXTURE_2D,
			0,
			this._internalFormt,
			this._width,
			this._height,
			0,
			this._format,
			this._type,
			dataArray
		);
		return this;
	}
	setFormat(format, internalFormat, type) {
		if (format) this._format = format;
		if (internalFormat) this._internalFormt = internalFormat;
		if (type) this._type = type;

		return this;
	}

	/**
	 *
	 * usage:
	 * let activeTextureNum = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);
	 * console.log(this._texture.isActiveTexture(activeTextureNum));
	 *
	 * @param unit
	 * @returns {boolean}
	 */
	isActiveTexture(unit) {
		return unit === this.unit;
	}

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
	 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter
	 * https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
	 *
	 * @param filter
	 */

	setFilter(filter = LINEAR) {
		this.setMinFilter(filter);
		this.setMagFilter(filter);

		return this;
	}
	setMagFilter(filter = LINEAR) {
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, filter);

		return this;
	}
	setMinFilter(filter = NEAREST) {
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, filter);

		return this;
	}
	wrap(wrap = CLAMP_TO_EDGE) {
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, wrap);
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, wrap);

		return this;
	}
	generateMipmap() {
		this._gl.generateMipmap(TEXTURE_2D);

		return this;
	}
	/**
	 * return webglTexture
	 */
	getTexture() {
		return this._texture;
	}
	delete() {
		this._gl.deleteTexture(this._texture);
		this._texture = null;
	}
}
