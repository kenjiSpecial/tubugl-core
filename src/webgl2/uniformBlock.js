export class UniformBlock {
    constructor(gl, name, location, data, program) {
        this._gl = gl;
        this._name = name;
        this._location = location;

        this._initializeUniformBlock(program);
        this._createBuffer();

        if (data)
            this.bind()
            .setData(data)
            .initializeBuffer()
            .subData();

        this._initializeBufferBase();
    }

    _initializeUniformBlock(program) {
        // console.log(program, this._name);
        var uniformBlockLocation = this._gl.getUniformBlockIndex(program.id, this._name);
        this._gl.uniformBlockBinding(program.id, uniformBlockLocation, this._location);
    }

    /**
     * create buffer for uniform block
     */
    _createBuffer() {
        this._buffer = this._gl.createBuffer();

        return this;
    }

    /**
     * binds a given WebGLBuffer to a given binding point (target) at a given index
     */
    _initializeBufferBase() {
        this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, this._location, this._buffer);

        return this;
    }

    /**
     * bind buffer to uniform block
     */
    bind() {
        this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._buffer);

        return this;
    }

    /**
     * update/set data for UniformBlock
     * 
     * @param {Uint16Array | Uint32Array} data 
     * 
     */
    setData(data) {
        /**
         * @member {Float32Array | Float64Array}
         */
        this.dataArray = data;

        return this;
    }

    initializeBuffer() {
        this._gl.bufferData(this._gl.UNIFORM_BUFFER, this.dataArray, this._gl.DYNAMIC_DRAW);
        return this;
    }

    updateBuffer(dataArray, num = 0) {
        this.setData(dataArray);
        this.subData(num);

        return;
    }

    update() {
        this.subData();
        return this;
    }

    subData(num = 0) {
        this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, num, this.dataArray);

        return this;
    }

    get loaction() {
        return this._location;
    }

}