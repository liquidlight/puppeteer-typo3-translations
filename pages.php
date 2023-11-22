<?php

$envs = parse_ini_file('../../.env');

if (is_file('../../.env.local')) {
	$envs = array_merge($envs, parse_ini_file('../../.env.local'));
}

$mysqli = new mysqli(
	$envs['TYPO3_DB_HOST'],
	$envs['TYPO3_DB_USER'],
	$envs['TYPO3_DB_PASSWORD'],
	$envs['TYPO3_DB_NAME'],
	3306,
);
$mysqli->set_charset('utf8mb4');

$pages = $mysqli->query('
			SELECT l10n_parent, GROUP_CONCAT(sys_language_uid SEPARATOR ",") languages
			FROM pages
			WHERE deleted = 0
			AND sys_language_uid > 0
			GROUP BY l10n_parent
		');

$output = [];
while ($row = $pages->fetch_assoc()) {
	$output[$row['l10n_parent']] = explode(',', $row['languages']);
}

header('Content-Type: application/json');
echo json_encode($output);
