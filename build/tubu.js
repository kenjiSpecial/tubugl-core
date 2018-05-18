(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Tubu = {})));
}(this, (function (exports) { 'use strict';

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

var FLOAT = 0x1406;
var FLOAT_VEC2 = 0x8B50;
var FLOAT_VEC3 = 0x8B51;
var FLOAT_VEC4 = 0x8B52;
var FLOAT_MAT2 = 0x8B5A;
var FLOAT_MAT3 = 0x8B5B;
var FLOAT_MAT4 = 0x8B5C;
var SAMPLER_2D = 0x8B5E;

/**
 * Class representing a Uniform for a Program class
 */
var Uniform = function () {
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
    function Uniform(gl, program, uniform, context) {
        classCallCheck(this, Uniform);

        var uniformLocation = gl.getUniformLocation(program, uniform.name);
        this.location = uniformLocation;
        this.size = uniform.size;
        this._gl = gl;

        var typeName = void 0;
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
                this.unit = context.texIndex++;
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


    createClass(Uniform, [{
        key: 'update',
        value: function update() {
            // console.log(this.typeName);
            switch (this.type) {
                case FLOAT:
                    this._gl.uniform1f(this.location, arguments.length <= 0 ? undefined : arguments[0]);
                    break;
                case FLOAT_VEC2:
                    this._gl.uniform2f(this.location, arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
                    break;
                case FLOAT_VEC3:
                    this._gl.uniform3f(this.location, arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]);
                    break;
                case FLOAT_VEC4:
                    this._gl.uniform4f(this.location, arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2], arguments.length <= 3 ? undefined : arguments[3]);
                    break;
                case FLOAT_MAT2:
                    this._gl.uniformMatrix2fv(this.location, false, arguments.length <= 0 ? undefined : arguments[0]);
                    break;
                case FLOAT_MAT3:
                    this._gl.uniformMatrix3fv(this.location, false, arguments.length <= 0 ? undefined : arguments[0]);
                    break;
                case FLOAT_MAT4:
                    this._gl.uniformMatrix4fv(this.location, false, arguments.length <= 0 ? undefined : arguments[0]);
                    break;
                case SAMPLER_2D:
                    this._gl.uniform1i(this.location, arguments.length <= 0 ? undefined : arguments[0]);
                    break;
            }
        }
    }]);
    return Uniform;
}();

var Program = function () {
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
  function Program(gl, vertSrc, fragSrc) {
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    classCallCheck(this, Program);

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


  createClass(Program, [{
    key: 'initProgram',
    value: function initProgram(vertSrc, fragSrc) {
      /**
       * @description vertexShader
       * @private
       * @member {WebGLShader}
       */
      this._vertexShader = webGLShader(this._gl, this._gl.VERTEX_SHADER, vertSrc);
      /**
       * @description fragmentShader
       * @private
       * @member {WebGLShader}
       */
      this._fragmentShader = webGLShader(this._gl, this._gl.FRAGMENT_SHADER, fragSrc);
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
        var success = this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS);
        if (!success) throw this._gl.getProgramInfoLog(this._program);
      } catch (error) {
        console.error('WebGLProgram: ' + error);
      }

      this._setProperties();
    }

    /**
     * set properties such as uniforms and attributes
     * @private
     */

  }, {
    key: '_setProperties',
    value: function _setProperties() {
      var ii = void 0;
      var context = { texIndex: 0 };

      // ============
      //   uniforms
      // ============

      var uniformNumber = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_UNIFORMS);

      /**
       * @member {object}
       */
      this.uniform = {};
      for (ii = 0; ii < uniformNumber; ii++) {
        var uniformInfo = this._gl.getActiveUniform(this._program, ii);
        this.uniform[uniformInfo.name] = new Uniform(this._gl, this._program, uniformInfo, context);
      }

      // ============
      //  attributes
      // ============

      var attributreNumber = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_ATTRIBUTES);
      /**
       * @member {object}
       */
      this.attrib = {};
      for (ii = 0; ii < attributreNumber; ii++) {
        var attrib = this._gl.getActiveAttrib(this._program, ii);
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

  }, {
    key: 'use',
    value: function use() {
      return this.bind();
    }

    /**
     * use program, as same function as use()
     */

  }, {
    key: 'bind',
    value: function bind() {
      this._gl.useProgram(this._program);
      return this;
    }

    /**
     * get the value of the attribute of program(it will be remove)
     *
     * @param {string} name name of attributes
     */

  }, {
    key: 'getAttrib',
    value: function getAttrib(name) {
      return this.attrib[name];
    }

    /**
     * get the value of uniform of program(it will be removed)
     * @param {string} name name of uniforms
     */

  }, {
    key: 'getUniforms',
    value: function getUniforms(name) {
      return this.uniform[name];
    }
    /**
     * set texture as uniform
     * @param {Texture} texture
     * @param {String} uniformName
     */

  }, {
    key: 'setUniformTexture',
    value: function setUniformTexture(texture, uniformName) {
      var unit = this.uniform[uniformName].unit;
      texture.activeTexture(unit).bind();
      this.uniform[uniformName].update(unit);
    }

    /**
     * dispose program
     */

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
				var success = this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS);
				if (!success) throw this._gl.getProgramInfoLog(this._program);
			} catch (error) {
				console.error('WebGLProgram: ' + error);
			}
		}
	}]);
	return Program2;
}(Program);

