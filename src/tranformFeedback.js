/**
 * only support webgl2
 */

import {TRANSFORM_FEEDBACK} from 'tubugl-constants';


export class TransformFeedback{
    constructor(gl){
        this._gl = gl;
        this._transfromFeedback = this.gl.createTransformFeedback();
    }
    bind(){
        this._gl.bindTransformFeedback(TRANSFORM_FEEDBACK, this._transfromFeedback);

        return this;
    }
}