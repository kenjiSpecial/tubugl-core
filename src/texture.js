const RGB = 0x1907;
const UNSIGNED_BYTE = 0x1401;
const LINEAR = 0x2601;
const CLAMP_TO_EDGE = 0x812F;
const NEAREST = 0x2600;


/**
 * Class representing a Texture
 */
export class Texture {
	/**
	 *
	 * @param {WebGLRenderingContext} gl
	 * @param {GLenum} format
	 * @param {GLenum} internalFormat
	 * @param {GLenum} type
	 */
	constructor(gl, format = RGB, internalFormat = RGB, type = UNSIGNED_BYTE) {
		this._gl = gl;
		if (!this._gl) {
			console.error('[Texture]gl is missed');
			return;
		}

		/**
		 * @member WebGLTexture */
		this._texture = this._gl.createTexture();

		this.setFormat(format, internalFormat, type);

		return this;
	}

	/**
	 * @description active texture
	 * @returns {Texture}
	 */
	activeTexture(unit = 0) {
		this._gl.activeTexture(this._gl.TEXTURE0 + (0 | unit));
		return this;
	}

	/**
	 * @description bind texture
	 *
	 * @returns {Texture}
	 */
	bind() {
		this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
		return this;
	}

	/**
	 * @description unbind texture
	 * @returns Texture
	 */
	unbind() {
		this._gl.bindTexture(this._gl.TEXTURE_2D, null);
		return this;
	}

	/**
	 * @description update data fro texture with image
	 *
	 * @param {Image} image
	 * @param {number} width
	 * @param {number} height
	 *
	 * @returns Texture
	 */
	fromImage(image, width, height) {
		this._width = width ? width : image.width;
		this._height = height ? height : image.height;

		this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._internalFormt, this._format, this._type, image);

		return this;
	}

	/**
	 * @description update texture with width and height and emptyData
	 *
	 * @param {number} width
	 * @param {number} height
	 *
	 * @returns {Texture}
	 */
	fromSize(width, height) {
		if (width) this._width = width;
		if (height) this._height = height;

		this._gl.texImage2D(
			this._gl.TEXTURE_2D,
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

	/**
	 * @description update texture from dataArray
	 *
	 * @param {number} width
	 * @param {number} height
	 * @param {Float32Array|Float64Array} dataArray
	 *
	 * @returns {Texture}
	 */
	fromData(width, height, dataArray) {
		if (width) this._width = width;
		if (height) this._height = height;

		this._gl.texImage2D(
			this._gl.TEXTURE_2D,
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

	/**
	 * @description flip the texture
	 */
	setFlip() {
		this.setPixelStore(this._gl.UNPACK_FLIP_Y_WEBGL, true);
		return this;
	}

	/**
	 * @description specify the pixel storage mode
	 *
	 * @param {GLenum} pname
	 * @param {object} params
	 */
	setPixelStore(pname, params) {
		this._gl.pixelStorei(pname, params);
		return this;
	}

	/**
	 *
	 * @description update format for texture
	 *
	 * @param {GLenum} format
	 * @param {GLenum} internalFormat
	 * @param {Glenum} type
	 */
	setFormat(format, internalFormat, type) {
		if (format) this._format = format;
		if (internalFormat) this._internalFormt = internalFormat;
		if (type) this._type = type;

		return this;
	}
	/**
	 * @description confirm texture is active
	 *
	 * @param {GLenum} unit
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
	 * @param {GLenum} filter
	 *
	 * @returns {Texture}
	 */
	setFilter(filter = LINEAR) {
		this.setMinFilter(filter);
		this.setMagFilter(filter);

		return this;
	}

	/**
	 * set mag filter to texture
	 *
	 * @param {GLenum} filter
	 *
	 * @returns {Texture}
	 */
	setMagFilter(filter = LINEAR) {
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, filter);

		return this;
	}

	/**
	 * set min filter to texture
	 *
	 * @param {GLenum} filter
	 *
	 * @returns {Texture}
	 */
	setMinFilter(filter = NEAREST) {
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, filter);

		return this;
	}

	/**
	 * @description set the wrap mode in texture
	 */
	wrap(wrap = CLAMP_TO_EDGE) {
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, wrap);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, wrap);

		return this;
	}

	/**
	 * generate mipmap for texture
	 *
	 * @returns {WebGLTexture}
	 */
	generateMipmap() {
		this._gl.generateMipmap(this._gl.TEXTURE_2D);

		return this;
	}

	/**
	 * @description get webgl texture
	 * @returns {Texture}
	 */
	getTexture() {
		return this._texture;
	}

	/** @description delete the texture */
	delete() {
		this._gl.deleteTexture(this._texture);
		this._texture = null;
	}
	
	/**
	 * @description get webgl texture as id
	 * @return {WebGLTexture}
	 */
	get id(){
		return this._texture;
	}
}
