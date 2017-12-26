/**
 * only support webgl2
 */

import { TRANSFORM_FEEDBACK, ARRAY_BUFFER, TRANSFORM_FEEDBACK_BUFFER } from 'tubugl-constants';

export class TransformFeedback {
	constructor(gl) {
		this._gl = gl;
		this._transfromFeedback = gl.createTransformFeedback();
		this._arrayBuffers = [];
	}
	bind() {
		this._gl.bindTransformFeedback(TRANSFORM_FEEDBACK, this._transfromFeedback);

		return this;
	}
	unbindBufferBase() {
		this._arrayBuffers.forEach((arrayBuffers, index) =>
			this._gl.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, index, null)
		);

		return this;
	}

	/**
	 *
	 * @param {Program} program
	 */
	updateBufferBase(program) {
		this._arrayBuffers.forEach((arrayBuffers, index) => {
			this._gl.bindBuffer(ARRAY_BUFFER, arrayBuffers.read.buffer);
			this._gl.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, index, arrayBuffers.write.buffer);
			arrayBuffers.read.attribPointer(program);
		});
	}
	/**
	 *
	 * @param {Number} index
	 * @param {{read: arrayBuffer, write: arrayBuffer, name: string}} arrayBuffers
	 */
	addArrayBufer(index, arrayBuffers) {
		this._arrayBuffers[index] = arrayBuffers;
	}

	swapArrayBuffers() {
		this._arrayBuffers.forEach(arrayBuffers => {
			let a = arrayBuffers.read;
			arrayBuffers.read = arrayBuffers.write;
			arrayBuffers.write = a;
		});
	}

	update() {}
}
