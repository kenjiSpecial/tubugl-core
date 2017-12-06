
export let textureNum = 0;

import {TEXTURE_2D, RGB, UNSIGNED_BYTE, TEXTURE0, RGBA, LINEAR, NEAREST, TEXTURE_MIN_FILTER, TEXTURE_MAG_FILTER} from 'tubugl-constants';
import {TEXTURE_WRAP_T, TEXTURE_WRAP_S, CLAMP_TO_EDGE} from 'tubugl-constants';

export class Texture {
    constructor(gl, format = RGB, internalFormat = RGB, type = UNSIGNED_BYTE, unit = textureNum){

        this._gl = gl;
        if(!this._gl){
            console.error('gl is missed');
            return;
        }

        this._texture = this._gl.createTexture();

        this.unit = TEXTURE0 + textureNum;

        this.setFormat(format, internalFormat, type)

        textureNum++;


        return this;
    }
    activate(){
        this._gl.activeTexture(this.unit);
        return this;
    }
    bind(){
        this._gl.bindTexture(TEXTURE_2D, this._texture);
        return this;
    }
    fromImage(image, width, height){
        this._width = width ? width : image.width;
        this._height = height? height : image.height;

        this._gl.texImage2D(TEXTURE_2D, 0, this._internalFormt, this._format, this._type, image);

        return this
    }
    setFormat(format, internalFormat, type){
        if(format) this._format = format;
        if(internalFormat) this._internalFormt = internalFormat;
        if(type) this._type = type;

        return this;
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getTexParameter
     * https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
     *
     * @param filter
     */
    setFilter(filter = LINEAR){
        this.setMinFilter(filter);
        this.setMagFilter(filter);

        return this;
    }
    setMagFilter(filter = LINEAR){
        this._gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, filter);

        return this;
    }
    setMinFilter(filter = NEAREST){
        this._gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, filter);

        return this;
    }
    wrap(wrap = CLAMP_TO_EDGE){
        this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, wrap);
        this._gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, wrap);

        return this;
    }
}