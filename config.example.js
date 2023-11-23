exports.config = {
	startIndex: 0,
	baseUrl: '',
	typo3Username: '',
	typo3Password: '',
	openBrowser: false,
	goToUrlParameters: {
		waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
		timeout: 0
	}
};
