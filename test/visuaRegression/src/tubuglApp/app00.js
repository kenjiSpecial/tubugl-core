const TweenLite = require('gsap');
import {webGLShader} from "../../../../src/utils/webglShader";

const dat = require('../vendors/dat.gui/dat.gui');
const Stats = require('../vendors/stats.js/stats');



export default class App{
    constructor(params){
        this.updateAttribute = this.updateAttribute.bind(this);
        this._playAndStop = this._playAndStop.bind(this);

        this._isPlay = false;
        this._width = params.width ? params.width : window.innerWidth;
        this._height = params.height ? params.height : window.innerHeight;

        this.canvas = params.canvas;
        this.gl = this.canvas.getContext('webgl');

        this.createProgram();
        this.resize();
        this._setDebug();
    }
    _playAndStop(){
        if(this._isPlay){
            this._playAndStopGUI.name('pause');
            this.stop();
        }else{
            this._playAndStopGUI.name('play');
            this.start();
        }
    }
    _setDebug(){
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        this.gui = new dat.GUI();
        this.gui.add(this, 'updateAttribute');
        this._playAndStopGUI = this.gui.add(this, '_playAndStop').name('pause');
    }
    createProgram(){
        let vertexShader = webGLShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSrc);
        let fragmentShader = webGLShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSrc(1.0, 0.0, 0.0));
        this._program = this.initProgram(vertexShader, fragmentShader);

        this._positionAttribLocation = this.gl.getAttribLocation(this._program, 'a_position');
        this._positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer);

        var positions = [
            -0.5, -0.5,
            -0.3, 0.1,
            0, -0.5,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        this._theta = Math.PI * 2 * Math.random();
        this.uThetaUniform = this.gl.getUniformLocation(this._program, "uTheta");

        // shape2

        let fragmentShader1 = webGLShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSrc(0.0, 0.0, 1.0));
        this._program1 = this.initProgram(vertexShader, fragmentShader1);
        //
        this._positionAttribLocation1 = this.gl.getAttribLocation(this._program1, 'a_position');
        this._positionBuffer1 = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer1);
        let positions2 = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions2), this.gl.STATIC_DRAW);
        this._theta1 = Math.PI * 2 * Math.random();
        this.uThetaUniform1 = this.gl.getUniformLocation(this._program1, "uTheta");

    }
    initProgram(vertexShader, fragmentShader) {
        let program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) {
            return program;
        }

        this.gl.deleteProgram(program);
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
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer

        // draw
        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = 3;

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this._program);
        this._theta += 1/200;
        this.gl.uniform1f(this.uThetaUniform, this._theta);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(this._positionAttribLocation);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer);
        this.gl.vertexAttribPointer(
            this._positionAttribLocation, size, type, normalize, stride, offset)
        this.gl.drawArrays(primitiveType, offset, count);


        this.gl.useProgram(this._program1);
        this._theta1 += 1/200;
        this.gl.uniform1f(this.uThetaUniform1, this._theta1);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(this._positionAttribLocation1);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._positionBuffer1);
        this.gl.vertexAttribPointer(
            this._positionAttribLocation1, size, type, normalize, stride, offset)
        this.gl.drawArrays(primitiveType, offset, count);
    }

    resize(width, height){
        if(width) this._width = width;
        if(height) this._height = height;

        this.gl.viewport(0, 0, this._width, this._height);
    }
}