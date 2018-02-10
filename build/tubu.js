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

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
 *
 */

// Standard WebGL 1 constants

// Clearing buffers

 //Passed to clear to clear the current depth buffer.
 //Passed to clear to clear the current stencil buffer.
 //Passed to clear to clear the current color buffer.


// Rendering primitives

var POINTS = 0x0000; // Passed to drawElements or drawArrays to draw single points.
var LINES = 0x0001; // Passed to drawElements or drawArrays to draw lines. Each vertex connects to the one after it.
 // Passed to drawElements or drawArrays to draw lines. Each set of two vertices is treated as a separate line segment.
 // Passed to drawElements or drawArrays to draw a connected group of line segments from the first vertex to the last.
var TRIANGLES = 0x0004; // Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle.
 // Passed to drawElements or drawArrays to draw a connected group of triangles.
 // Passed to drawElements or drawArrays to draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan.


// Blending modes

 //Passed to blendFunc or blendFuncSeparate to turn off a component.
 // Passed to blendFunc or blendFuncSeparate to turn on a component.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by the source elements color.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source elements color.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by the source's alpha.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source's alpha.
 // Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's alpha.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's alpha.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's color.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's color.
 //Passed to blendFunc or blendFuncSeparate to multiply a component by the minimum of source's alpha or one minus the destination's alpha.
 //Passed to blendFunc or blendFuncSeparate to specify a constant color blend function.
 //Passed to blendFunc or blendFuncSeparate to specify one minus a constant color blend function.
 //Passed to blendFunc or blendFuncSeparate to specify a constant alpha blend function.
 //Passed to blendFunc or blendFuncSeparate to specify one minus a constant alpha blend function.


// Blending equations

 //Passed to blendEquation or blendEquationSeparate to set an addition blend function.
 //Passed to blendEquation or blendEquationSeparate to specify a subtraction blend function (source - destination).
 //Passed to blendEquation or blendEquationSeparate to specify a reverse subtraction blend function (destination - source).


// Getting GL parameter information

 //Passed to getParameter to get the current RGB blend function.
 //Passed to getParameter to get the current RGB blend function. Same as BLEND_EQUATION
 //Passed to getParameter to get the current alpha blend function. Same as BLEND_EQUATION
 //Passed to getParameter to get the current destination RGB blend function.
 //Passed to getParameter to get the current destination RGB blend function.
 //Passed to getParameter to get the current destination alpha blend function.
 //Passed to getParameter to get the current source alpha blend function.
 //Passed to getParameter to return a the current blend color.
 //Passed to getParameter to get the array buffer binding.
 //Passed to getParameter to get the current element array buffer.
 //Passed to getParameter to get the current lineWidth (set by the lineWidth method).
 //Passed to getParameter to get the current size of a point drawn with gl.POINTS
 //Passed to getParameter to get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1.
 //Passed to getParameter to get the current value of cullFace. Should return FRONT, BACK, or FRONT_AND_BACK
 //Passed to getParameter to determine the current value of frontFace. Should return CW or CCW.
 //Passed to getParameter to return a length-2 array of floats giving the current depth range.
 //Passed to getParameter to determine if the depth write mask is enabled.
 //Passed to getParameter to determine the current depth clear value.
 //Passed to getParameter to get the current depth function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
 //Passed to getParameter to get the value the stencil will be cleared to.
 //Passed to getParameter to get the current stencil function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
 //Passed to getParameter to get the current stencil fail function. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
 //Passed to getParameter to get the current stencil fail function should the depth buffer test fail. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
 //Passed to getParameter to get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
 //Passed to getParameter to get the reference value used for stencil tests.









 //Returns an Int32Array with four elements for the current viewport dimensions.
 //Returns an Int32Array with four elements for the current scissor box dimensions.
 //



























// Buffers

var STATIC_DRAW = 0x88E4; //Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often.
 //Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often.
 //Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often.
var ARRAY_BUFFER = 0x8892; //Passed to bindBuffer or bufferData to specify the type of buffer being used.
 //Passed to bindBuffer or bufferData to specify the type of buffer being used.
 //Passed to getBufferParameter to get a buffer's size.
 //Passed to getBufferParameter to get the hint for the buffer passed in when it was created.


