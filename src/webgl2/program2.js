import { webGLShader } from '../utils/webglShader';
import { detectorWebGL2 } from '../utils/detector';

import { Program } from '../program';

/**
 * Program2 support Vertex Buffer Object(VBO)
 */
export class Program2 extends Program {
	constructor(gl, vertSrc, fragSrc, params = {}) {
		if (!detectorWebGL2()) {
			console.error(
				'gl is not webgl2. make sure your webgl context is webgl2, or use the brose which support webgl2.'
			);
		}
		

		super(gl, vertSrc, fragSrc, params);
	}

	initProgram(vertSrc, fragSrc, params = {}) {
		this._vertexShader = webGLShader(this._gl, this._gl.VERTEX_SHADER, vertSrc);
		this._fragmentShader = webGLShader(this._gl, this._gl.FRAGMENT_SHADER, fragSrc);
		this._program = this._gl.createProgram();
		this._gl.attachShader(this._program, this._vertexShader);
		this._gl.attachShader(this._program, this._fragmentShader);
		
		
		if (params.transformFeedback && Array.isArray(params.transformFeedback)) {
			this._transformFeedback = params.transformFeedback;
			this._gl.transformFeedbackVaryings(this._program, this._transformFeedback, this._gl.SEPARATE_ATTRIBS);
		}

		this._gl.linkProgram(this._program);

		try {
			let success = this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS);
			if (!success) throw this._gl.getProgramInfoLog(this._program);
		} catch (error) {
			console.error(`WebGLProgram: ${error}`);
		}
		
		this._setProperties();
	}
}