/* eslint-disable react/no-unescaped-entities */
import React from 'react'


export default class SimpleExample extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;


    }

    // React components are simple functions that take in props and state, and render HTML
    render(){
        return (
            <canvas ref={(canvas) => { this.canvas = canvas; }}></canvas>
        );
    }
};