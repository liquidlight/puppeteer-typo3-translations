exports.config = {
	// What item number should it start processing from - useful if the script times out
	startIndex: 0,

	// The base domain name for your TYPO3 install
	baseUrl: '',

	// A username & password for a user who can login to the backend
	typo3Username: '',
	typo3Password: '',

	// Should an actual browser window open? Useful for debugging
	openBrowser: false,

	// How should the list of pages be found?
	// Options are `url` or `file`
	listOfPagesFormat: 'url',

	// Where is the list of pages based on `listOfPagesFormat`?
	// - if `url`, then relative to `baseUrl`
	// - if `file` then relative to this folder
	// output should be an object of page ids with an array of languages to translate
	listOfPages: '/translation-generator/pages.php',

	// What parameters are passed to the `page.goto` function
	goToUrlParameters: {
		waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
		timeout: 0
	}
};
