import {Program, ArrayBuffer, IndexArrayBuffer, FrameBuffer, VAO} from 'tubuGL';
import {UNSIGNED_SHORT} from "tubugl-constants";

const TweenLite = require('gsap');
const dat = require('../../vendors/dat.gui/dat.gui');
const Stats = require('../../vendors/stats.js/stats');

const vertexShaderSrc = `#version 300 es
in vec4 position;

uniform float uTheta;

// all shaders have a main function
void main() {
gl_Position = position;

}`;

const fragmentShaderSrc = `#version 300 es
  precision mediump float;
  
  out vec4 outColor;

  void main() {
    float colorR = gl_FrontFacing ? 1.0 : 0.0;
    float colorG = gl_FrontFacing ? 0.0 : 1.0;
    
    outColor = vec4(colorR, colorG, 0.0, 1.0);
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
        this.gl = this.canvas.getContext('webgl2');
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
        this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc);
        /**
        var x1 = -1;
        var x2 = 1;
        var y1 = -1;
        var y2 = 1;
        let positions = new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]);
        */
        let positions = new Float32Array([
            -1, -1,
            1, -1,
            1, 1,
            -1, 1,
        ]);

        let uvs = new Float32Array([
            0, 1,
            1, 1,
            1, 0,
            0, 0
        ]);

        let indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);

        /** ====================================== **/


        // this._program.bind();
        // this._vao = new VAO(this.gl);
        // this._vao.bind();

        this._vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this._vao);

        var positionAttributeLocation = this.gl.getAttribLocation(this._program._program, "position");
        this._positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // console.log(positionAttributeLocation);

        // this._arrayBuffer = new ArrayBuffer(this.gl, positions);
        // this._arrayBuffer.setAttribs('position', 2, this.gl.FLOAT, false, 0, 0);
        // this._arrayBuffer.attribPointer(this._program)

        // this._uvBuffer = new ArrayBuffer(this.gl, uvs);
        // this._uvBuffer.setAttribs('uv', 2, this.gl.FLOAT, false, 0, 0);

        // this._vao.updateArrayBuffer(this._program, this._arrayBuffer, 'a_position');
        // this._vao.updateArrayBuffer(this._program, this._uvBuffer, 'uv');

        // this._indexBuffer = new IndexArrayBuffer(this.gl, indices);
        // this._indexBuffer.setData()
        // this._vao.updateIndexBuffer(this._indexBuffer);

        this.indexBuffer =  this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

        this._obj = {
            program: this._program,
            // vao: this._vao,
            count: 6
        };

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

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this._obj.program.bind();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.gl.drawElements(this.gl.TRIANGLES, this._obj.count, UNSIGNED_SHORT, 0);
        // this.gl.drawArrays(this.gl.TRIANGLES, 0, 3 );

        // var primitiveType = gl.TRIANGLES;
        // var offset = 0;
        // var count = 3;
        // gl.drawArrays(primitiveType, offset, count);

    }

    resize(width, height){
        if(width) this._width = width;
        if(height) this._height = height;

        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.gl.viewport(0, 0, this._width, this._height);
    }
}