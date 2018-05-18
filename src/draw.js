
/**
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
 *  https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements
 */
export let draw = {
	array: function(gl, cnt, mode = gl.TRIANGLES) {
		gl.drawArrays(mode, 0, cnt);
	},
	element: function(gl, cnt, mode = gl.TRIANGLES) {
		gl.drawElements(mode, cnt, gl.UNSIGNED_SHORT, 0);
	},
	elementPoints: function(gl, cnt) {
		this.element(gl, cnt, gl.POINTS);
	},
	arrayPoint: function(gl, cnt) {
		this.array(gl, cnt, gl.POINTS);
	},
	elementTriangles: function(gl, cnt) {
		this.element(gl, cnt, gl.POINTS);
	},
	arrayLines: function(gl, cnt) {
		this.array(gl, cnt, gl.LINES);
	},
	elementLines: function(gl, cnt) {
		this.element(gl, cnt, gl.LINES);
	}
};
