const DEFAULT_OPTION_LIST = [
	{
		"checked": true,
		"label": browser.i18n.getMessage("presetWeblioDictionary"),
		"url": "https://www.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"checked": true,
		"label": browser.i18n.getMessage("presetWeblioEnglishDictionary"),
		"url": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
	},
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
		"label": browser.i18n.getMessage("presetCambridgeDictionary"),
		"url": "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	},
	{
		"label": browser.i18n.getMessage("presetCambridgeDictionaryEn2Ja"),
		"url": "https://dictionary.cambridge.org/search/english-japanese/direct/?q=$1"
	},
	{
		"label": browser.i18n.getMessage("presetOxfordDictionary"),
		"url": "https://en.oxforddictionaries.com/search?utf8=✓&filter=dictionary&query=$1"
	},
	{
		"label": browser.i18n.getMessage("presetOxfordDictionaryUS"),
		"url": "https://en.oxforddictionaries.com/search?utf8=✓&filter=noad&query=$1"
	},
	{
		"label": browser.i18n.getMessage("presetDictionaryCom"),
		"url": "http://www.dictionary.com/browse/$1?s=ts"
	}
];
