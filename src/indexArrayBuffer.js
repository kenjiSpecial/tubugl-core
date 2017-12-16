export class IndexArrayBuffer{
    constructor(gl, data){
        this.gl = gl;
        this.buffer = this.gl.createBuffer();

        try{
            let sucess = data instanceof Uint16Array;
            if(sucess)         this.setData(data);
            else               throw 'data should be Uint16Array';
        }catch(error){
            console.error(error);
        }
    }

    setData(data){
        this.bind();
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        return this;
    }
    bind(){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        return this;
    }
}