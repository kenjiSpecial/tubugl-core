import React from 'react'
import {Router, Switch, Route} from 'react-static'
//
import Routes from 'react-static-routes';

import Home from './containers/Home';
import RawSample from './containers/rawSample';
import TestApp from './containers/tubuGlApp';

import './app.css'

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home}/>


            {/* raw sample */}
            <Route exact path="/raw/sample00" render={(props) => <RawSample globalStore={{appId: '0'}} {...props} />}/>
            <Route exact path="/raw/sample01" render={(props) => <RawSample globalStore={{appId: '1'}} {...props} />}/>


            {/* main sample */}
            <Route exact path="/test/00" render={(props) => <TestApp globalStore={{appId: '0', description: 'test with program and arrayBuffer'}} {...props} />}/>
            <Route exact path="/test/01" render={(props) => <TestApp globalStore={{appId: '1', description: 'test with program, arrayBuffer, and indexArrayBuffer'}} {...props} />}/>
            <Route exact path="/test/02" render={(props) => <TestApp globalStore={{appId: '2', description: 'test with program, arrayBuffer, indexArrayBuffer, texture'}} {...props} />}/>

        </Switch>
    </Router>
);
