export class IndexArrayBuffer {
	constructor(gl, data) {
		this.gl = gl;
		this.buffer = this.gl.createBuffer();

		try {
			let sucess = data instanceof Uint16Array || data instanceof Uint32Array;
			if (sucess) this.setData(data);
			else throw 'data should be Uint16Array or Uint32Array';
		} catch (error) {
			console.error(error);
		}
	}

	setData(data) {
		this.dataArray = data;

		this.bind();
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
		return this;
	}
	bind() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
		return this;
	}
	unbind() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		return this;
	}
}