// Vertex attributes

 //Passed to getVertexAttrib to read back the current vertex attribute.








// Culling

 //Passed to enable/disable to turn on/off culling. Can also be used with getParameter to find the current culling method.
 //Passed to cullFace to specify that only front faces should be drawn.
 //Passed to cullFace to specify that only back faces should be drawn.
 //Passed to cullFace to specify that front and back faces should be drawn.


// Enabling and disabling

 //	Passed to enable/disable to turn on/off blending. Can also be used with getParameter to find the current blending method.
 //Passed to enable/disable to turn on/off the depth test. Can also be used with getParameter to query the depth test.
 //Passed to enable/disable to turn on/off dithering. Can also be used with getParameter to find the current dithering method.
 //Passed to enable/disable to turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with getParameter to query the scissor test.
 //Passed to enable/disable to turn on/off the alpha to coverage. Used in multi-sampling alpha channels.
 //Passed to enable/disable to turn on/off the sample coverage. Used in multi-sampling.
 //Passed to enable/disable to turn on/off the scissor test. Can also be used with getParameter to query the scissor test.
 //Passed to enable/disable to turn on/off the stencil test. Can also be used with getParameter to query the stencil test.


// Errors

 //Returned from getError.
 //Returned from getError.
 //Returned from getError.
 //Returned from getError.
 //Returned from getError.
 //Returned from getError.


// Front face directions

 //Passed to frontFace to specify the front face of a polygon is drawn in the clockwise direction
 //Passed to frontFace to specify the front face of a polygon is drawn in the counter clockwise direction


// Hints

 //There is no preference for this behavior.
 //The most efficient behavior should be used.
 //The most correct or the highest quality option should be used.
 //Hint for the quality of filtering when generating mipmap images with WebGLRenderingContext.generateMipmap().


// Data types


var UNSIGNED_BYTE = 0x1401;

var UNSIGNED_SHORT = 0x1403;


var FLOAT = 0x1406;

// Pixel formats



var RGB = 0x1907;
var RGBA = 0x1908;



// Pixel types

// export const UNSIGNED_BYTE = 0x1401;




// Shaders

var FRAGMENT_SHADER = 0x8B30; //Passed to createShader to define a fragment shader.
var VERTEX_SHADER = 0x8B31; //Passed to createShader to define a vertex shader
 //Passed to getShaderParamter to get the status of the compilation. Returns false if the shader was not compiled. You can then query getShaderInfoLog to find the exact error
 //Passed to getShaderParamter to determine if a shader was deleted via deleteShader. Returns true if it was, false otherwise.
var LINK_STATUS = 0x8B82; //Passed to getProgramParameter after calling linkProgram to determine if a program was linked correctly. Returns false if there were errors. Use getProgramInfoLog to find the exact error.
 //Passed to getProgramParameter after calling validateProgram to determine if it is valid. Returns false if errors were found.
 //Passed to getProgramParameter after calling attachShader to determine if the shader was attached correctly. Returns false if errors occurred.
var ACTIVE_ATTRIBUTES = 0x8B89; //Passed to getProgramParameter to get the number of attributes active in a program.
var ACTIVE_UNIFORMS = 0x8B86; //Passed to getProgramParamter to get the number of uniforms active in a program.
 //The maximum number of entries possible in the vertex attribute list.
 //
 //
 //
 //
 //Implementation dependent number of maximum texture units. At least 8.
 //
 //
 //
 //


// Depth or stencil tests

 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn.
 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value.
 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value.
 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value.
 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value.
 //Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value.


// Stencil actions









// Textures

var NEAREST = 0x2600;
var LINEAR = 0x2601;




var TEXTURE_MAG_FILTER = 0x2800;
var TEXTURE_MIN_FILTER = 0x2801;
var TEXTURE_WRAP_S = 0x2802;
var TEXTURE_WRAP_T = 0x2803;
var TEXTURE_2D = 0x0DE1;










