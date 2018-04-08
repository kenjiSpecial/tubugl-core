import { FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4, SAMPLER_2D, VERTEX_SHADER, FRAGMENT_SHADER, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES, SEPARATE_ATTRIBS, ARRAY_BUFFER, STATIC_DRAW, TEXTURE_2D, RGB, UNSIGNED_BYTE, LINEAR, NEAREST, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, UNPACK_FLIP_Y_WEBGL, TEXTURE_WRAP_T, TEXTURE_WRAP_S, CLAMP_TO_EDGE, FRAMEBUFFER, COLOR_ATTACHMENT0, RENDERBUFFER, DEPTH_COMPONENT16, DEPTH_ATTACHMENT, RGBA, TRANSFORM_FEEDBACK, TRANSFORM_FEEDBACK_BUFFER, TRIANGLES, POINTS, LINES, UNSIGNED_SHORT } from 'tubugl-constants';

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

/**
 * Class representing a Uniform for a Program class
 */
class Uniform {
    /**
     * @description Uniform class constructor
     *
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {WebGLActiveInfo} uniform information of unifrom getting from getActiveUniform
     * @param {Object} context
     * @param {Number} context.textIndex
     *
     * @constructor Uniform
     */
    constructor(gl, program, uniform, context) {
            let uniformLocation = gl.getUniformLocation(program, uniform.name);
            this.location = uniformLocation;
            this.size = uniform.size;
            this._gl = gl;

            let typeName;
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
					this.unit = context.texIndex ++;
                    break; // TODO Do we need to some method or not
            }


            this.typeName = typeName;
            this.type = uniform.type;

        }
        /**
         * update unifroms
         *
         * @param {Array} args
         */
    update(...args) {
        // console.log(this.typeName);
        switch (this.type) {
            case FLOAT:
                this._gl.uniform1f(this.location, args[0]);
                break;
            case FLOAT_VEC2:
                this._gl.uniform2f(this.location, args[0], args[1]);
                break;
            case FLOAT_VEC3:
                this._gl.uniform3f(this.location, args[0], args[1], args[2]);
                break;
            case FLOAT_VEC4:
                this._gl.uniform4f(this.location, args[0], args[1], args[2], args[3]);
                break;
            case FLOAT_MAT2:
                this._gl.uniformMatrix2fv(this.location, false, args[0]);
                break;
            case FLOAT_MAT3:
                this._gl.uniformMatrix3fv(this.location, false, args[0]);
                break;
            case FLOAT_MAT4:
                this._gl.uniformMatrix4fv(this.location, false, args[0]);
                break;
            case SAMPLER_2D:
                this._gl.uniform1i(this.location, args[0]);
                break;
        }
    }
}

class Program {
    /**
     * constructor
     * compile shaders and link them to gl context
     *
     * @param {WebGLRenderingContext} gl
     * @param {string} vertSrc
     * @param {string} fragSrc
     * @param {Object} params
     * @param {booean} params.isDebug
     *
     * @constructor Program
     */
    constructor(gl, vertSrc, fragSrc, params = {}) {
        /**
         * @private
         * @member {boolean}
         */
        this._isReady = false;
        /**
         * @private
         * @member {boolean}
         */
        this._isDebgu = params.isDebug;

        /**
         * @private
         * @member {WebGLRenderingContext}
         */
        this._gl = gl;

        if (vertSrc && fragSrc) {
            this.initProgram(vertSrc, fragSrc);
        }
    }

    /**
     * crate the program and compile shader
     *
     * @param {string} vertSrc vertex hader
     * @param {string} fragSrc fragment shader src
     */
    initProgram(vertSrc, fragSrc) {
        /**
         * @description vertexShader
         * @private
         * @member {WebGLShader}
         */
        this._vertexShader = webGLShader(this._gl, VERTEX_SHADER, vertSrc);
        /**
         * @description fragmentShader
         * @private
         * @member {WebGLShader}
         */
        this._fragmentShader = webGLShader(this._gl, FRAGMENT_SHADER, fragSrc);
        /**
         * @description program
         * @private
         * @member {WebGLProgram}
         */
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

        this._setProperties();
    }

    /**
     * set properties such as uniforms and attributes
     * @private
     */
    _setProperties() {
        let ii;
        let context = { texIndex: 0 };

        // ============
        //   uniforms
        // ============
	
        const uniformNumber = this._gl.getProgramParameter(this._program, ACTIVE_UNIFORMS);

        /**
         * @member {object}
         */
        this.uniform = {};
        for (ii = 0; ii < uniformNumber; ii++) {
            let uniformInfo = this._gl.getActiveUniform(this._program, ii);
            this.uniform[uniformInfo.name] = new Uniform(this._gl, this._program, uniformInfo, context);
        }

        // ============
        //  attributes
        // ============

        const attributreNumber = this._gl.getProgramParameter(this._program, ACTIVE_ATTRIBUTES);
        /**
         * @member {object}
         */
        this.attrib = {};
        for (ii = 0; ii < attributreNumber; ii++) {
            let attrib = this._gl.getActiveAttrib(this._program, ii);
            this.attrib[attrib.name] = {
                location: this._gl.getAttribLocation(this._program, attrib.name),
                type: attrib.type,
                size: attrib.size
            };
        }

        return this;
    }

    /**
     * use program, as same function as bind()
     */
    use() {
        return this.bind();
    }

