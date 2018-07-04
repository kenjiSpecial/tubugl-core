import { Texture } from '../texture';

// https://github.com/BabylonJS/Babylon.js/blob/eb75d8064ea755d2a9433c4edfb2cb32dd32cd83/src/Engine/babylon.engine.ts#L5186-L5190
// http://doc.babylonjs.com/features/webgl2 multisample render targets

export class MultiSample{
    /**
     * 
     * @param {webglContext} gl 
     * @param {object} params 
     * @param {GLenum} params.samples
     * @param {boolean} params.isDepth
     * @param {number} width 
     * @param {number} height 
     */
    constructor(gl, params = {samples: 1, isDepth: true}, width = 256, height = 256){
         /**
         * @type {webglContext2}
         * @description webgl2 context
         */
        this._gl = gl;
        /**
         * @type {number}
         */
        this._samples = params.samples;
        /**
         * @type {boolean}
         */
        this._isDepth = params.isDepth;
        /**
		 * @type {number}
		 */
        this._width = width;
        /**
         * @type {number}
         */
        this._height = height;
        
        
        this._createTexture();
        this._createFramebuffers();
    }
    
    _createTexture(){
        this._texture = new Texture( this._gl, this._gl.RGBA, this._gl.RGBA);
        this._texture.bind()
                    .setMagFilter(this._gl.NEAREST)
                    .setMinFilter(this._gl.NEAREST)
                    .fromSize(this._width, this._height)
                    .unbind();               
    }
    
    _createFramebuffers(){
        
        /**
         * @type {WebGLFrameBuffer}
         */
        this._colorFramebuffer = this._gl.createFramebuffer();
        
        /**
         * @type {WebGLFrameBuffer}
         */
        this._rendererFramebuffer = this._gl.createFramebuffer();
        
        /**
         * @type {WebGLRenderBuffer}
         */
        this._colorRenderbuffer = this._gl.createRenderbuffer();
        
        this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this._colorRenderbuffer);
        this._gl.renderbufferStorageMultisample( this._gl.RENDERBUFFER, this._samples, this._gl.RGBA8, this._width, this._height );
        
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._rendererFramebuffer);
        this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.RENDERBUFFER, this._colorRenderbuffer);
        
        if(this._isDepth){
            /**
             * @type {WebGLRenderBuffer}
             */
            this._depthBuffer = this._gl.createRenderbuffer();
            this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this._depthBuffer);
            
            // make a depth buffer and the same size as the targetTexture
            // https://github.com/BabylonJS/Babylon.js/blob/eb75d8064ea755d2a9433c4edfb2cb32dd32cd83/src/Engine/babylon.engine.ts#L5186-L5190
            if(this._samples > 0) this._gl.renderbufferStorageMultisample(this._gl.RENDERBUFFER, this._samples, this._gl.DEPTH_COMPONENT16, this._width, this._height);
            else this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);
            
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, this._depthBuffer);
            
        }
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
        
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._colorFramebuffer);
        this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._texture.id, 0);
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    }
    
    /**
     * @description Blitting means bit-boundary block transfer
     */
    blit(){
        this._gl.bindFramebuffer(this._gl.READ_FRAMEBUFFER, this._rendererFramebuffer);
        this._gl.bindFramebuffer(this._gl.DRAW_FRAMEBUFFER, this._colorFramebuffer);
        this._gl.clearBufferfv(this._gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
        this._gl.blitFramebuffer(
            0, 0, this._width, this._height,
            0, 0, this._width, this._height,
            this._gl.COLOR_BUFFER_BIT, this._gl.NEAREST
        );
    }
    
    bind(){
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._rendererFramebuffer);
    }
    
    unbind(){
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    }
    
    /**
     * @return {WebGLTexture}
     */
    get texture(){
        return this._texture;
    }
}