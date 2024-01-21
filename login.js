const puppeteer = require('puppeteer');
const fs = require('fs');

const { config } = require('./config.js');

const login = async () => {
	const browser = await puppeteer.launch({
		headless: false,
		args: [
			'--disable-web-security',
			'--disable-features=IsolateOrigins,site-per-process'
		]
	});
	const page = await browser.newPage();


	await page.goto(config.baseUrl + '/typo3/');
	await page.type('input[type=text]', config.typo3Username);
	await page.type('input[type=password]', config.typo3Password);
	await page.click('button[type=submit]');
	await page.waitForSelector('.topbar-header-site-logo');

	const cookies = JSON.stringify(await page.cookies());
	const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
	const localStorage = await page.evaluate(() => JSON.stringify(localStorage));

	await fs.writeFileSync('./cookies.json', cookies);
	browser.close();
};

login();
