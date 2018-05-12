const DEFAULT_OPTION_LIST = [
	{
		"checked": true,
		"label": "Google",
		"url": "https://www.google.co.jp/search?q=$1",
		"ico": "image/www.google.co.jp.ico"
	},
	{
		"checked": true,
		"label": "Google Translate en->ja",
		"url": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1",
		"ico": "image/translate.google.co.jp.ico"
	},
	{
		"checked": true,
		"label": "Google Translate ja->en",
		"url": "https://translate.google.co.jp/?hl=ja&tab=TT#ja/en/$1",
		"ico": "image/translate.google.co.jp.ico"
	},
	{
		"checked": true,
		"label": "Yahoo!",
		"url": "https://search.yahoo.co.jp/q=$1",
		"ico": "image/dummy.svg"
	},
	{
		"checked": true,
		"label": "Cambridge",
		"url": "https://dictionary.cambridge.org/search/english/direct/?q=$1",
		"ico": "image/dictionary.cambridge.org.ico"
	}
];
const PRESET_OPTION_LIST = [
	{
		"label": browser.i18n.getMessage("presetWeblioDictionary"),
		"url": "https://www.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioEnglishDictionary"),
		"url": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"label": browser.i18n.getMessage("presetGoogleSearch"),
		"url": "https://www.google.co.jp/search?q=$1"
	},
	{
		"label": browser.i18n.getMessage("presetGoogleTranslateEn2Ja"),
		"url": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1"
	},
	{
		"label": browser.i18n.getMessage("presetGoogleTranslateJa2En"),
		"url": "https://translate.google.co.jp/?hl=ja&tab=TT#ja/en/$1"
	},
	{
		"label": browser.i18n.getMessage("presetCambridgeDictionaryEn2Ja"),
		"url": "https://dictionary.cambridge.org/search/english-japanese/direct/?q=$1"
	},
	{
		"label": browser.i18n.getMessage("presetCambridgeDictionaryEn2En"),
		"url": "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	}
];
