import React from 'react';
import { getSiteProps, Link } from 'react-static';

const divStyle = {
	maxWidth: '800px',
	margin: 'auto',
	fontSize: '15px',
	marginTop: '30px'
};

const ulStyle = {
	lineHeight: '1.8em'
};

const lineThroughStyle = {
	'fontWeight': 'bold',
	'textDecoration': 'line-through',
	'color': '#999999'
};

export default getSiteProps(() => (
	<div style={divStyle}>
		<h1>Tubugl Core Test Examples</h1>
		<ul style={ulStyle}>
			<li>
				<Link to="/test/00">test #00</Link>
			</li>
			<li>
				<Link to="/test/01">test #01</Link>
			</li>
			<li>
				<Link to="/test/02">test #02</Link>
			</li>
			<li style={lineThroughStyle}>
				test #03
			</li>
			<li>
				<Link to="/test/04">test #04</Link>
			</li>
			<li>
				<Link to="/test/05">test #05</Link>
			</li>
			<li>
				<Link to="/test/06">test #06</Link>
			</li>
			<li>
				<Link to="/test/07">test #07</Link>
			</li>
		</ul>
	</div>
));
