import { ARRAY_BUFFER, STATIC_DRAW, FLOAT } from 'tubugl-constants';

export class ArrayBuffer {
	/**
	 *
	 * @param {WebGLRenderingContext} gl
	 * @param {Float32Array|Flaot64Array} data
	 * @param {Object} params
	 * @param {*} params.usage
	 *
	 * @constructor ArrayBuffer
	 */
	constructor(gl, data, params = {}) {
		/**
		 * @member {WebGLRenderingContext}
		 */
		this.gl = gl;
		/**
		 * @member {WebGLBuffer}
		 */
		this.buffer = this.gl.createBuffer();
		/**
		 * @member {Array}
		 */
		this.attribs = [];

		try {
			let success = data instanceof Float32Array || data instanceof Float64Array;
			if (success) {
				this.bind();
				this.setData(data, params.usage);
				this.unbind();
			} else throw 'data should be  Float32Array or Flaot64Array';
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * @description bind the array buffer
	 *
	 * @returns {ArrayBuffer}
	 */
	bind() {
		this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);

		return this;
	}

	/**
	 * @description unbind the array buffer
	 *
	 * @returns {ArrayBuffer}
	 *
	 */
	unbind() {
		this.gl.bindBuffer(ARRAY_BUFFER, null);

		return this;
	}

	/**
	 * @description set data into arrayBuffer
	 *
	 * @param {Float32Array|Float64Array} array
	 * @param {GLenum} usage
	 *
	 * @returns {ArrayBuffer}
	 */
	setData(array, usage = STATIC_DRAW) {
		/**
		 * @member {Float32Array|Float64Array}
		 */
		this.dataArray = array;

		this.gl.bufferData(ARRAY_BUFFER, array, usage);

		return this;
	}

	/**
	 * set attribute
	 *
	 * @param {string} name name of attributes
	 * @param {number} size size of attributes
	 * @param {GLenum} type
	 * @param {boolean} normalize
	 * @param {number} stride
	 * @param {number} offset
	 *
	 * @returns {ArrayBuffer}
	 */
	setAttribs(name, size, type = FLOAT, normalize = false, stride = 0, offset = 0) {
		this.attribs.push({
			name: name,
			size: size,
			type: type,
			normalize: normalize,
			stride: stride,
			offset: offset
		});

		return this;
	}

	/**
	 * enable attribute  program
	 *
	 * @param {Program} program
	 * @returns {ArrayBuffer}
	 */
	attribPointer(program) {
		this.attribs.forEach(attrib => {
			let programAttr = program.getAttrib(attrib.name); // cached location from program
			if (!programAttr) {
				// console.warn(`attribute ${attrib.name} is not used`);
			} else {
				let location = programAttr.location;
				let { size, type, normalize, stride, offset } = attrib;

				this.gl.enableVertexAttribArray(location);
				this.gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
			}
		});

		return this;
	}

	/**
	 * disable the vertex attribute
	 *
	 * @param {Program} program
	 *
	 * @returns {ArrayBuffer}
	 */
	disablePoiner(program) {
		this.attribs.forEach(attrib => {
			let location = program.getAttrib(attrib.name).location;
			this.gl.disableVertexAttribArray(location);
		});

		return this;
	}
}
