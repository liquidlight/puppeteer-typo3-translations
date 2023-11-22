# TYPO3 Page Translator

When upgrading templates from TV+ to Fluid, the translated content elements seem to become disconnected from the translated pages and need "re-translating".

This is done by clicking the "Translate" button in TYPO3 but for SI, which has over 1600 pages to translate, this was going to take far too long.

This code helps automate it by logging into TYPO3 and translating the pages for you.

## Usage

1. Clone the repo down into the sites `html` folder - ensure the folder is called `translation-generator`
2. Go to `http://site/translation-generator/pages.php` and ensure it returns an array
3. Copy `config.example.js` to `config.js` and fill in the details
	- **Note:** `baseUrl` should **not** have a trailing `/`
4. Login to TYPO3 with `node login.js`
5. Translate the pages with `node index.js`
