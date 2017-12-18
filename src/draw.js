import {TRIANGLES, POINTS, LINE_STRIP, LINES, TRIANGLE_STRIP, TRIANGLE_FAN} from 'tubugl-constants';
import {UNSIGNED_SHORT} from 'tubugl-constants';

/**
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements
 */
export let draw = {
    array: function(gl, cnt, mode = TRIANGLES){
        gl.drawArrays(mode, 0, cnt);
    },
    element: function(gl, cnt, mode = TRIANGLES){
        gl.drawElements(mode, cnt, UNSIGNED_SHORT, 0);
    },
    elementPoints: function(gl, cnt){
        this.element(gl, cnt, POINTS);
    },
    arrayPoint: function(gl, cnt){
        this.array(gl, cnt, POINTS);
    },
    elementTriangles: function(gl, cnt){
        this.element(gl, cnt, POINTS);
    },
    arrayLines: function(gl, cnt){
        this.array(gl, cnt, LINES);
    },
    elementLines: function(gl, cnt){
        this.element(gl, cnt, LINES);
    }
}

export class DrawCall{
    constructor(primitives = TRIANGLES){

    }
    draw(){

    }
}
