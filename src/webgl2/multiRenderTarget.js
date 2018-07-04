import {
    Program2
} from './program2';

export class MultiRenderTarget {
    constructor(gl, vertexShaderSrc, fragmentShaderSrc, params = {}) {
        if (!gl.getExtension('EXT_color_buffer_float')) {
            console.error('FLOAT color buffer not available');
            return;
        }

        this._program = new Program2(gl, vertexShaderSrc, fragmentShaderSrc);
        this._gl = gl;
        this._gBuffer = gl.createFramebuffer();
        this._targets = {};
        this._index = 0;
    }

    bind() {
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._gBuffer);

        return this;
    }

    useProgram() {
        this._program.use();

        return this;
    }

    createTexture(targetName, internalFormat) {
        let target = this._gl.createTexture();
        let gl = this._gl;
        internalFormat = internalFormat ? internalFormat : this._gl.RGBA;

        gl.bindTexture(gl.TEXTURE_2D, target);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + this._index, gl.TEXTURE_2D, target, 0);

        this._targets[targetName] = target;
        this._index++;
    }

    createDepthTexture() {
        let gl = this._gl;
        var depthTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT16, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);

        this._depthTexture = depthTexture;
    }

    updateDrawBuffers() {
        let drawBufferArray = [];
        for (let ii = 0; ii < this._index; ii++) {
            drawBufferArray.push(this._gl.COLOR_ATTACHMENT0 + ii);
        }
        this._gl.drawBuffers(drawBufferArray);

        return this;
    }

    unbind() {
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

        return this;
    }

    get target() {
        return this._targets;
    }

    get program() {
        return this._program;
    }
}