import { FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, TEXTURE_2D, SAMPLER_2D, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4, VERTEX_SHADER, FRAGMENT_SHADER, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES, SEPARATE_ATTRIBS, ARRAY_BUFFER, STATIC_DRAW, RGB, UNSIGNED_BYTE, TEXTURE0, LINEAR, NEAREST, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, UNPACK_FLIP_Y_WEBGL, TEXTURE_WRAP_T, TEXTURE_WRAP_S, CLAMP_TO_EDGE, FRAMEBUFFER, COLOR_ATTACHMENT0, RENDERBUFFER, DEPTH_COMPONENT16, DEPTH_ATTACHMENT, RGBA, TRANSFORM_FEEDBACK, TRANSFORM_FEEDBACK_BUFFER, TRIANGLES, POINTS, LINES, UNSIGNED_SHORT } from 'tubugl-constants';

/**
 * compile shader based on three.js
 */

function addLineNumbers(string) {
	let lines = string.split('\n');

	for (let i = 0; i < lines.length; i++) {
		lines[i] = i + 1 + ': ' + lines[i];
	}

	return lines.join('\n');
}

function webGLShader(gl, type, shaderSource) {
	let shader = gl.createShader(type);

	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	} else {
		console.error("[WebGLShader]: Shader couldn't compile.");

		if (gl.getShaderInfoLog(shader) !== '') {
			console.warn(
				'[WebGLShader]: gl.getShaderInfoLog()',
				type === gl.VERTEX_SHADER ? 'vertex' : 'fragment',
				gl.getShaderInfoLog(shader),
				addLineNumbers(shaderSource)
			);

			return null;
		}
	}
}

class Program {
	/**
	 *
	 * @param gl
	 * @param vertSrc
	 * @param fragSrc
	 * @param params
	 */
	constructor(gl, vertSrc, fragSrc, params = {}) {
		this._isReady = false;
		this._isDebgu = params.isDebug;

		this._gl = gl;

		this._initProgram(vertSrc, fragSrc, params);
		this._setProperties();
	}

	_initProgram(vertSrc, fragSrc, params) {
		this._vertexShader = webGLShader(this._gl, VERTEX_SHADER, vertSrc);
		this._fragmentShader = webGLShader(this._gl, FRAGMENT_SHADER, fragSrc);
		this._program = this._gl.createProgram();
		this._gl.attachShader(this._program, this._vertexShader);
		this._gl.attachShader(this._program, this._fragmentShader);
		this._gl.linkProgram(this._program);

		try {
			let success = this._gl.getProgramParameter(this._program, LINK_STATUS);
			if (!success) throw this._gl.getProgramInfoLog(this._program);
		} catch (error) {
			console.error(`WebGLProgram: ${error}`);
		}
	}

	/**
	 * set properties such as uniforms and attributes
	 * @private
	 */
	_setProperties() {
		let ii;

		// uniforms
		const uniformNumber = this._gl.getProgramParameter(this._program, ACTIVE_UNIFORMS);

		this._uniform = {};
		for (ii = 0; ii < uniformNumber; ii++) {
			let uniform = this._gl.getActiveUniform(this._program, ii);
			let uLocation = this._gl.getUniformLocation(this._program, uniform.name);

			let typeName;
			/**
			 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
			 * */
			switch (uniform.type) {
				case FLOAT:
					typeName = 'float';
					break;
				case FLOAT_VEC2:
					typeName = 'vec2';
					break;
				case FLOAT_VEC3:
					typeName = 'vec3';
					break;
				case FLOAT_VEC4:
					typeName = 'vec4';
					break;
				case FLOAT_MAT2:
					typeName = 'mat2';
					break;
				case FLOAT_MAT3:
					typeName = 'mat3';
					break;
				case FLOAT_MAT4:
					typeName = 'mat4';
					break;
				case SAMPLER_2D:
					typeName = 'sampler2D';
					break; // TODO Do we need to some method or not
			}

			this._uniform[uniform.name] = {
				location: uLocation,
				type: uniform.type,
				typeName: typeName,
				size: uniform.size
			};
		}

		//attributes
		const attributreNumber = this._gl.getProgramParameter(this._program, ACTIVE_ATTRIBUTES);
		this._attrib = {};
		for (ii = 0; ii < attributreNumber; ii++) {
			let attrib = this._gl.getActiveAttrib(this._program, ii);
			this._attrib[attrib.name] = {
				location: this._gl.getAttribLocation(this._program, attrib.name),
				type: attrib.type,
				size: attrib.size
			};
		}

		return this;
	}

	use() {
		return this.bind();
	}

	bind() {
		this._gl.useProgram(this._program);
		return this;
	}

	getAttrib(name) {
		return this._attrib[name];
	}

	getUniforms(name) {
		return this._uniform[name];
	}
	/**
	 * set texture as uniform
	 * @param {Texture} texture
	 * @param {String} uniformName
	 */
	setUniformTexture(texture, uniformName) {
		let { textureNum } = texture;
		let uniform = this.getUniforms(uniformName);
		// console.log(textureNum);
		this._gl.uniform1i(uniform.location, textureNum);
	}

	dispose() {
		if (this._gl === null) return;

		this._gl.deleteProgram(this._program);
		this._gl.deleteShader(this._vertexShader);
		this._gl.deleteShader(this._fragmentShader);
		this._gl = null;
	}
}

function detectorWebGL2() {
	let c = document.createElement('canvas');
	try {
		return !!window.WebGL2RenderingContext && !!c.getContext('webgl');
	} catch (e) {
		return null;
	}
}

/**
 * Program2 support Vertex Buffer Object(VBO)
 */
