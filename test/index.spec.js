// https://github.com/taehwanno/jest-image-snapshot-example

import puppeteer from 'puppeteer';

async function captureScreen(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.setViewport({width: 640, height: 360});
	await page.goto(url);
	let screenshot = await page.screenshot();
	browser.close();
	expect(screenshot).toMatchImageSnapshot();
}

it('#00: program and arrayBuffer', async () => {
	await captureScreen('http://localhost:8080/docs/example/00-array-buffer-test.html?NoDebug');
});

it('#01: indexArrayBuffer', async () => {
	await captureScreen('http://localhost:8080/docs/example/01-index-array-buffer-test.html?NoDebug');
});

it('#02: texture', async () => {
	await captureScreen('http://localhost:8080/docs/example/02-texture-test.html?NoDebug');
});

it('#03: Framebuffer', async () => {
	await captureScreen('http://localhost:8080/docs/example/03-framebuffer-test.html?NoDebug');
});

it('#04: VAO', async () => {
	await captureScreen('http://localhost:8080/docs/example/04-VAO-test.html?NoDebug');
});

it('#05: transformfeedback', async () => {
	await captureScreen('http://localhost:8080/docs/example/05-transformfeedback-test.html?NoDebug');
});

