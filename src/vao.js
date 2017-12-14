import {FLOAT, ARRAY_BUFFER} from 'tubugl-constants';

/**
 * VertexArray for only webgl2
 */
export class VAO{
    constructor(gl){
        this._gl = gl;
        this._vao = gl.createVertexArray();
    }
    bindVertexArray(){
        this._gl.bindVertexArray();
        return this;
    }
    updatBuffer(program, name, buffer, opts = {}){
        let location = this._gl.getAttribLocation(program, name);

        this._gl.enableVertexAttribArray(location);
        this._gl.bindBuffer(ARRAY_BUFFER, buffer);
        let {size, type, normalize, stride, offset} = opts;


        return this;
    }
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    _setAttribPoint(location, size, type = FLOAT, normalize = false, stride = 0, offset = 0){
        gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
        return this;
    }
}