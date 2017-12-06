/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import App0 from '../tubuglApp/rawGL00';
import App1 from '../tubuglApp/rawGL01';

export default class SimpleExample extends React.Component {
    constructor(props){
        super(props);
        this._appId = parseInt(props.globalStore.appId);
    }

    _resizeHandler(){
        this._app.resize(window.innerWidth, window.innerHeight)
    }

    componentDidMount(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        let App;
        switch(this._appId){
            case 0: App = App0; break;
            case 1: App = App1; break;
        }

        this._app = new App({canvas: this.canvas, width: this.canvas.width, height: this.canvas.height});
        this._app.start();

        window.addEventListener('resize', ()=>{
            this._resizeHandler();
        })
    }

    // React components are simple functions that take in props and state, and render HTML
    render(){
        return (
            <canvas ref={(canvas) =>{
                this.canvas = canvas;
            }}></canvas>
        );
    }
};