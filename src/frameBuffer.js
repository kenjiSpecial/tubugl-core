import {
    FRAMEBUFFER,
    COLOR_ATTACHMENT0,
    RENDERBUFFER,
    DEPTH_COMPONENT16,
    DEPTH_ATTACHMENT
} from 'tubugl-constants';
import { TEXTURE_2D, CLAMP_TO_EDGE, NEAREST } from 'tubugl-constants';
import { RGBA, UNSIGNED_BYTE } from 'tubugl-constants';
import { Texture } from './texture';

export class FrameBuffer {
    /**
     *
     * @param {webglContext} gl
     * @param {{internalFormat: GLenum, format, GLenum, type: GLenum }} params
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

        this._gl = gl;
        this._width = width;
        this._height = height;

        this.texture = this._makeTexture(params);
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

    bind() {
        this._gl.bindFramebuffer(FRAMEBUFFER, this._frameBuffer);

        return this;
    }

    updateViewport() {
        this._gl.viewport(0, 0, this._width, this._height);

        return this;
    }

    unbind() {
        this._gl.bindFramebuffer(FRAMEBUFFER, null);
        return this;
    }

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

    _makeTexture(params) {
        let texture = new Texture(this._gl, params.internalFormat, params.format, params.type);
        texture
            .bind()
            .setFilter(NEAREST) //https://evanw.github.io/lightgl.js/docs/texture.html
            .wrap(CLAMP_TO_EDGE)
            .fromData(this._width, this._height, params.dataArray);

        return texture;
    }

    reset() {
        this.texture.bind().fromSize(this._width, this._height);
    }

    delete() {
        this.texture.delete();
    }
}