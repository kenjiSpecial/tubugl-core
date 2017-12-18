"use strict";

export function detectorWebGL() {
    let c = document.createElement('canvas');
    try {
        return !!window.WebGLRenderingContext
            && (!!c.getContext('experimental-webgl') || !!c.getContext('webgl'));
    } catch (e) {
        return null;
    }
};


export function detectorWebGL2(){
    let c = document.createElement('canvas');
    try {
        return !!window.WebGL2RenderingContext
            && !!c.getContext('webgl');
    } catch (e) {
        return null;
    }
}