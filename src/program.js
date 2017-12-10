import {webGLShader} from './utils/webglShader'
import {FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4} from 'tubugl-constants';
import {FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4} from 'tubugl-constants'

export  class Program{
    /**
     *
     * @param gl
     * @param vertSrc
     * @param fragSrc
     * @param params
     */
    constructor(gl, vertSrc, fragSrc, params = {}){
        this._isReady = false;
        this._isDebgu = params.isDebug;

        this.gl = gl;

        this._vertexShader = webGLShader(gl, gl.VERTEX_SHADER, vertSrc);
        this._fragmentShader = webGLShader(gl, gl.FRAGMENT_SHADER, fragSrc);
        this._program = gl.createProgram();
        gl.attachShader(this._program, this._vertexShader);
        gl.attachShader(this._program, this._fragmentShader);
        gl.linkProgram(this._program);

        try{
            let success = this.gl.getProgramParameter(this._program, this.gl.LINK_STATUS);
            if(!success) throw this.gl.getProgramInfoLog(this._program);
        }catch (error){
            console.error(`WebGLProgram: ${error}`)
        }

        this._setProperties();
    }

    /**
     * set properties such as uniforms and attributes
     * @private
     */
    _setProperties(){
        let ii;

        // uniforms
        const uniformNumber = this.gl.getProgramParameter(this._program, this.gl.ACTIVE_UNIFORMS);

        this._uniform = {};
        for(ii = 0; ii < uniformNumber; ii++){
            let uniform = this.gl.getActiveUniform(this._program, ii);
            let uLocation = this.gl.getUniformLocation(this._program, uniform.name);

            let typeName;
            /**
             * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
             * */
            switch(uniform.type){
                case FLOAT: typeName = "float"; break;
                case FLOAT_VEC2: typeName = "vec2"; break;
                case FLOAT_VEC3: typeName = "vec3"; break;
                case FLOAT_VEC4: typeName = "vec4"; break;
                case FLOAT_MAT2: typeName = "mat2"; break;
                case FLOAT_MAT3: typeName = "mat3"; break;
                case FLOAT_MAT4: typeName = "mat4"; break;
            }

            this._uniform[uniform.name] = {
                location: uLocation,
                type: uniform.type,
                typeName: typeName,
                size: uniform.size
            };

        }

        //attributes
        const attributreNumber = this.gl.getProgramParameter(this._program, this.gl.ACTIVE_ATTRIBUTES);
        this._attrib = {};
        for(ii = 0; ii < attributreNumber; ii++){
            let attrib = this.gl.getActiveAttrib(this._program, ii);
            this._attrib[attrib.name] = {
                location: this.gl.getAttribLocation(this._program, attrib.name),
                type: attrib.type,
                size: attrib.size
            };
        }
    }

    bind(){
        this.gl.useProgram(this._program);
    }

    getAttrib(name){
        return this._attrib[name];
    }

    getUniforms(name){
        return this._uniform[name];
    }

    setUniformTexture(texture){
        let {uniformName, textureNum} = texture;
        let uniform = this.getUniforms(uniformName);
        this.gl.uniform1i(uniform.location, textureNum);
    }

    dispose(){
        if(this.gl === null) return;

        this.gl.deleteProgram(this._program);
        this.gl.deleteShader(this._vertexShader);
        this.gl.deleteShader(this._fragmentShader);
        this.gl = null;
    }
}