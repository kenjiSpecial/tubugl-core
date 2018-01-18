/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import App0 from '../tubuglApp/raw/rawGL00';
import App1 from '../tubuglApp/raw/rawGL01';
import App2 from '../tubuglApp/raw/rawGL02';
import App3 from '../tubuglApp/raw/rawGL03';
import App4 from '../tubuglApp/raw/rawGL04';
import App5 from '../tubuglApp/raw/rawGL05';

export default class SimpleExample extends React.Component {
	constructor(props) {
		super(props);
		this._appId = parseInt(props.globalStore.appId);
	}

	_resizeHandler() {
		this._app.resize(window.innerWidth, window.innerHeight);
	}

	componentDidMount() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		let App;
		switch (this._appId) {
			case 0:
				App = App0;
				break;
			case 1:
				App = App1;
				break;
			case 2:
				App = App2;
				break;
			case 3:
				App = App3;
				break;
			case 4:
				App = App4;
				break;
			case 5:
				App = App5;
				break;
		}

		this._app = new App({
			canvas: this.canvas,
			width: this.canvas.width,
			height: this.canvas.height
		});
		this._app.start();

		window.addEventListener('resize', () => {
			this._resizeHandler();
		});
	}

	// React components are simple functions that take in props and state, and render HTML
	render() {
		return (
			<canvas
				ref={canvas => {
					this.canvas = canvas;
				}}
			/>
		);
	}
}
