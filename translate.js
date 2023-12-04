const puppeteer = require('puppeteer');
const fs = require('fs');

const { config } = require('./config.js');

var browser,
	page,
	ajaxUrls;


const loadCookie = async (page) => {
	const cookieJson = await fs.readFileSync('./cookies.json');
	const cookies = JSON.parse(cookieJson);
	await page.setCookie(...cookies);
}

const getPagesToBeTranslated = async () => {
	if (config.listOfPagesFormat == 'url') {
		await page.goto(config.baseUrl + config.listOfPages, config.goToUrlParameters);
		await page.content();

		innerText = await page.evaluate(() => {
			return JSON.parse(document.querySelector('body').innerText);
		});

		return innerText;
	}

	if (config.listOfPagesFormat == 'file') {
		const pages = await fs.readFileSync(config.listOfPages);
		return JSON.parse(pages);
	}
}

/**
 * Builds a URL based on the path & params
 *
 * @param {string} path
 * @param {object} params
 * @returns {string}
 */
const buildUrl = (path, params) => {
	const url = new URL(`${config.baseUrl}${path}`);

	for(let p in params) {
		if (Array.isArray(params[p])) {
			params[p].forEach((i) => url.searchParams.append(p + '[]', i));
		} else {
			url.searchParams.set(p, params[p]);
		}
	}

	return url.toString();
}

/**
 * Get TYPO3 ajax URLs
 */
const getAjaxUrls = async () => {

	await page.goto(config.baseUrl + '/typo3/', config.goToUrlParameters);

	const elementHandle = await page.$('#typo3-contentIframe');
	const frame = await elementHandle.contentFrame();
	const typo3 = await frame.evaluate('TYPO3');
	ajaxUrls = typo3.settings.ajaxUrls;
}

/**
 * Get the items to translate for the target page & language
 *
 * @param {*} pageId
 * @param {*} languageId
 * @returns
 */
const getItemsToTranslate = async (urlParams) => {
	let url = buildUrl(
		ajaxUrls.records_localize_summary,
		urlParams
	)
	await page.goto(url, config.goToUrlParameters);
	await page.content();

	innerText = await page.evaluate(() => {
		return JSON.parse(document.querySelector('body').innerText);
	});

	let records = [];

	for (let key in innerText.records) {
		for (let item of innerText.records[key]) {
			records.push(item.uid);
		}
	}

	return records;
}

const translateRecords = async (urlParams) => {
	let url = buildUrl(
		ajaxUrls.records_localize,
		urlParams
	);

	await page.goto(url, config.goToUrlParameters);
}

const translatePage = async (pageId, destLanguageId) => {
	console.log(`> Page ID ${pageId} || Language ID: ${destLanguageId}`);

	let recordsToTranslate = await getItemsToTranslate({
		pageId,
		destLanguageId,
		languageId: 0
	});

	if (recordsToTranslate.length > 0) {
		console.log(`> Items being translated: ${recordsToTranslate.join(', ')}`);

		await translateRecords({
			pageId,
			destLanguageId,
			srcLanguageId: 0,
			action: 'localize',
			uidList: recordsToTranslate
		});
	}
}


const translatePages = async () => {
	browser = await puppeteer.launch({
		headless: (config.openBrowser ? false : 'new'),
		args: [
			'--disable-web-security',
			'--disable-features=IsolateOrigins,site-per-process'
		]
	});

	page = await browser.newPage();
	await loadCookie(page);

	await getAjaxUrls();

	const pagesToBeTranslated = await getPagesToBeTranslated(),
		pagesToBeTranslatedCount = Object.keys(pagesToBeTranslated).length;

	console.log('######');
	console.log(`# There are ${pagesToBeTranslatedCount} pages`);
	console.log('######');

	let i = 1;
	for (let pageId in pagesToBeTranslated) {
		console.log('-------')
		console.log(`# ${i} out of ${pagesToBeTranslatedCount}`);

		if (i++ < config.startIndex) {
			continue;
		}

		for (let languageId of pagesToBeTranslated[pageId]) {
			await translatePage(pageId, languageId);
		}
	}

	browser.close();
};

translatePages();