    /**
     * use program, as same function as use()
     */
    bind() {
        this._gl.useProgram(this._program);
        return this;
    }

    /**
     * get the value of the attribute of program(it will be remove)
     *
     * @param {string} name name of attributes
     */
    getAttrib(name) {
        return this.attrib[name];
    }

    /**
     * get the value of uniform of program(it will be removed)
     * @param {string} name name of uniforms
     */
    getUniforms(name) {
            return this.uniform[name];
        }
        /**
         * set texture as uniform
         * @param {Texture} texture
         * @param {String} uniformName
         */
    setUniformTexture(texture, uniformName) {
		let unit = this.uniform[uniformName].unit;
		texture.activeTexture(unit).bind();
        this.uniform[uniformName].update(unit);
    }

    /**
     * dispose program
     */
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

class IndexArrayBuffer {
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
		this.gl = gl;
		/**
		 * @member {WebGLBuffer}
		 */
		this.buffer = this.gl.createBuffer();

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
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
		return this;
	}
	/**
	 * bind the indexArrayBuffer
	 *
	 * @returns {IndexArrayBuffer}
	 */
	bind() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
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

// export let textureNum = 0;

/**
 * Class representing a Texture
 */
class Texture {
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
		/** @member GLenum */

		this.setFormat(format, internalFormat, type);

		return this;
	}

	/**
	 * @description active texture
	 * @returns {Texture}
	 */
	activeTexture(unit = 0) {
		this._gl.activeTexture( this._gl.TEXTURE0 + (0|unit) );
		return this;
	}

	/**
	 * @description bind texture
	 *
	 * @returns {Texture}
	 */
	bind() {
		this._gl.bindTexture(TEXTURE_2D, this._texture);
		return this;
	}

	/**
	 * @description unbind texture
	 * @returns Texture
	 */
	unbind() {
		this._gl.bindTexture(TEXTURE_2D, null);
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

		this._gl.texImage2D(TEXTURE_2D, 0, this._internalFormt, this._format, this._type, image);

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

	/**
	 * @description flip the texture
	 */
	setFlip() {
		this.setPixelStore(UNPACK_FLIP_Y_WEBGL, true);
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
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, filter);

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
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, filter);

		return this;
	}

	/**
	 * @description set the wrap mode in texture
	 */
	wrap(wrap = CLAMP_TO_EDGE) {
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, wrap);
		this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, wrap);

		return this;
	}

	/**
	 * generate mipmap for texture
	 *
	 * @returns {Texture}
	 */
	generateMipmap() {
		this._gl.generateMipmap(TEXTURE_2D);

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
}

/**
 * Class representing a Framebuffer
 */
class FrameBuffer {
	/**
	 *
	 * @param {webglContext} gl
	 * @param {object} params
	 * @param {GLenum} params.format
	 * @param {GLenum} params.internalFormat
	 * @param {GLenum} params.type
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

		/**
		 * @member {WebGLRenderingContext}
		 */
		this._gl = gl;
		/**
		 * @member {number}
		 */
		this._width = width;
		/**
		 * @member {number}
		 */
		this._height = height;
		/**
		 * @member {texture}
		 */
		this.texture = this._makeTexture(params);
		/**
		 * @member WebGLFramebuffer
		 */
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

	/**
	 * @description make depth buffer for framebuffer
	 *
	 * @returns {FrameBuffer}
	 */
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

	/**
	 * @description bind framebuffer
	 *
	 * @returns {FrameBuffer}
	 */
	bind() {
		this._gl.bindFramebuffer(FRAMEBUFFER, this._frameBuffer);

		return this;
	}

	/**
	 * @description update view point for framebuffer
	 *
	 * @returns {FrameBuffer}
	 */
	updateViewport() {
		this._gl.viewport(0, 0, this._width, this._height);

		return this;
	}

	/**
	 * @description unbind framebuffer, make framebuffer null
	 *
	 * @returns FrameBuffer
	 */
	unbind() {
		this._gl.bindFramebuffer(FRAMEBUFFER, null);
		return this;
	}

	/**
	 * @description update size of framebuffer and texture
	 *
	 * @param {number} width
	 * @param {number} height
	 *
	 * @returns FrameBuffer
	 */
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

	/**
	 *
	 * @private
	 *
	 * @param {Object} params
	 * @param {*} params.dataArray
	 *
	 * @returns Texture
	 */
	_makeTexture(params) {
		let texture = new Texture(this._gl, params.internalFormat, params.format, params.type);
		texture
			.bind()
			.setFilter(NEAREST) //https://evanw.github.io/lightgl.js/docs/texture.html
			.wrap(CLAMP_TO_EDGE)
			.fromData(this._width, this._height, params.dataArray);

		return texture;
	}

	/**
	 * @description reset texture
	 */
	reset() {
		this.texture.bind().fromSize(this._width, this._height);
	}

	/**
	 * @description delete texture
	 */
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
	/**
	 * @param {WebGLRenderingContext} gl
	 */
	constructor(gl) {
		this._gl = gl;
		this._vao = gl.createVertexArray();

		this._arrayBuffers = {};
	}
	bind() {
		this._gl.bindVertexArray(this._vao);

		return this;
	}
	unbind() {
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

console.log('[tubugl] version: 1.4.0, %o', 'https://github.com/kenjiSpecial/tubugl');

export { Program, Program2, ArrayBuffer, IndexArrayBuffer, Texture, FrameBuffer, TransformFeedback, VAO, draw, webGLShader };
