import {Program, ArrayBuffer, IndexArrayBuffer} from 'tubuGL';

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

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position + vec4(0.0 * cos(uTheta), 0.0 * sin(uTheta), 0.0, 0.0);
    vUv = uv;
  }`;

function fragmentShaderSrc(colorR, colorG, colorB){
    return `
  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;
  
  varying vec2 vUv;

  void main() {
<<<<<<< HEAD
      vec4 color = texture2D( uTexture, vUv);
      gl_FragColor = vec4(vUv, 0.0, 1.0);
=======
    gl_FragColor = vec4(vUv, 0.0, 1.0);
>>>>>>> 4505c6b38117413ccc6e972a8d248b4e52464bce
  }
`;
}


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

<<<<<<< HEAD
    _onload(){
        this._texture = new Texture(this.gl);
        this._texture.bind().setFilter().wrap().fromImage(this._image, this._image.width, this._image.height);

        this.play();
    }

    createProgram(){
        this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc );
=======
    createProgram(){
        this._program = new Program(this.gl, vertexShaderSrc, fragmentShaderSrc(1.0, 0.0, 0.0));
        let positions = [
            -0.5, -0.5,
            -0.5, 0.1,
            -0.1, 0.1,
            -0.1, -0.5,
        ];
        let indices = [
            0, 1, 2,
            0, 2, 3
        ];
>>>>>>> 4505c6b38117413ccc6e972a8d248b4e52464bce

        let pos0 = {x: 0., y: 0.};
        let side = 0.1

        this.vertices = new Float32Array( [
<<<<<<< HEAD
            -side/2 + pos0.x, -side/2 + pos0.y,
             side/2 + pos0.x, -side/2 + pos0.y,
             side/2 + pos0.x,  side/2 + pos0.y,
            -side/2 + pos0.x,  side/2 + pos0.y,
        ] );

        this._shapeCnt = 6;
=======
            -side/2, -side/2,
             side/2, -side/2,
             side/2,  side/2,
            -side/2,  side/2,
        ] );

        let uvs = new Float32Array( [
            0., 0.,
            1., 0.,
            1., 1.,
            0., 1.
        ] );

        this._shapeCnt = 6
>>>>>>> 4505c6b38117413ccc6e972a8d248b4e52464bce

        let shapeCnt = 4;
        this.indices = new Uint16Array( [
            0, 1, 2,
            0, 2, 3,
        ] );

        let uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ]);

        this._arrayBuffer = new ArrayBuffer(this.gl, this.vertices);
        this._arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

        this._uvBuffer = new ArrayBuffer(this.gl, uvs);
        this._uvBuffer.setAttribs('uv', 2, this.gl.FLOAT, false, 0, 0);

        this._indexBuffer = new IndexArrayBuffer(this.gl, this.indices);

        this._obj = {
            program: this._program,
            positionBuffer: this._arrayBuffer,
<<<<<<< HEAD
            uvBuffer: this._uvBuffer,
=======

>>>>>>> 4505c6b38117413ccc6e972a8d248b4e52464bce
            indexBuffer: this._indexBuffer,
            count: 3
        };

<<<<<<< HEAD
=======

>>>>>>> 4505c6b38117413ccc6e972a8d248b4e52464bce
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

        // this.gl.frontFace(this.gl.CW);
        this.gl.enable(this.gl.CULL_FACE);
        // this.gl.cullFace(this.gl.BACK);

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this._obj.program.bind();

<<<<<<< HEAD
        var u_image0Location = this.gl.getUniformLocation(this._obj.program._program, "uTexture");
        this.gl.uniform1i(u_image0Location, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture._texture)

        this._obj.indexBuffer.bind();
        this._obj.positionBuffer.bind().attribPointer(this._obj.program);
        // this._obj.uvBuffer.bind().attribPointer(this._obj.program);
=======
        this._obj.indexBuffer.bind();
        this._obj.positionBuffer.bind().attribPointer(this._obj.program);
        this._uvBuffer.bind().attribPointer(this._obj.program);
>>>>>>> 4505c6b38117413ccc6e972a8d248b4e52464bce

        let gl = this.gl;
        gl.drawElements(gl.TRIANGLES, this._shapeCnt, gl.UNSIGNED_SHORT, 0 );
    }

    resize(width, height){
        if(width) this._width = width;
        if(height) this._height = height;

        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.gl.viewport(0, 0, this._width, this._height);
    }
}