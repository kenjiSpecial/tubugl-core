import {webGLShader} from './utils/webglShader'
import {FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4} from 'tubugl-constants';
import {FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4} from 'tubugl-constants';
import {VERTEX_SHADER, FRAGMENT_SHADER, LINK_STATUS, ACTIVE_UNIFORMS, ACTIVE_ATTRIBUTES} from 'tubugl-constants';



export  class Program2 extends Program{
    /**
     *
     * @param gl
     * @param vertSrc
     * @param fragSrc
     * @param params
     */
    constructor(gl, vertSrc, fragSrc, params = {}){

        super(gl, vertSrc, fragSrc, params);

    }
}