var TEXTURE0 = 0x84C0;
// TEXTURE0 - 31	0x84C0 - 0x84DF	A texture unit.
 //The current active texture unit.

var CLAMP_TO_EDGE = 0x812F;


// Uniform types

var FLOAT_VEC2 = 0x8B50;
var FLOAT_VEC3 = 0x8B51;
var FLOAT_VEC4 = 0x8B52;







var FLOAT_MAT2 = 0x8B5A;
var FLOAT_MAT3 = 0x8B5B;
var FLOAT_MAT4 = 0x8B5C;
var SAMPLER_2D = 0x8B5E;


// Shader precision-specified types








// Framebuffers and renderbuffers

var FRAMEBUFFER = 0x8D40;
var RENDERBUFFER = 0x8D41;



var DEPTH_COMPONENT16 = 0x81A5;


// export const DEPTH_STENCIL = 0x84F9;













var COLOR_ATTACHMENT0 = 0x8CE0;
var DEPTH_ATTACHMENT = 0x8D00;

// export const DEPTH_STENCIL_ATTACHMENT = 0x821A;











// Pixel storage modes

var UNPACK_FLIP_Y_WEBGL = 0x9240;



/**
 * Standard WebGL 2 constants
 */

// Getting GL parameter information





























// extures


































































// Pixel types











// Queries







// Draw buffers

















































// Buffers
// Constant name	Value	Description










// Data types













// Vertex attributes




// Transform feedback










var SEPARATE_ATTRIBS = 0x8C8D;
var TRANSFORM_FEEDBACK_BUFFER = 0x8C8E;

var TRANSFORM_FEEDBACK = 0x8E22;




// Framebuffers and renderbuffers





















// Uniform




























// Sync objects















// Miscellaneous constants



















/**
* Constants defined in WebGL extensions
*/

// ANGLE_instanced_arrays

 //Describes the frequency divisor used for instanced rendering.

// WEBGL_debug_renderer_info

 //Passed to getParameter to get the vendor string of the graphics driver.
 //Passed to getParameter to get the renderer string of the graphics driver.

// EXT_texture_filter_anisotropic

 //Returns the maximum available anisotropy.
 //Passed to texParameter to set the desired maximum anisotropy for a texture.

// WEBGL_compressed_texture_s3tc

 //A DXT1-compressed image in an RGB image format.
 //A DXT1-compressed image in an RGB image format with a simple on/off alpha value.
 //A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression.
 //A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done.

// WEBGL_compressed_texture_etc

 //One-channel (red) unsigned format compression.
 //One-channel (red) signed format compression.
 //Two-channel (red and green) unsigned format compression.
 //Two-channel (red and green) signed format compression.
 //Compresses RBG8 data with no alpha channel.
 //Compresses RGBA8 data. The RGB part is encoded the same as RGB_ETC2, but the alpha part is encoded separately.
 //Compresses sRBG8 data with no alpha channel.
 //Compresses sRGBA8 data. The sRGB part is encoded the same as SRGB_ETC2, but the alpha part is encoded separately.
 //Similar to RGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.
 //Similar to SRGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.

// WEBGL_compressed_texture_pvrtc

 // RGB compression in 4-bit mode. One block for each 4×4 pixels.
 // RGBA compression in 4-bit mode. One block for each 4×4 pixels.
 // RGB compression in 2-bit mode. One block for each 8×4 pixels.
 // RGBA compression in 2-bit mode. One block for each 8×4 pixe

// WEBGL_compressed_texture_etc1

 // Compresses 24-bit RGB data with no alpha channel.

// WEBGL_compressed_texture_atc

 // Compresses RGB textures with no alpha channel.
 // Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp).
 // Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient).

// WEBGL_depth_texture

 // Unsigned integer type for 24-bit depth texture data.

// OES_texture_half_float

 // Half floating-point type (16-bit).

// WEBGL_color_buffer_float

 // RGBA 32-bit floating-point color-renderable format.
 // RGB 32-bit floating-point color-renderable format.
 //
 //

// EXT_blend_minmax

 // Produces the minimum color components of the source and destination colors.
 // Produces the maximum color components of the source and destination colors.

