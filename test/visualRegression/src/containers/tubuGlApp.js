/* eslint-disable react/no-unescaped-entities */
import React from 'react'

import App0 from '../tubuglApp/test/00';
import App1 from '../tubuglApp/test/01';
import App2 from '../tubuglApp/test/02';
import App3 from '../tubuglApp/test/03';
import App4 from '../tubuglApp/test/04';


export default class TubuGlApp extends React.Component {
    constructor(props){
        super(props);

        this._appId = parseInt(props.globalStore.appId);
        this._description = props.globalStore.description
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
            case 2: App = App2; break;
            case 3: App = App3; break;
            case 4: App = App4; break;
        }

        this._app = new App({description: this._description, canvas: this.canvas, width: this.canvas.width, height: this.canvas.height});
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