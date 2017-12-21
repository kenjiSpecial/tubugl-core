import { ARRAY_BUFFER, STATIC_DRAW, DYNAMIC_COPY } from 'tubugl-constants';

export class ArrayBuffer {
	constructor(gl, data, params = {}) {
		this.gl = gl;
		this.buffer = this.gl.createBuffer();
		this.attribs = [];

		try {
			let success =
				data instanceof Float32Array || data instanceof Float64Array;
			if (success) {
				this.bind();
				this.setData(data, params.usage);
				this.unbind();
			} else throw 'data should be  Float32Array or Flaot64Array';
		} catch (error) {
			console.error(error);
		}
	}

	bind() {
		this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);

		return this;
	}

	unbind() {
		this.gl.bindBuffer(ARRAY_BUFFER, null);

		return this;
	}

	setData(array, usage = STATIC_DRAW) {
		this.dataArray = array;

		this.gl.bufferData(ARRAY_BUFFER, array, usage);

		return this;
	}

	setAttribs(name, size, type, normalize, stride, offset) {
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
	 * @param {Program} program
	 * @returns {ArrayBuffer}
	 */
	attribPointer(program) {
		this.attribs.forEach(attrib => {
			let location = program.getAttrib(attrib.name).location;
			let { size, type, normalize, stride, offset } = attrib;

			this.gl.enableVertexAttribArray(location);
			this.gl.vertexAttribPointer(
				location,
				size,
				type,
				normalize,
				stride,
				offset
			);
		});

		return this;
	}

	disablePoiner(program) {
		this.attribs.forEach(attrib => {
			let location = program.getAttrib(attrib.name).location;
			this.gl.disableVertexAttribArray(location);
		});

		return this;
	}
}
