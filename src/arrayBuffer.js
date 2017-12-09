
import {ARRAY_BUFFER, STATIC_DRAW} from 'tubugl-constants';


export class ArrayBuffer{
    constructor(gl, data){
        this.gl = gl;
        this.buffer = this.gl.createBuffer();
        this.attribs = [];

        try{
            let success = data instanceof Float32Array || data instanceof Float64Array;
            if(success)             {
                this.bind();
                this.setData(data);
                this.unbind();
            }
            else throw 'data should be  Float32Array or Flaot64Array';
        }catch(error){
            console.error(error);
        }
    }

    bind(){
        this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);
        return this;
    }

    unbind(){
        this.gl.bindBuffer(ARRAY_BUFFER, this.buffer);
        return this;
    }

    setData(array){
        this.gl.bufferData(ARRAY_BUFFER, array, STATIC_DRAW);
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

    attribPointer(program){;
        this.attribs.forEach((attrib)=>{
            let location = program.getAttrib(attrib.name).location;
            // console.log(location)
            let {size, type, normalize, stride, offset} = attrib;

            this.gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
            this.gl.enableVertexAttribArray(location);
        });

        return this;
    }

}