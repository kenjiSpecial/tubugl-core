import { webGLShader } from './utils/webglShader';
import { Uniform } from './uniform';

export class Program {
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
            let success = this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS);
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
	
        const uniformNumber = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_UNIFORMS);

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

        const attributreNumber = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_ATTRIBUTES);
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