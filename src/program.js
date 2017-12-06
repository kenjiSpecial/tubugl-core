import {webGLShader} from './utils/webglShader'

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
            this._uniform[uniform.name] = {
                type: uniform.type,
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

    dispose(){
        if(this.gl === null) return;

        this.gl.deleteProgram(this._program);
        this.gl.deleteShader(this._vertexShader);
        this.gl.deleteShader(this._fragmentShader);
        this.gl = null;
    }
}