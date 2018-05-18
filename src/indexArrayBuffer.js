export class IndexArrayBuffer {
	/**
	 *
	 * @param {WebGLRenderingContext} gl
	 * @param {Uint16Array | Uint32Array} data
	 *
	 * @constructor IndexArrayBuffer
	 */
	constructor(gl, data) {
		/**
		 * @member {WebGLRenderingContext}
		 */
		this._gl = gl;
		/**
		 * @member {WebGLBuffer}
		 */
		this.buffer = this._gl.createBuffer();

		try {
			let sucess = data instanceof Uint16Array || data instanceof Uint32Array;
			if (sucess) this.setData(data);
			else throw 'data should be Uint16Array or Uint32Array';
		} catch (error) {
			console.error(error);
		}
	}
	/**
	 *
	 * update data for IndexArayBuffer
	 *
	 * @param {Uint16Array | Uint32Array} data
	 *
	 * @returns {IndexArrayBuffer}
	 */
	setData(data) {
		/**
		 * @member {Float32Array | Float64Array}
		 */
		this.dataArray = data;

		this.bind();
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
		return this;
	}
	/**
	 * bind the indexArrayBuffer
	 *
	 * @returns {IndexArrayBuffer}
	 */
	bind() {
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.buffer);
		return this;
	}
	/**
	 * unbind the indexArrayBuffer
	 *
	 * @returns {IndexArrayBuffer}
	 */
	unbind() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		return this;
	}
}
