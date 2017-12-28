// https://github.com/taehwanno/jest-image-snapshot-example

import puppeteer from 'puppeteer';

async function captureScreen(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);
	let screenshot = await page.screenshot();
	browser.close();
	expect(screenshot).toMatchImageSnapshot();
}

it('#00: program and arrayBuffer', async () => {
	await captureScreen('http://localhost:3000/test/00?NoDebug');
});

it('#01: program, arrayBuffer, and indexArrayBuffer', async () => {
	await captureScreen('http://localhost:3000/test/01?NoDebug');
});

it('#02: program, arrayBuffer, indexArrayBuffer, texture', async () => {
	await captureScreen('http://localhost:3000/test/02?NoDebug');
});

it('#03: draw function', async () => {
	await captureScreen('http://localhost:3000/test/03?NoDebug');
});

it('#04: framebuffer', async () => {
	await captureScreen('http://localhost:3000/test/04?NoDebug');
});

it('#05: vao(webgl2)', async () => {
	await captureScreen('http://localhost:3000/test/05?NoDebug');
});

it('#06: program2 and transformFeedback(webgl2)', async () => {
	await captureScreen('http://localhost:3000/test/06?NoDebug');
});