// EXT_sRGB

 // Unsized sRGB format that leaves the precision up to the driver.
 // Unsized sRGB format with unsized alpha component.
 // Sized (8-bit) sRGB and alpha formats.
 // Returns the framebuffer color encoding.

// OES_standard_derivatives

 // Indicates the accuracy of the derivative calculation for the GLSL built-in functions: dFdx, dFdy, and fwidth.

// WEBGL_draw_buffers

 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Framebuffer color attachment point
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Draw buffer
 // Maximum number of framebuffer color attachment points
 // Maximum number of draw buffers

// OES_vertex_array_object

 // The bound vertex array object (VAO).

// EXT_disjoint_timer_query

 // The number of bits used to hold the query result for the given target.
 // The currently active query.
 // The query result.
 // A Boolean indicating whether or not a query result is available.
 // Elapsed time (in nanoseconds).
 // The current time.
 // A Boolean indicating whether or not the GPU performed any disjoint operation.

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
			this._vertexShader = webGLShader(this._gl, VERTEX_SHADER, vertSrc);
			this._fragmentShader = webGLShader(this._gl, FRAGMENT_SHADER, fragSrc);
			this._program = this._gl.createProgram();
			this._gl.attachShader(this._program, this._vertexShader);
			this._gl.attachShader(this._program, this._fragmentShader);
			this._gl.linkProgram(this._program);

			try {
				var success = this._gl.getProgramParameter(this._program, LINK_STATUS);
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
			var uniformNumber = this._gl.getProgramParameter(this._program, ACTIVE_UNIFORMS);

			this._uniform = {};
			for (ii = 0; ii < uniformNumber; ii++) {
				var uniform = this._gl.getActiveUniform(this._program, ii);
				var uLocation = this._gl.getUniformLocation(this._program, uniform.name);

				var typeName = void 0;
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
			var attributreNumber = this._gl.getProgramParameter(this._program, ACTIVE_ATTRIBUTES);
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
				var success = this._gl.getProgramParameter(this._program, LINK_STATUS);
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
			this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);

			return this;
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			this.gl.bindBuffer(ARRAY_BUFFER, null);

			return this;
		}
	}, {
		key: 'setData',
		value: function setData(array) {
			var usage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;

			this.dataArray = array;

			this.gl.bufferData(ARRAY_BUFFER, array, usage);

			return this;
		}
	}, {
		key: 'setAttribs',
		value: function setAttribs(name, size) {
			var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FLOAT;
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
		var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : RGB;
		var internalFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : RGB;
		var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : UNSIGNED_BYTE;
		classCallCheck(this, Texture);

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

	createClass(Texture, [{
		key: 'activeTexture',
		value: function activeTexture() {
			this._gl.activeTexture(this.unit);
			return this;
		}
	}, {
		key: 'bind',
		value: function bind() {
			this._gl.bindTexture(TEXTURE_2D, this._texture);
			return this;
		}
	}, {
		key: 'fromImage',
		value: function fromImage(image, width, height) {
			this._width = width ? width : image.width;
			this._height = height ? height : image.height;

			this._gl.texImage2D(TEXTURE_2D, 0, this._internalFormt, this._format, this._type, image);

			return this;
		}
	}, {
		key: 'fromSize',
		value: function fromSize(width, height) {
			if (width) this._width = width;
			if (height) this._height = height;

			this._gl.texImage2D(TEXTURE_2D, 0, this._internalFormt, this._width, this._height, 0, this._format, this._type, null);

			return this;
		}
	}, {
		key: 'fromData',
		value: function fromData(width, height, dataArray) {
			if (width) this._width = width;
			if (height) this._height = height;

			this._gl.texImage2D(TEXTURE_2D, 0, this._internalFormt, this._width, this._height, 0, this._format, this._type, dataArray);
			return this;
		}
	}, {
		key: 'setFlip',
		value: function setFlip() {
			this.setPixelStore(UNPACK_FLIP_Y_WEBGL, true);
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
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LINEAR;

			this.setMinFilter(filter);
			this.setMagFilter(filter);

			return this;
		}
	}, {
		key: 'setMagFilter',
		value: function setMagFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LINEAR;

			this._gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, filter);

			return this;
		}
	}, {
		key: 'setMinFilter',
		value: function setMinFilter() {
			var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NEAREST;

			this._gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, filter);

			return this;
		}
	}, {
		key: 'wrap',
		value: function wrap() {
			var _wrap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CLAMP_TO_EDGE;

			this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, _wrap);
			this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, _wrap);

			return this;
		}
	}, {
		key: 'generateMipmap',
		value: function generateMipmap() {
			this._gl.generateMipmap(TEXTURE_2D);

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

        this._gl.framebufferTexture2D(FRAMEBUFFER, COLOR_ATTACHMENT0, TEXTURE_2D, this.texture.getTexture(), 0);
    }

    createClass(FrameBuffer, [{
        key: 'makeDepthBUffer',
        value: function makeDepthBUffer() {
            /**
             * https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html
             */
            // create a depth renderbuffer
            var depthBuffer = this._gl.createRenderbuffer();
            this._gl.bindRenderbuffer(RENDERBUFFER, depthBuffer);

            // make a depth buffer and the same size as the targetTexture
            this._gl.renderbufferStorage(RENDERBUFFER, DEPTH_COMPONENT16, this._width, this._height);
            this._gl.framebufferRenderbuffer(FRAMEBUFFER, DEPTH_ATTACHMENT, RENDERBUFFER, depthBuffer);

            return this;
        }
    }, {
        key: 'bind',
        value: function bind() {
            this._gl.bindFramebuffer(FRAMEBUFFER, this._frameBuffer);

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
            this._gl.bindFramebuffer(FRAMEBUFFER, null);
            return this;
        }
    }, {
        key: 'updateSize',
        value: function updateSize(width, height) {
            this._width = width;
            this._height = height;

            this.texture.bind().fromSize(this._width, this._height);

            if (this.depthBuffer) {
                this._gl.bindRenderbuffer(RENDERBUFFER, this.depthBuffer);
                this._gl.renderbufferStorage(RENDERBUFFER, DEPTH_COMPONENT16, this._width, this._height);
            }
        }
    }, {
        key: '_makeTexture',
        value: function _makeTexture(params) {
            var texture = new Texture(this._gl, params.internalFormat, params.format, params.type);
            texture.bind().setFilter(NEAREST) //https://evanw.github.io/lightgl.js/docs/texture.html
            .wrap(CLAMP_TO_EDGE).fromData(this._width, this._height, params.dataArray);

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
			this._gl.bindTransformFeedback(TRANSFORM_FEEDBACK, this._transfromFeedback);

			return this;
		}
	}, {
		key: 'unbindBufferBase',
		value: function unbindBufferBase() {
			var _this = this;

			this._arrayBuffers.forEach(function (arrayBuffers, index) {
				return _this._gl.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, index, null);
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
				_this2._gl.bindBuffer(ARRAY_BUFFER, arrayBuffers.read.buffer);
				_this2._gl.bindBufferBase(TRANSFORM_FEEDBACK_BUFFER, index, arrayBuffers.write.buffer);
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
		var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TRIANGLES;

		gl.drawArrays(mode, 0, cnt);
	},
	element: function element(gl, cnt) {
		var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TRIANGLES;

		gl.drawElements(mode, cnt, UNSIGNED_SHORT, 0);
	},
	elementPoints: function elementPoints(gl, cnt) {
		this.element(gl, cnt, POINTS);
	},
	arrayPoint: function arrayPoint(gl, cnt) {
		this.array(gl, cnt, POINTS);
	},
	elementTriangles: function elementTriangles(gl, cnt) {
		this.element(gl, cnt, POINTS);
	},
	arrayLines: function arrayLines(gl, cnt) {
		this.array(gl, cnt, LINES);
	},
	elementLines: function elementLines(gl, cnt) {
		this.element(gl, cnt, LINES);
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

Object.defineProperty(exports, '__esModule', { value: true });

})));
