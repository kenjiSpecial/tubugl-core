import React from 'react';
import { Router, Switch, Route } from 'react-static';
//
import Routes from 'react-static-routes';

import Home from './containers/Home';
import RawSample from './containers/rawSample';
import TestApp from './containers/tubuGlApp';

import './app.css';

export default () => (
	<Router>
		<Switch>
			<Route exact path="/" component={Home} />

			{/* raw sample */}
			<Route
				exact
				path="/raw/sample00"
				render={props => <RawSample globalStore={{ appId: '0' }} {...props} />}
			/>
			<Route
				exact
				path="/raw/sample01"
				render={props => <RawSample globalStore={{ appId: '1' }} {...props} />}
			/>
			<Route
				exact
				path="/raw/sample02"
				render={props => <RawSample globalStore={{ appId: '2' }} {...props} />}
			/>
			<Route
				exact
				path="/raw/sample03"
				render={props => <RawSample globalStore={{ appId: '3' }} {...props} />}
			/>
			<Route
				exact
				path="/raw/sample04"
				render={props => <RawSample globalStore={{ appId: '4' }} {...props} />}
			/>
			<Route
				exact
				path="/raw/sample05"
				render={props => <RawSample globalStore={{ appId: '5' }} {...props} />}
			/>
			<Route
				exact
				path="/raw/sample06"
				render={props => <RawSample globalStore={{ appId: '6' }} {...props} />}
			/>

			{/* main test */}
			<Route
				exact
				path="/test/00"
				render={props => (
					<TestApp
						globalStore={{
							appId: '0',
							description: 'test with program and arrayBuffer'
						}}
						{...props}
					/>
				)}
			/>
			<Route
				exact
				path="/test/01"
				render={props => (
					<TestApp
						globalStore={{
							appId: '1',
							description: 'test with program, arrayBuffer, and indexArrayBuffer'
						}}
						{...props}
					/>
				)}
			/>

			<Route
				exact
				path="/test/02"
				render={props => (
					<TestApp
						globalStore={{
							appId: '2',
							description: 'test with program, arrayBuffer, indexArrayBuffer, texture'
						}}
						{...props}
					/>
				)}
			/>
			<Route
				exact
				path="/test/03"
				render={props => (
					<TestApp
						globalStore={{ appId: '3', description: 'test for draw function' }}
						{...props}
					/>
				)}
			/>
			<Route
				exact
				path="/test/04"
				render={props => (
					<TestApp
						globalStore={{ appId: '4', description: 'test for framebuffer' }}
						{...props}
					/>
				)}
			/>
			<Route
				exact
				path="/test/05"
				render={props => (
					<TestApp
						globalStore={{ appId: '5', description: 'test for vao(webgl2)' }}
						{...props}
					/>
				)}
			/>
			<Route
				exact
				path="/test/06"
				render={props => (
					<TestApp
						globalStore={{
							appId: '6',
							description: 'test for program2 and transformFeedback(webgl2)'
						}}
						{...props}
					/>
				)}
			/>
			<Route
				exact
				path="/test/07"
				render={props => (
					<TestApp
						globalStore={{
							appId: '7',
							description: 'test for program and '
						}}
						{...props}
					/>
				)}
			/>
		</Switch>
	</Router>
);
