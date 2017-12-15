/**
 *
 */

import {Program, ArrayBuffer, IndexArrayBuffer, FrameBuffer} from 'tubuGL';

const TweenLite = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

const vertexShaderSrc = `// an attribute will receive data from a buffer
  attribute vec4 a_position;
  attribute vec2 uv;
  
  uniform float uTheta;
  varying vec2 vUv;
  
  // all shaders have a main function
  void main() {
    gl_Position = a_position;
    
    vUv = uv; 
  }`;

function fragmentShaderSrc(colorR, colorG, colorB){
    return `
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    float colorR = gl_FrontFacing ? 1.0 : 0.0;
    float colorG = gl_FrontFacing ? 0.0 : 1.0;
    
    gl_FragColor = vec4(colorR, colorG, 0.0, 1.0);
  }
`;
}


const fragmentSrc = `
precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec4 color = texture2D(uTexture, vUv) + vec4(0.2, 0.2, 1.0, 0.0);
    
    gl_FragColor = color;
}
`;


export default class App {
    constructor(params){
        this.updateAttribute = this.updateAttribute.bind(this);
        this._playAndStop = this._playAndStop.bind(this);

        this._isPlay = false;
        this._width = params.width ? params.width : window.innerWidth;
        this._height = params.height ? params.height : window.innerHeight;

        this.canvas = params.canvas;
        this.gl = this.canvas.getContext('webgl');
        this._description = params.description;

        this.createFrameBuffer();
        this.createProgram();
        this.resize();
        this._setDebug();
    }

    _playAndStop(){
        if(this._isPlay){
            this.stop();
            this._playAndStopGUI.name('play');
        }else{
            this.start();
            this._playAndStopGUI.name('pause');
        }
    }

    _setDebug(){
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
        let descriptionDom = document.createElement('div');
        descriptionDom.style.color = '#ffffff';
        descriptionDom.style.fontSize = '12px'
        descriptionDom.style.marginTop = '5px';
        descriptionDom.style.marginLeft = '4px';
        this.stats.dom.appendChild(descriptionDom);
        descriptionDom.innerHTML = this._description;

        this.gui = new dat.GUI();
        this.gui.add(this, 'updateAttribute');
        this._playAndStopGUI = this.gui.add(this, '_playAndStop').name('pause');
    }

    createFrameBuffer(){
        this._frambuffer = new FrameBuffer(this.gl, window.innerWidth, window.innerHeight);
        this._frambuffer.unbind();
    }

    createProgram(){
        this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc(1.0, 0.0, 0.0));


        let pos0 = {x: 0.4, y: 0};
        let pos1 = {x: -0.4, y: 0}
        let side = 0.1
        this.vertices = new Float32Array( [
            -side/2 + pos0.x, -side/2 + pos1.y,
            side/2 + pos0.x, -side/2 + pos1.y,
            side/2 + pos0.x,  side/2 + pos1.y,
            -side/2 + pos0.x,  side/2 + pos1.y,

            -side/2 + pos1.x, -side/2 + pos1.y,
            side/2 + pos1.x, -side/2 + pos1.y,
            side/2 + pos1.x,  side/2 + pos1.y,
            -side/2 + pos1.x,  side/2 + pos1.y,
        ] );

        let uvsOrig = new Float32Array([
            0, 1,
            1, 1,
            1, 0,
            0, 0,

            0, 1,
            1, 1,
            1, 0,
            0, 0
        ]);

        this._shapeCnt = 6 * 2

        let shapeCnt = 4;
        this.indices = new Uint16Array( [
            0, 1, 2,
            0, 2, 3,
            0 + shapeCnt, 1 + shapeCnt, 2 + shapeCnt,
            0 + shapeCnt, 2 + shapeCnt, 3 + shapeCnt,
        ] );

        this._arrayBuffer = new ArrayBuffer(this.gl, this.vertices);
        this._arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

        this._uvBuffer = new ArrayBuffer(this.gl, uvsOrig);
        this._uvBuffer.setAttribs('uv', 2, this.gl.FLOAT, false, 0, 0);

        this._indexBuffer = new IndexArrayBuffer(this.gl, this.indices);

        this._obj = {
            program: this._program,
            positionBuffer: this._arrayBuffer,
            indexBuffer: this._indexBuffer,
            uvBuffer: this._uvBuffer,
            count: 12
        };


        let program2 = new Program(this.gl, vertexShaderSrc, fragmentSrc);

        side = 1.0;
        let indices2 = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);
        let vertices2 = new Float32Array([
            -side/2, -side/2,
            side/2, -side/2,
            side/2,  side/2,
            -side/2,  side/2 ,
        ]);
        let uvs = new Float32Array([
            0, 1,
            1, 1,
            1, 0,
            0, 0
        ]);

        let arrayBuffer = new ArrayBuffer(this.gl, vertices2);
        arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

        let uvBuffer = new ArrayBuffer(this.gl, uvs);
        uvBuffer.setAttribs('uv', 2, this.gl.FLOAT, false, 0, 0);

        let indexBuffer2 = new IndexArrayBuffer(this.gl, indices2);

        this._out = {
            program: program2,
            indexBuffer: indexBuffer2,
            positionBuffer: arrayBuffer,
            uvBuffer: uvBuffer,
            count: 6
        }

    }

    updateAttribute(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer1);
        let positions2 = [
            Math.random() - 0.5, Math.random() - 0.5,
            Math.random() - 0.5, Math.random() - 0.5,
            Math.random() - 0.5, Math.random() - 0.5,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions2), this.gl.STATIC_DRAW);
    }

    start(){
        this._isPlay = true;
        TweenMax.ticker.addEventListener('tick', this.update, this);
    }

    stop(){
        this._isPlay = false;
        TweenMax.ticker.removeEventListener('tick', this.update, this);
    }

    update(){
        this.stats.update();

        let gl = this.gl;

        /**
         * =====================================
         */

        this._frambuffer.bind().updateViewport();
        this._obj.program.bind();

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this._obj.indexBuffer.bind();
        this._obj.positionBuffer.bind().attribPointer(this._obj.program);
        this._obj.uvBuffer.bind().attribPointer(this._obj.program);

        this.gl.drawElements(this.gl.TRIANGLES, this._obj.count, this.gl.UNSIGNED_SHORT, 0 );

        /**
         * =====================================
         */

        this._frambuffer.unbind();

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, this._width, this._height);

        this._out.program.bind();
        this._out.indexBuffer.bind();
        this._out.positionBuffer.bind().attribPointer(this._out.program);
        this._out.uvBuffer.bind().attribPointer(this._out.program);

        this.gl.drawElements(this.gl.TRIANGLES, this._out.count, this.gl.UNSIGNED_SHORT, 0 );
    }

    resize(width, height){
        if(width) this._width = width;
        if(height) this._height = height;

        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.gl.viewport(0, 0, this._width, this._height);
    }
}