class Program2 extends Program {
	constructor(gl, vertSrc, fragSrc, params = {}) {
		if (!detectorWebGL2()) {
			console.error(
				'gl is not webgl2. make sure your webgl context is webgl2, or use the brose which support webgl2.'
			);
		}

		super(gl, vertSrc, fragSrc, params);
	}

	_initProgram(vertSrc, fragSrc, params = {}) {
		this._vertexShader = webGLShader(this._gl, VERTEX_SHADER, vertSrc);
		this._fragmentShader = webGLShader(this._gl, FRAGMENT_SHADER, fragSrc);
		this._program = this._gl.createProgram();
		this._gl.attachShader(this._program, this._vertexShader);
		this._gl.attachShader(this._program, this._fragmentShader);

		if (params.transformFeedback && Array.isArray(params.transformFeedback)) {
			this._transformFeedback = params.transformFeedback;
			this._gl.transformFeedbackVaryings(this._program, this._transformFeedback, SEPARATE_ATTRIBS);
		}

		this._gl.linkProgram(this._program);

		try {
			let success = this._gl.getProgramParameter(this._program, LINK_STATUS);
			if (!success) throw this._gl.getProgramInfoLog(this._program);
		} catch (error) {
			console.error(`WebGLProgram: ${error}`);
		}
	}
}

class ArrayBuffer {
	constructor(gl, data, params = {}) {
		this.gl = gl;
		this.buffer = this.gl.createBuffer();
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

	disablePoiner(program) {
		this.attribs.forEach(attrib => {
			let location = program.getAttrib(attrib.name).location;
			this.gl.disableVertexAttribArray(location);
		});

		return this;
	}
}

class IndexArrayBuffer {
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

let textureNum = 0;

class Texture {
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
	setFlip() {
		this.setPixelStore(UNPACK_FLIP_Y_WEBGL, true);
		return this;
	}
	setPixelStore(pname, params) {
		this._gl.pixelStorei(pname, params);
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

class FrameBuffer {
    /**
     *
     * @param {webglContext} gl
     * @param {{internalFormat: GLenum, format, GLenum, type: GLenum }} params
     * @param {number} width
     * @param {number} height
     */
    constructor(gl, params, width = 256, height = 256) {
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

        this._gl.framebufferTexture2D(
            FRAMEBUFFER,
            COLOR_ATTACHMENT0,
            TEXTURE_2D,
            this.texture.getTexture(),
            0
        );
    }
    makeDepthBUffer() {
        /**
         * https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html
         */
        // create a depth renderbuffer
        let depthBuffer = this._gl.createRenderbuffer();
        this._gl.bindRenderbuffer(RENDERBUFFER, depthBuffer);

        // make a depth buffer and the same size as the targetTexture
        this._gl.renderbufferStorage(RENDERBUFFER, DEPTH_COMPONENT16, this._width, this._height);
        this._gl.framebufferRenderbuffer(FRAMEBUFFER, DEPTH_ATTACHMENT, RENDERBUFFER, depthBuffer);

        return this;
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

        this.texture.bind().fromSize(this._width, this._height);

        if (this.depthBuffer) {
            this._gl.bindRenderbuffer(RENDERBUFFER, this.depthBuffer);
            this._gl.renderbufferStorage(
                RENDERBUFFER,
                DEPTH_COMPONENT16,
                this._width,
                this._height
            );
        }
    }

    _makeTexture(params) {
        let texture = new Texture(this._gl, params.internalFormat, params.format, params.type);
        texture
            .bind()
            .setFilter(NEAREST) //https://evanw.github.io/lightgl.js/docs/texture.html
            .wrap(CLAMP_TO_EDGE)
            .fromData(this._width, this._height, params.dataArray);

        return texture;
    }

    reset() {
        this.texture.bind().fromSize(this._width, this._height);
    }

    delete() {
        this.texture.delete();
    }
}

/**
 * only support webgl2
 */

class TransformFeedback {
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

/**
 * VertexArray for only webgl2
 */
class VAO {
	constructor(gl) {
		this._gl = gl;
		this._vao = gl.createVertexArray();

		this._arrayBuffers = {};
	}
	bind() {
		this._gl.bindVertexArray(this._vao);

		return this;
	}
	unbind(){
		this._gl.bindVertexArray(null);
		
		return this;
	}
	updateArrayBuffer(program, arrayBuffer, name) {
		this._arrayBuffers[name] = arrayBuffer;
		arrayBuffer.attribPointer(program);

		return this;
	}
	updateIndexBuffer(indexArrayBuffer) {
		indexArrayBuffer.bind();
		return;
	}
	delete() {
		this._gl.deleteVertexArray(this._vao);

		return this;
	}
}

/**
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements
 */
let draw = {
	array: function(gl, cnt, mode = TRIANGLES) {
		gl.drawArrays(mode, 0, cnt);
	},
	element: function(gl, cnt, mode = TRIANGLES) {
		gl.drawElements(mode, cnt, UNSIGNED_SHORT, 0);
	},
	elementPoints: function(gl, cnt) {
		this.element(gl, cnt, POINTS);
	},
	arrayPoint: function(gl, cnt) {
		this.array(gl, cnt, POINTS);
	},
	elementTriangles: function(gl, cnt) {
		this.element(gl, cnt, POINTS);
	},
	arrayLines: function(gl, cnt) {
		this.array(gl, cnt, LINES);
	},
	elementLines: function(gl, cnt) {
		this.element(gl, cnt, LINES);
	}
};

export { Program, Program2, ArrayBuffer, IndexArrayBuffer, Texture, FrameBuffer, TransformFeedback, VAO, draw, webGLShader };
