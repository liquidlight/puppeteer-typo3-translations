# TYPO3 Page Translator

Sometimes when tealing with custom upgrades in TYPO3, the translated content elements seem to become disconnected from the translated pages and need "re-translating".

This is done by clicking the "Translate" button in TYPO3 but for one client, which has over 1600 pages to translate, this was going to take far too long.

This code helps automate it by logging into TYPO3 and translating the pages for you.

## Usage

1. Clone the repo down locally & `npm i`
2. Wherever you are doing the translations, copy the `pages.php` file and ensure it is accessible on `[site url]/pages.php` and returns an array
3. Copy `config.example.js` to `config.js` and fill in the details
	- **Note:** `baseUrl` should **not** have a trailing `/`
4. Login to TYPO3 with `node login.js`
5. Translate the pages with `node translate.js`
6. Delete the `pages.php` file from the site

If the script times out, or you need to stop it, make a note of the page index (e.g. `# 113 out of 1650`) and update the `startIndex` parameter in `config.js` to start from there.

## Post-use handy SQL

Once completed, I have run the following SQL statements

**Run with caution and take _all_ the backups**

### Match translated content status to default language

This matches any translated content elements to the default language - status & container

```sql
UPDATE tt_content AS a
LEFT JOIN tt_content AS b ON a.l18n_parent = b.uid
SET a.sorting = b.sorting,
	a.deleted = b.deleted,
	a.hidden = b.hidden,
	a.colPos = b.colPos,
	a.CType = b.CType,
	a.tx_container_parent = b.tx_container_parent
WHERE a.l18n_parent IS NOT NULL
AND b.sorting IS NOT NULL
AND a.l18n_parent > 0
AND a.sys_language_uid > 0
;
```

## Config

| key | description |
|---|---|
| startIndex | What item number should it start processing from - useful if the script times out |
| baseUrl | The base domain name for your TYPO3 install |
| typo3Username | A username for a user who can login to the backend |
| typo3Password | A password for your TYPO3 user |
| openBrowser | Should an actual browser window open? Useful for debugging |
| listOfPagesFormat | How should the list of pages be found? Options are `url` or `file` |
| listOfPages | Where is the list of pages based on `listOfPagesFormat`? if `url`, then relative to `baseUrl`, if `file` then relative to this folder output should be an object of page ids with an array of languages to translate |
| goToUrlParameters | What parameters are passed to the `page.goto` function |
