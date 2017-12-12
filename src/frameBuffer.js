import {FRAMEBUFFER, COLOR_ATTACHMENT0} from 'tubugl-constants';
import {TEXTURE_2D, TEXTURE_WRAP_S, TEXTURE_WRAP_T, CLAMP_TO_EDGE, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER, NEAREST, LINEAR} from 'tubugl-constants';
import {RGBA, UNSIGNED_BYTE} from 'tubugl-constants'
import {isPowerOf2} from './utils/functions';

export class FrameBuffer {
    constructor(gl, width = 256, height = 256){
        this._gl = gl;
        this._width = width;
        this._height = height;

        this._texture = this._makeTexture();
        this._gl.texImage2D(
            TEXTURE_2D, 0, RGBA, width, height, 0,
            RGBA, UNSIGNED_BYTE, null);

        this._frameBuffer = this._gl.createFramebuffer();
        this._gl.bindFramebuffer(FRAMEBUFFER, this._frameBuffer);

        this._gl.framebufferTexture2D( FRAMEBUFFER, COLOR_ATTACHMENT0, TEXTURE_2D, this._texture, 0);
    }

    bind(){
        this._gl.bindFramebuffer(FRAMEBUFFER, this._frameBuffer);

        return this;
    }

    updateViewport(){
        this._gl.viewport(0, 0, this._width, this._height);

        return this;
    }

    unbind(){
        this._gl.bindFramebuffer(FRAMEBUFFER, null);
        return this;
    }

    _makeTexture(){
        let texture = this._gl.createTexture();

        this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
        this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
        this._gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
        this._gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST);

        return texture;
    }

}
