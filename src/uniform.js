const FLOAT = 0x1406;
const FLOAT_VEC2 = 0x8B50;
const FLOAT_VEC3 = 0x8B51;
const FLOAT_VEC4 = 0x8B52;
const FLOAT_MAT2 = 0x8B5A;
const FLOAT_MAT3 = 0x8B5B;
const FLOAT_MAT4 = 0x8B5C;
const SAMPLER_2D = 0x8B5E;

/**
 * Class representing a Uniform for a Program class
 */
export class Uniform {
    /**
     * @description Uniform class constructor
     *
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {WebGLActiveInfo} uniform information of unifrom getting from getActiveUniform
     * @param {Object} context
     * @param {Number} context.textIndex
     *
     * @constructor Uniform
     */
    constructor(gl, program, uniform, context) {
            let uniformLocation = gl.getUniformLocation(program, uniform.name);
            this.location = uniformLocation;
            this.size = uniform.size;
            this._gl = gl;

            let typeName;
            switch (uniform.type) {
                case FLOAT:
                    typeName = 'float';
                    break;
                case FLOAT_VEC2:
                    typeName = 'vec2';
                    break;
                case FLOAT_VEC3:
                    typeName = 'vec3';
                    break;
                case FLOAT_VEC4:
                    typeName = 'vec4';
                    break;
                case FLOAT_MAT2:
                    typeName = 'mat2';
                    break;
                case FLOAT_MAT3:
                    typeName = 'mat3';
                    break;
                case FLOAT_MAT4:
                    typeName = 'mat4';
                    break;
                case SAMPLER_2D:
                    typeName = 'sampler2D';
					this.unit = context.texIndex ++;
                    break; // TODO Do we need to some method or not
            }


            this.typeName = typeName;
            this.type = uniform.type;

        }
        /**
         * update unifroms
         *
         * @param {Array} args
         */
    update(...args) {
        // console.log(this.typeName);
        switch (this.type) {
            case FLOAT:
                this._gl.uniform1f(this.location, args[0]);
                break;
            case FLOAT_VEC2:
                this._gl.uniform2f(this.location, args[0], args[1]);
                break;
            case FLOAT_VEC3:
                this._gl.uniform3f(this.location, args[0], args[1], args[2]);
                break;
            case FLOAT_VEC4:
                this._gl.uniform4f(this.location, args[0], args[1], args[2], args[3]);
                break;
            case FLOAT_MAT2:
                this._gl.uniformMatrix2fv(this.location, false, args[0]);
                break;
            case FLOAT_MAT3:
                this._gl.uniformMatrix3fv(this.location, false, args[0]);
                break;
            case FLOAT_MAT4:
                this._gl.uniformMatrix4fv(this.location, false, args[0]);
                break;
            case SAMPLER_2D:
                this._gl.uniform1i(this.location, args[0]);
                break;
        }
    }
}