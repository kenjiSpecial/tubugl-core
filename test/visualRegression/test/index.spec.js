// https://github.com/taehwanno/jest-image-snapshot-example

import puppeteer from 'puppeteer';

async  function captureScreen(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let screenshot = await page.screenshot();
    browser.close();
    expect(screenshot).toMatchImageSnapshot();
}

it('test00', async () => {
    await captureScreen('http://localhost:3000/test/00');
});

it('test01', async () => {
    await captureScreen('http://localhost:3000/test/01');
});

it('test02', async () => {
    await captureScreen('http://localhost:3000/test/02');
});

it('test03', async () => {
    await captureScreen('http://localhost:3000/test/03');
});