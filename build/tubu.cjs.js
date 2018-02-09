'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tubuglConstants = require('tubugl-constants');

/**
 * compile shader based on three.js
 */

function addLineNumbers(string) {
	var lines = string.split('\n');

	for (var i = 0; i < lines.length; i++) {
		lines[i] = i + 1 + ': ' + lines[i];
	}

	return lines.join('\n');
}

function webGLShader(gl, type, shaderSource) {
	var shader = gl.createShader(type);

	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	} else {
		console.error("[WebGLShader]: Shader couldn't compile.");

		if (gl.getShaderInfoLog(shader) !== '') {
			console.warn('[WebGLShader]: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog(shader), addLineNumbers(shaderSource));

			return null;
		}
	}
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Program = function () {
	/**
  *
  * @param gl
  * @param vertSrc
  * @param fragSrc
  * @param params
  */
	function Program(gl, vertSrc, fragSrc) {
		var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		classCallCheck(this, Program);

		this._isReady = false;
		this._isDebgu = params.isDebug;

		this._gl = gl;

		this._initProgram(vertSrc, fragSrc, params);
		this._setProperties();
	}

	createClass(Program, [{
		key: '_initProgram',
		value: function _initProgram(vertSrc, fragSrc, params) {
			this._vertexShader = webGLShader(this._gl, tubuglConstants.VERTEX_SHADER, vertSrc);
			this._fragmentShader = webGLShader(this._gl, tubuglConstants.FRAGMENT_SHADER, fragSrc);
			this._program = this._gl.createProgram();
			this._gl.attachShader(this._program, this._vertexShader);
			this._gl.attachShader(this._program, this._fragmentShader);
			this._gl.linkProgram(this._program);

			try {
				var success = this._gl.getProgramParameter(this._program, tubuglConstants.LINK_STATUS);
				if (!success) throw this._gl.getProgramInfoLog(this._program);
			} catch (error) {
				console.error('WebGLProgram: ' + error);
			}
		}

		/**
   * set properties such as uniforms and attributes
   * @private
   */

	}, {
		key: '_setProperties',
		value: function _setProperties() {
			var ii = void 0;

			// uniforms
			var uniformNumber = this._gl.getProgramParameter(this._program, tubuglConstants.ACTIVE_UNIFORMS);

			this._uniform = {};
			for (ii = 0; ii < uniformNumber; ii++) {
				var uniform = this._gl.getActiveUniform(this._program, ii);
				var uLocation = this._gl.getUniformLocation(this._program, uniform.name);

				var typeName = void 0;
				/**
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
     * */
				switch (uniform.type) {
					case tubuglConstants.FLOAT:
						typeName = 'float';
						break;
					case tubuglConstants.FLOAT_VEC2:
						typeName = 'vec2';
						break;
					case tubuglConstants.FLOAT_VEC3:
						typeName = 'vec3';
						break;
					case tubuglConstants.FLOAT_VEC4:
						typeName = 'vec4';
						break;
					case tubuglConstants.FLOAT_MAT2:
						typeName = 'mat2';
						break;
					case tubuglConstants.FLOAT_MAT3:
						typeName = 'mat3';
						break;
					case tubuglConstants.FLOAT_MAT4:
						typeName = 'mat4';
						break;
					case tubuglConstants.SAMPLER_2D:
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
			var attributreNumber = this._gl.getProgramParameter(this._program, tubuglConstants.ACTIVE_ATTRIBUTES);
			this._attrib = {};
			for (ii = 0; ii < attributreNumber; ii++) {
				var attrib = this._gl.getActiveAttrib(this._program, ii);
				this._attrib[attrib.name] = {
					location: this._gl.getAttribLocation(this._program, attrib.name),
					type: attrib.type,
					size: attrib.size
				};
			}

			return this;
		}
	}, {
		key: 'use',
		value: function use() {
			return this.bind();
		}
	}, {
		key: 'bind',
		value: function bind() {
			this._gl.useProgram(this._program);
			return this;
		}
	}, {
		key: 'getAttrib',
		value: function getAttrib(name) {
			return this._attrib[name];
		}
	}, {
		key: 'getUniforms',
		value: function getUniforms(name) {
			return this._uniform[name];
		}
		/**
   * set texture as uniform
   * @param {Texture} texture
   * @param {String} uniformName
   */

	}, {
		key: 'setUniformTexture',
		value: function setUniformTexture(texture, uniformName) {
			var textureNum = texture.textureNum;

			var uniform = this.getUniforms(uniformName);
			// console.log(textureNum);
			this._gl.uniform1i(uniform.location, textureNum);
		}
	}, {
		key: 'dispose',
		value: function dispose() {
			if (this._gl === null) return;

			this._gl.deleteProgram(this._program);
			this._gl.deleteShader(this._vertexShader);
			this._gl.deleteShader(this._fragmentShader);
			this._gl = null;
		}
	}]);
	return Program;
}();

function detectorWebGL2() {
	var c = document.createElement('canvas');
	try {
		return !!window.WebGL2RenderingContext && !!c.getContext('webgl');
	} catch (e) {
		return null;
	}
}

/**
 * Program2 support Vertex Buffer Object(VBO)
 */
var Program2 = function (_Program) {
	inherits(Program2, _Program);

	function Program2(gl, vertSrc, fragSrc) {
		var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		classCallCheck(this, Program2);

		if (!detectorWebGL2()) {
			console.error('gl is not webgl2. make sure your webgl context is webgl2, or use the brose which support webgl2.');
		}

		return possibleConstructorReturn(this, (Program2.__proto__ || Object.getPrototypeOf(Program2)).call(this, gl, vertSrc, fragSrc, params));
	}

	createClass(Program2, [{
		key: '_initProgram',
		value: function _initProgram(vertSrc, fragSrc) {
			var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			this._vertexShader = webGLShader(this._gl, tubuglConstants.VERTEX_SHADER, vertSrc);
			this._fragmentShader = webGLShader(this._gl, tubuglConstants.FRAGMENT_SHADER, fragSrc);
			this._program = this._gl.createProgram();
			this._gl.attachShader(this._program, this._vertexShader);
			this._gl.attachShader(this._program, this._fragmentShader);

			if (params.transformFeedback && Array.isArray(params.transformFeedback)) {
				this._transformFeedback = params.transformFeedback;
				this._gl.transformFeedbackVaryings(this._program, this._transformFeedback, tubuglConstants.SEPARATE_ATTRIBS);
			}

			this._gl.linkProgram(this._program);

			try {
				var success = this._gl.getProgramParameter(this._program, tubuglConstants.LINK_STATUS);
				if (!success) throw this._gl.getProgramInfoLog(this._program);
			} catch (error) {
				console.error('WebGLProgram: ' + error);
			}
		}
	}]);
	return Program2;
}(Program);

var ArrayBuffer = function () {
	function ArrayBuffer(gl, data) {
		var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		classCallCheck(this, ArrayBuffer);

		this.gl = gl;
		this.buffer = this.gl.createBuffer();
		this.attribs = [];

		try {
			var success = data instanceof Float32Array || data instanceof Float64Array;
			if (success) {
				this.bind();
				this.setData(data, params.usage);
				this.unbind();
			} else throw 'data should be  Float32Array or Flaot64Array';
		} catch (error) {
			console.error(error);
		}
	}

	createClass(ArrayBuffer, [{
		key: 'bind',
		value: function bind() {
			this.gl.bindBuffer(tubuglConstants.ARRAY_BUFFER, this.buffer);

			return this;
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			this.gl.bindBuffer(tubuglConstants.ARRAY_BUFFER, null);

			return this;
		}
	}, {
		key: 'setData',
		value: function setData(array) {
			var usage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : tubuglConstants.STATIC_DRAW;

			this.dataArray = array;

			this.gl.bufferData(tubuglConstants.ARRAY_BUFFER, array, usage);

			return this;
		}
	}, {
		key: 'setAttribs',
		value: function setAttribs(name, size) {
			var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : tubuglConstants.FLOAT;
			var normalize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
			var stride = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
			var offset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

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

	}, {
		key: 'attribPointer',
		value: function attribPointer(program) {
			var _this = this;

			this.attribs.forEach(function (attrib) {
				var programAttr = program.getAttrib(attrib.name); // cached location from program
				if (!programAttr) {
					// console.warn(`attribute ${attrib.name} is not used`);
				} else {
					var location = programAttr.location;
					var size = attrib.size,
					    type = attrib.type,
					    normalize = attrib.normalize,
					    stride = attrib.stride,
					    offset = attrib.offset;


					_this.gl.enableVertexAttribArray(location);
					_this.gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
				}
			});

			return this;
		}
	}, {
		key: 'disablePoiner',
		value: function disablePoiner(program) {
			var _this2 = this;

			this.attribs.forEach(function (attrib) {
				var location = program.getAttrib(attrib.name).location;
				_this2.gl.disableVertexAttribArray(location);
			});

			return this;
		}
	}]);
	return ArrayBuffer;
}();

var IndexArrayBuffer = function () {
	function IndexArrayBuffer(gl, data) {
		classCallCheck(this, IndexArrayBuffer);

		this.gl = gl;
		this.buffer = this.gl.createBuffer();

		try {
			var sucess = data instanceof Uint16Array || data instanceof Uint32Array;
			if (sucess) this.setData(data);else throw 'data should be Uint16Array or Uint32Array';
		} catch (error) {
			console.error(error);
		}
	}

	createClass(IndexArrayBuffer, [{
		key: 'setData',
		value: function setData(data) {
			this.dataArray = data;

			this.bind();
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
			return this;
		}
	}, {
		key: 'bind',
		value: function bind() {
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
			return this;
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
			return this;
		}
	}]);
	return IndexArrayBuffer;
}();

var textureNum = 0;

var Texture = function () {
	function Texture(gl) {
		var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : tubuglConstants.RGB;
		var internalFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : tubuglConstants.RGB;
		var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : tubuglConstants.UNSIGNED_BYTE;
		classCallCheck(this, Texture);

		this._gl = gl;
		if (!this._gl) {
			console.error('[Texture]gl is missed');
			return;
		}

		this._texture = this._gl.createTexture();
		this.textureNum = textureNum;
		this.unit = tubuglConstants.TEXTURE0 + textureNum;

		this.setFormat(format, internalFormat, type);

		textureNum++;

		return this;
	}

	createClass(Texture, [{
		key: 'activeTexture',
		value: function activeTexture() {
			this._gl.activeTexture(this.unit);
			return this;
		}
	}, {
		key: 'bind',
		value: function bind() {
			this._gl.bindTexture(tubuglConstants.TEXTURE_2D, this._texture);
			return this;
		}
	}, {
		key: 'fromImage',
		value: function fromImage(image, width, height) {
			this._width = width ? width : image.width;
			this._height = height ? height : image.height;

			this._gl.texImage2D(tubuglConstants.TEXTURE_2D, 0, this._internalFormt, this._format, this._type, image);

			return this;
		}
	}, {
		key: 'fromSize',
		value: function fromSize(width, height) {
			if (width) this._width = width;
			if (height) this._height = height;

			this._gl.texImage2D(tubuglConstants.TEXTURE_2D, 0, this._internalFormt, this._width, this._height, 0, this._format, this._type, null);

			return this;
		}
	}, {
		key: 'fromData',
		value: function fromData(width, height, dataArray) {
			if (width) this._width = width;
			if (height) this._height = height;

			this._gl.texImage2D(tubuglConstants.TEXTURE_2D, 0, this._internalFormt, this._width, this._height, 0, this._format, this._type, dataArray);
			return this;
		}
	}, {
		key: 'setFlip',
		value: function setFlip() {
			this.setPixelStore(tubuglConstants.UNPACK_FLIP_Y_WEBGL, true);
			return this;
		}
	}, {
		key: 'setPixelStore',
		value: function setPixelStore(pname, params) {
			this._gl.pixelStorei(pname, params);
			return this;
		}
	}, {
		key: 'setFormat',
		value: function setFormat(format, internalFormat, type) {
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

	}, {
		key: 'isActiveTexture',
		value: function isActiveTexture(unit) {
			return unit === this.unit;
		}

		/**
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter
   * https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
   *
   * @param filter
   */

	}, {
		key: 'setFilter',
		value: function setFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tubuglConstants.LINEAR;

			this.setMinFilter(filter);
			this.setMagFilter(filter);

			return this;
		}
	}, {
		key: 'setMagFilter',
		value: function setMagFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tubuglConstants.LINEAR;

			this._gl.texParameteri(tubuglConstants.TEXTURE_2D, tubuglConstants.TEXTURE_MIN_FILTER, filter);

			return this;
		}
	}, {
		key: 'setMinFilter',
		value: function setMinFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tubuglConstants.NEAREST;

			this._gl.texParameteri(tubuglConstants.TEXTURE_2D, tubuglConstants.TEXTURE_MAG_FILTER, filter);

			return this;
		}
	}, {
		key: 'wrap',
		value: function wrap() {
			var _wrap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tubuglConstants.CLAMP_TO_EDGE;

			this._gl.texParameteri(tubuglConstants.TEXTURE_2D, tubuglConstants.TEXTURE_WRAP_S, _wrap);
			this._gl.texParameteri(tubuglConstants.TEXTURE_2D, tubuglConstants.TEXTURE_WRAP_T, _wrap);

			return this;
		}
	}, {
		key: 'generateMipmap',
		value: function generateMipmap() {
			this._gl.generateMipmap(tubuglConstants.TEXTURE_2D);

			return this;
		}
		/**
   * return webglTexture
   */

	}, {
		key: 'getTexture',
		value: function getTexture() {
			return this._texture;
		}
	}, {
		key: 'delete',
		value: function _delete() {
			this._gl.deleteTexture(this._texture);
			this._texture = null;
		}
	}]);
	return Texture;
}();

var FrameBuffer = function () {
    /**
     *
     * @param {webglContext} gl
     * @param {{internalFormat: GLenum, format, GLenum, type: GLenum }} params
     * @param {number} width
     * @param {number} height
     */
    function FrameBuffer(gl, params) {
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 256;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 256;
        classCallCheck(this, FrameBuffer);

        if (typeof params == 'number') {
            console.error('Framebuffer api has been updated. make sure Framebuffer code');
        } else {
            params.internalFormat = params.internalFormat ? params.internalFormat : tubuglConstants.RGBA;
            params.format = params.format ? params.format : tubuglConstants.RGBA;

            params.type = params.type ? params.type : tubuglConstants.UNSIGNED_BYTE;
        }

        this._gl = gl;
        this._width = width;
        this._height = height;

        this.texture = this._makeTexture(params);
        this._frameBuffer = this._gl.createFramebuffer();
        this._gl.bindFramebuffer(tubuglConstants.FRAMEBUFFER, this._frameBuffer);

        this._gl.framebufferTexture2D(tubuglConstants.FRAMEBUFFER, tubuglConstants.COLOR_ATTACHMENT0, tubuglConstants.TEXTURE_2D, this.texture.getTexture(), 0);
    }

    createClass(FrameBuffer, [{
        key: 'makeDepthBUffer',
        value: function makeDepthBUffer() {
            /**
             * https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html
             */
            // create a depth renderbuffer
            var depthBuffer = this._gl.createRenderbuffer();
            this._gl.bindRenderbuffer(tubuglConstants.RENDERBUFFER, depthBuffer);

            // make a depth buffer and the same size as the targetTexture
            this._gl.renderbufferStorage(tubuglConstants.RENDERBUFFER, tubuglConstants.DEPTH_COMPONENT16, this._width, this._height);
            this._gl.framebufferRenderbuffer(tubuglConstants.FRAMEBUFFER, tubuglConstants.DEPTH_ATTACHMENT, tubuglConstants.RENDERBUFFER, depthBuffer);

            return this;
        }
    }, {
        key: 'bind',
        value: function bind() {
            this._gl.bindFramebuffer(tubuglConstants.FRAMEBUFFER, this._frameBuffer);

            return this;
        }
    }, {
        key: 'updateViewport',
        value: function updateViewport() {
            this._gl.viewport(0, 0, this._width, this._height);

            return this;
        }
    }, {
        key: 'unbind',
        value: function unbind() {
            this._gl.bindFramebuffer(tubuglConstants.FRAMEBUFFER, null);
            return this;
        }
    }, {
        key: 'updateSize',
        value: function updateSize(width, height) {
            this._width = width;
            this._height = height;

            this.texture.bind().fromSize(this._width, this._height);

            if (this.depthBuffer) {
                this._gl.bindRenderbuffer(tubuglConstants.RENDERBUFFER, this.depthBuffer);
                this._gl.renderbufferStorage(tubuglConstants.RENDERBUFFER, tubuglConstants.DEPTH_COMPONENT16, this._width, this._height);
            }
        }
    }, {
        key: '_makeTexture',
        value: function _makeTexture(params) {
            var texture = new Texture(this._gl, params.internalFormat, params.format, params.type);
            texture.bind().setFilter(tubuglConstants.NEAREST) //https://evanw.github.io/lightgl.js/docs/texture.html
            .wrap(tubuglConstants.CLAMP_TO_EDGE).fromData(this._width, this._height, params.dataArray);

            return texture;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.texture.bind().fromSize(this._width, this._height);
        }
    }, {
        key: 'delete',
        value: function _delete() {
            this.texture.delete();
        }
    }]);
    return FrameBuffer;
}();

/**
 * only support webgl2
 */

var TransformFeedback = function () {
	function TransformFeedback(gl) {
		classCallCheck(this, TransformFeedback);

		this._gl = gl;
		this._transfromFeedback = gl.createTransformFeedback();
		this._arrayBuffers = [];
	}

	createClass(TransformFeedback, [{
		key: 'bind',
		value: function bind() {
			this._gl.bindTransformFeedback(tubuglConstants.TRANSFORM_FEEDBACK, this._transfromFeedback);

			return this;
		}
	}, {
		key: 'unbindBufferBase',
		value: function unbindBufferBase() {
			var _this = this;

			this._arrayBuffers.forEach(function (arrayBuffers, index) {
				return _this._gl.bindBufferBase(tubuglConstants.TRANSFORM_FEEDBACK_BUFFER, index, null);
			});

			return this;
		}

		/**
   *
   * @param {Program} program
   */

	}, {
		key: 'updateBufferBase',
		value: function updateBufferBase(program) {
			var _this2 = this;

			this._arrayBuffers.forEach(function (arrayBuffers, index) {
				_this2._gl.bindBuffer(tubuglConstants.ARRAY_BUFFER, arrayBuffers.read.buffer);
				_this2._gl.bindBufferBase(tubuglConstants.TRANSFORM_FEEDBACK_BUFFER, index, arrayBuffers.write.buffer);
				arrayBuffers.read.attribPointer(program);
			});
		}
		/**
   *
   * @param {Number} index
   * @param {{read: arrayBuffer, write: arrayBuffer, name: string}} arrayBuffers
   */

	}, {
		key: 'addArrayBufer',
		value: function addArrayBufer(index, arrayBuffers) {
			this._arrayBuffers[index] = arrayBuffers;
		}
	}, {
		key: 'swapArrayBuffers',
		value: function swapArrayBuffers() {
			this._arrayBuffers.forEach(function (arrayBuffers) {
				var a = arrayBuffers.read;
				arrayBuffers.read = arrayBuffers.write;
				arrayBuffers.write = a;
			});
		}
	}, {
		key: 'update',
		value: function update() {}
	}]);
	return TransformFeedback;
}();

/**
 * VertexArray for only webgl2
 */
var VAO = function () {
	function VAO(gl) {
		classCallCheck(this, VAO);

		this._gl = gl;
		this._vao = gl.createVertexArray();

		this._arrayBuffers = {};
	}

	createClass(VAO, [{
		key: "bind",
		value: function bind() {
			this._gl.bindVertexArray(this._vao);

			return this;
		}
	}, {
		key: "unbind",
		value: function unbind() {
			this._gl.bindVertexArray(null);

			return this;
		}
	}, {
		key: "updateArrayBuffer",
		value: function updateArrayBuffer(program, arrayBuffer, name) {
			this._arrayBuffers[name] = arrayBuffer;
			arrayBuffer.attribPointer(program);

			return this;
		}
	}, {
		key: "updateIndexBuffer",
		value: function updateIndexBuffer(indexArrayBuffer) {
			indexArrayBuffer.bind();
			return;
		}
	}, {
		key: "delete",
		value: function _delete() {
			this._gl.deleteVertexArray(this._vao);

			return this;
		}
	}]);
	return VAO;
}();

/**
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements
 */
var draw = {
	array: function array(gl, cnt) {
		var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : tubuglConstants.TRIANGLES;

		gl.drawArrays(mode, 0, cnt);
	},
	element: function element(gl, cnt) {
		var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : tubuglConstants.TRIANGLES;

		gl.drawElements(mode, cnt, tubuglConstants.UNSIGNED_SHORT, 0);
	},
	elementPoints: function elementPoints(gl, cnt) {
		this.element(gl, cnt, tubuglConstants.POINTS);
	},
	arrayPoint: function arrayPoint(gl, cnt) {
		this.array(gl, cnt, tubuglConstants.POINTS);
	},
	elementTriangles: function elementTriangles(gl, cnt) {
		this.element(gl, cnt, tubuglConstants.POINTS);
	},
	arrayLines: function arrayLines(gl, cnt) {
		this.array(gl, cnt, tubuglConstants.LINES);
	},
	elementLines: function elementLines(gl, cnt) {
		this.element(gl, cnt, tubuglConstants.LINES);
	}
};

var DrawCall = function () {
	function DrawCall() {
		classCallCheck(this, DrawCall);
	}

	createClass(DrawCall, [{
		key: 'draw',
		value: function draw() {}
	}]);
	return DrawCall;
}();

console.log('[tubugl] version: 1.2.0, %o', 'https://github.com/kenjiSpecial/tubugl');

exports.Program = Program;
exports.Program2 = Program2;
exports.ArrayBuffer = ArrayBuffer;
exports.IndexArrayBuffer = IndexArrayBuffer;
exports.Texture = Texture;
exports.FrameBuffer = FrameBuffer;
exports.TransformFeedback = TransformFeedback;
exports.VAO = VAO;
exports.draw = draw;
exports.webGLShader = webGLShader;
