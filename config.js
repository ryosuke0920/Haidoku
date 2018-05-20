const DEFAULT_OPTION_LIST = [
	{
		"checked": true,
		"label": browser.i18n.getMessage("presetWikipedia"),
		"url": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
	},
	{
		"checked": true,
		"label": browser.i18n.getMessage("presetYahooJapanDictionar"),
		"url": "https://dic.yahoo.co.jp/search/?fr=dic&stype=full&ei=UTF-8&p=$1"
	},
	{
		"checked": true,
		"label": browser.i18n.getMessage("presetWeblioEnglishDictionary"),
		"url": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
	},
];
const PRESET_OPTION_LIST = [
	{
		"label": browser.i18n.getMessage("presetWikipedia"),
		"url": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
	},
	{
		"label": browser.i18n.getMessage("presetYahooJapanDictionar"),
		"url": "https://dic.yahoo.co.jp/search/?fr=dic&stype=full&ei=UTF-8&p=$1"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioDictionary"),
		"url": "https://www.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioThesaurus"),
		"url": "https://thesaurus.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioThesaurusAntonym"),
		"url": "https://thesaurus.weblio.jp/antonym/content_find?fixFmFocusType=&query=$1&searchType=exact"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioEnglishDictionary"),
		"url": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioChineseDictionary"),
		"url": "https://cjjc.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioKoreanDictionary"),
		"url": "https://kjjk.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"label": browser.i18n.getMessage("presetWeblioKobun"),
		"url": "https://kobun.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"label": browser.i18n.getMessage("presetGooDictionar"),
		"url": "https://dictionary.goo.ne.jp/freewordsearcher.html?mode=0&kind=all&MT=$1"
	},
	{
		"label": browser.i18n.getMessage("presetGooJapaneseDictionar"),
		"url": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jn"
	},
	{
		"label": browser.i18n.getMessage("presetGooJapaneseThesaurus"),
		"url": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=thsrs"
	},
	{
		"label": browser.i18n.getMessage("presetGooEnglishDictionary"),
		"url": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=en"
	},
	{
		"label": browser.i18n.getMessage("presetGooChineseJapaneseDictionary"),
		"url": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=cj"
	},
	{
		"label": browser.i18n.getMessage("presetGooJapaneseChineseDictionary"),
		"url": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jc"
	},
	{
		"label": browser.i18n.getMessage("presetEijiro"),
		"url": "https://eow.alc.co.jp/search?q=$1"
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
