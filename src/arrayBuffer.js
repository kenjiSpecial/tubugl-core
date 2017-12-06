export class ArrayBuffer{
    constructor(gl, data){
        this.gl = gl;
        this.buffer = this.gl.createBuffer();
        this.attribs = [];

        try{
            let success = data instanceof Float32Array || data instanceof Float64Array;
            if(success)             this.setData(data);
            else throw 'data should be  Float32Array or Flaot64Array';
        }catch(error){
            console.error(error);
        }
    }

    setData(array){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, array, this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
    setAttribs(name, size, type, normalize, stride, offset){
        this.attribs.push({
            name : name,
            size: size,
            type: type,
            nomarlize: normalize,
            stride: stride,
            offset: offset
        });
    }
    bind(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        return this;
    }
    attribPointer(program){;
        this.attribs.forEach((attrib)=>{
            let location = program.getAttrib(attrib.name).location;
            let {size, type, normalize, stride, offset} = attrib;
            this.gl.enableVertexAttribArray(location);
            this.gl.vertexAttribPointer(this._positionAttribLocation1, size, type, normalize, stride, offset)
        });

        return this;
    }
    drawTriangles(count, offset = 0){
        this.gl.drawArrays(this.gl.TRIANGLES, offset, count);
    }
}