var FLOAT$1 = 0x1406;
var STATIC_DRAW = 0x88E4;

var ArrayBuffer = function () {
	/**
  *
  * @param {WebGLRenderingContext} gl
  * @param {Float32Array|Flaot64Array} data
  * @param {Object} params
  * @param {*} params.usage
  *
  * @constructor ArrayBuffer
  */
	function ArrayBuffer(gl, data) {
		var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		classCallCheck(this, ArrayBuffer);

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

	/**
  * @description bind the array buffer
  *
  * @returns {ArrayBuffer}
  */


	createClass(ArrayBuffer, [{
		key: 'bind',
		value: function bind() {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

			return this;
		}

		/**
   * @description unbind the array buffer
   *
   * @returns {ArrayBuffer}
   *
   */

	}, {
		key: 'unbind',
		value: function unbind() {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

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

	}, {
		key: 'setData',
		value: function setData(array) {
			var usage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;

			/**
    * @member {Float32Array|Float64Array}
    */
			this.dataArray = array;

			this.gl.bufferData(this.gl.ARRAY_BUFFER, array, usage);

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

	}, {
		key: 'setAttribs',
		value: function setAttribs(name, size) {
			var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FLOAT$1;
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
   * enable attribute  program
   *
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

		/**
   * disable the vertex attribute
   *
   * @param {Program} program
   *
   * @returns {ArrayBuffer}
   */

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
	/**
  *
  * @param {WebGLRenderingContext} gl
  * @param {Uint16Array | Uint32Array} data
  *
  * @constructor IndexArrayBuffer
  */
	function IndexArrayBuffer(gl, data) {
		classCallCheck(this, IndexArrayBuffer);

		/**
   * @member {WebGLRenderingContext}
   */
		this._gl = gl;
		/**
   * @member {WebGLBuffer}
   */
		this.buffer = this._gl.createBuffer();

		try {
			var sucess = data instanceof Uint16Array || data instanceof Uint32Array;
			if (sucess) this.setData(data);else throw 'data should be Uint16Array or Uint32Array';
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


	createClass(IndexArrayBuffer, [{
		key: 'setData',
		value: function setData(data) {
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

	}, {
		key: 'bind',
		value: function bind() {
			this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.buffer);
			return this;
		}
		/**
   * unbind the indexArrayBuffer
   *
   * @returns {IndexArrayBuffer}
   */

	}, {
		key: 'unbind',
		value: function unbind() {
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
			return this;
		}
	}]);
	return IndexArrayBuffer;
}();

var RGB = 0x1907;
var UNSIGNED_BYTE = 0x1401;
var LINEAR = 0x2601;
var CLAMP_TO_EDGE = 0x812F;
var NEAREST = 0x2600;

/**
 * Class representing a Texture
 */

var Texture = function () {
	/**
  *
  * @param {WebGLRenderingContext} gl
  * @param {GLenum} format
  * @param {GLenum} internalFormat
  * @param {GLenum} type
  */
	function Texture(gl) {
		var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : RGB;
		var internalFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : RGB;
		var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : UNSIGNED_BYTE;
		classCallCheck(this, Texture);

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


	createClass(Texture, [{
		key: 'activeTexture',
		value: function activeTexture() {
			var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			this._gl.activeTexture(this._gl.TEXTURE0 + (0 | unit));
			return this;
		}

		/**
   * @description bind texture
   *
   * @returns {Texture}
   */

	}, {
		key: 'bind',
		value: function bind() {
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
			return this;
		}

		/**
   * @description unbind texture
   * @returns Texture
   */

	}, {
		key: 'unbind',
		value: function unbind() {
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

	}, {
		key: 'fromImage',
		value: function fromImage(image, width, height) {
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

	}, {
		key: 'fromSize',
		value: function fromSize(width, height) {
			if (width) this._width = width;
			if (height) this._height = height;

			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._internalFormt, this._width, this._height, 0, this._format, this._type, null);

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

	}, {
		key: 'fromData',
		value: function fromData(width, height, dataArray) {
			if (width) this._width = width;
			if (height) this._height = height;

			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._internalFormt, this._width, this._height, 0, this._format, this._type, dataArray);
			return this;
		}

		/**
   * @description flip the texture
   */

	}, {
		key: 'setFlip',
		value: function setFlip() {
			this.setPixelStore(this._gl.UNPACK_FLIP_Y_WEBGL, true);
			return this;
		}

		/**
   * @description specify the pixel storage mode
   *
   * @param {GLenum} pname
   * @param {object} params
   */

	}, {
		key: 'setPixelStore',
		value: function setPixelStore(pname, params) {
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

	}, {
		key: 'setFormat',
		value: function setFormat(format, internalFormat, type) {
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
   * @param {GLenum} filter
   *
   * @returns {Texture}
   */

	}, {
		key: 'setFilter',
		value: function setFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LINEAR;

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

	}, {
		key: 'setMagFilter',
		value: function setMagFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LINEAR;

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

	}, {
		key: 'setMinFilter',
		value: function setMinFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NEAREST;

			this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, filter);

			return this;
		}

		/**
   * @description set the wrap mode in texture
   */

	}, {
		key: 'wrap',
		value: function wrap() {
			var _wrap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CLAMP_TO_EDGE;

			this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, _wrap);
			this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, _wrap);

			return this;
		}

		/**
   * generate mipmap for texture
   *
   * @returns {Texture}
   */

	}, {
		key: 'generateMipmap',
		value: function generateMipmap() {
			this._gl.generateMipmap(this._gl.TEXTURE_2D);

			return this;
		}

		/**
   * @description get webgl texture
   * @returns {Texture}
   */

	}, {
		key: 'getTexture',
		value: function getTexture() {
			return this._texture;
		}

		/** @description delete the texture */

	}, {
		key: 'delete',
		value: function _delete() {
			this._gl.deleteTexture(this._texture);
			this._texture = null;
		}
	}]);
	return Texture;
}();

/**
 * Class representing a Framebuffer
 */
var FrameBuffer = function () {
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
	function FrameBuffer(gl, params) {
		var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 256;
		var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 256;
		classCallCheck(this, FrameBuffer);

		if (typeof params == 'number') {
			console.error('Framebuffer api has been updated. make sure Framebuffer code');
		} else {
			params.internalFormat = params.internalFormat ? params.internalFormat : gl.RGBA;
			params.format = params.format ? params.format : gl.RGBA;

			params.type = params.type ? params.type : gl.UNSIGNED_BYTE;
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
   * @member {GLenum}
   */
		this._type = params.type;
		/**
   * @member {GLenum}
   */
		this._internalFormat = params.internalFormat;
		/**
   * @member {GLenum}
   */
		this._format = params.format;

		/**
   * @member {GLenum}
   */
		this._filter = params.filter ? params.filter : this._gl.NEAREST;

		/**
   * @member {texture}
   */
		this.texture = this._makeTexture(params);
		/**
   * @member WebGLFramebuffer
   */
		this._frameBuffer = this._gl.createFramebuffer();
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);

		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this.texture.getTexture(), 0);
	}

	/**
  * @description make depth buffer for framebuffer
  *
  * @returns {FrameBuffer}
  */


	createClass(FrameBuffer, [{
		key: 'makeDepthBUffer',
		value: function makeDepthBUffer() {
			/**
    * https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html
    */
			// create a depth renderbuffer
			var depthBuffer = this._gl.createRenderbuffer();
			this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, depthBuffer);

			// make a depth buffer and the same size as the targetTexture
			this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);
			this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, depthBuffer);

			return this;
		}

		/**
   * @description update texture and return old texture
   *
   * @returns {texture}
   */

	}, {
		key: 'updateTexture',
		value: function updateTexture() {
			var prevTexture = this.texture;
			var texture = this._makeTexture();

			this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);

			this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, texture.getTexture(), 0);

			return prevTexture;
		}

		/**
   * @description bind framebuffer
   *
   * @returns {FrameBuffer}
   */

	}, {
		key: 'bind',
		value: function bind() {
			this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);

			return this;
		}

		/**
   * @description update view point for framebuffer
   *
   * @returns {FrameBuffer}
   */

	}, {
		key: 'updateViewport',
		value: function updateViewport() {
			this._gl.viewport(0, 0, this._width, this._height);

			return this;
		}

		/**
   * @description unbind framebuffer, make framebuffer null
   *
   * @returns FrameBuffer
   */

	}, {
		key: 'unbind',
		value: function unbind() {
			this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
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

	}, {
		key: 'updateSize',
		value: function updateSize(width, height) {
			this._width = width;
			this._height = height;

			this.texture.bind().fromSize(this._width, this._height);

			if (this.depthBuffer) {
				this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this.depthBuffer);
				this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);
			}
		}

		/**
   *
   * @private
   *
   * @param {Object} params
   * @param {Float32Array | Float64Array} params.dataArray
   *
   * @returns Texture
   */

	}, {
		key: '_makeTexture',
		value: function _makeTexture(params) {
			var texture = new Texture(this._gl, this._internalFormat, this._format, this._type);

			texture.bind().setFilter(this._filter) //https://evanw.github.io/lightgl.js/docs/texture.html
			.wrap(this._gl.CLAMP_TO_EDGE);
			if (params && params.dataArray) texture.fromData(this._width, this._height, params.dataArray);else texture.fromSize(this._width, this._height);

			return texture;
		}

		/**
   * @description reset texture
   */

	}, {
		key: 'reset',
		value: function reset() {
			this.texture.bind().fromSize(this._width, this._height);
		}

		/**
   * @description delete texture
   */

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
		key: "bind",
		value: function bind() {
			this._gl.bindTransformFeedback(this._gl.TRANSFORM_FEEDBACK, this._transfromFeedback);

			return this;
		}
	}, {
		key: "unbindBufferBase",
		value: function unbindBufferBase() {
			var _this = this;

			this._arrayBuffers.forEach(function (arrayBuffers, index) {
				return _this._gl.bindBufferBase(_this._gl.TRANSFORM_FEEDBACK_BUFFER, index, null);
			});

			return this;
		}

		/**
   *
   * @param {Program} program
   */

	}, {
		key: "updateBufferBase",
		value: function updateBufferBase(program) {
			var _this2 = this;

			this._arrayBuffers.forEach(function (arrayBuffers, index) {
				_this2._gl.bindBuffer(_this2._gl.ARRAY_BUFFER, arrayBuffers.read.buffer);
				_this2._gl.bindBufferBase(_this2._gl.TRANSFORM_FEEDBACK_BUFFER, index, arrayBuffers.write.buffer);
				arrayBuffers.read.attribPointer(program);
			});
		}
		/**
   *
   * @param {Number} index
   * @param {{read: arrayBuffer, write: arrayBuffer, name: string}} arrayBuffers
   */

	}, {
		key: "addArrayBufer",
		value: function addArrayBufer(index, arrayBuffers) {
			this._arrayBuffers[index] = arrayBuffers;
		}
	}, {
		key: "swapArrayBuffers",
		value: function swapArrayBuffers() {
			this._arrayBuffers.forEach(function (arrayBuffers) {
				var a = arrayBuffers.read;
				arrayBuffers.read = arrayBuffers.write;
				arrayBuffers.write = a;
			});
		}
	}, {
		key: "update",
		value: function update() {}
	}]);
	return TransformFeedback;
}();

/**
 * VertexArray for only webgl2
 */
var VAO = function () {
	/**
  * @param {WebGLRenderingContext} gl
  */
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
		var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gl.TRIANGLES;

		gl.drawArrays(mode, 0, cnt);
	},
	element: function element(gl, cnt) {
		var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gl.TRIANGLES;

		gl.drawElements(mode, cnt, gl.UNSIGNED_SHORT, 0);
	},
	elementPoints: function elementPoints(gl, cnt) {
		this.element(gl, cnt, gl.POINTS);
	},
	arrayPoint: function arrayPoint(gl, cnt) {
		this.array(gl, cnt, gl.POINTS);
	},
	elementTriangles: function elementTriangles(gl, cnt) {
		this.element(gl, cnt, gl.POINTS);
	},
	arrayLines: function arrayLines(gl, cnt) {
		this.array(gl, cnt, gl.LINES);
	},
	elementLines: function elementLines(gl, cnt) {
		this.element(gl, cnt, gl.LINES);
	}
};

console.log('[tubugl] version: 1.5.0, %o', 'https://github.com/kenjiSpecial/tubugl');

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

Object.defineProperty(exports, '__esModule', { value: true });

})));
