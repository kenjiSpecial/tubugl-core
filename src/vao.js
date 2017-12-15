import {FLOAT, ARRAY_BUFFER} from 'tubugl-constants';

/**
 * VertexArray for only webgl2
 */
export class VAO{
    constructor(gl){
        this._gl = gl;
        this._vao = gl.createVertexArray();

        this._arrayBuffers = {}
    }
    bind(){
        this._gl.bindVertexArray(this._vao);

        return this;
    }
    updateArrayBuffer(program, arrayBuffer, name){
        this._arrayBuffers[name] = arrayBuffer;
        // console.log(arrayBuffer)
        arrayBuffer.attribPointer(program);

        return this;
    }
    updateIndexBuffer(indexArrayBuffer){
        indexArrayBuffer.bind();
        return;
    }
    delete(){
        this._gl.deleteVertexArray(this._vao);

        return this;
    }
}