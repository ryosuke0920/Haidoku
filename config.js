const DEFAULT_OPTION_LIST = [
	{
		"c": true,
		"l": browser.i18n.getMessage("presetGoogleSearch"),
		"u": "https://www.google.co.jp/search?q=$1"
	},
	{
		"c": true,
		"l": browser.i18n.getMessage("presetGoogleTranslateEn2Ja"),
		"u": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1"
	},
	{
		"c": true,
		"l": browser.i18n.getMessage("presetWikipedia"),
		"u": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
	},
	{
		"c": true,
		"l": browser.i18n.getMessage("presetCambridgeDictionary"),
		"u": "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	},
];
const PRESET_OPTION_LIST = [
	{
		"l": browser.i18n.getMessage("presetGoogleSearch"),
		"u": "https://www.google.co.jp/search?q=$1"
	},
	{
		"l": browser.i18n.getMessage("presetGoogleTranslateEn2Ja"),
		"u": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1"
	},
	{
		"l": browser.i18n.getMessage("presetGoogleTranslateJa2En"),
		"u": "https://translate.google.co.jp/?hl=ja&tab=TT#ja/en/$1"
	},
	{
		"l": browser.i18n.getMessage("presetWikipedia"),
		"u": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
	},
	{
		"l": browser.i18n.getMessage("presetYahooJapanDictionar"),
		"u": "https://dic.yahoo.co.jp/search/?fr=dic&stype=full&ei=UTF-8&p=$1"
	},
	{
		"l": browser.i18n.getMessage("presetWeblioDictionary"),
		"u": "https://www.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"l": browser.i18n.getMessage("presetWeblioThesaurus"),
		"u": "https://thesaurus.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"l": browser.i18n.getMessage("presetWeblioThesaurusAntonym"),
		"u": "https://thesaurus.weblio.jp/antonym/content_find?fixFmFocusType=&query=$1&searchType=exact"
	},
	{
		"l": browser.i18n.getMessage("presetWeblioEnglishDictionary"),
		"u": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"l": browser.i18n.getMessage("presetWeblioChineseDictionary"),
		"u": "https://cjjc.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"l": browser.i18n.getMessage("presetWeblioKoreanDictionary"),
		"u": "https://kjjk.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"l": browser.i18n.getMessage("presetWeblioKobun"),
		"u": "https://kobun.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"l": browser.i18n.getMessage("presetGooDictionar"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?mode=0&kind=all&MT=$1"
	},
	{
		"l": browser.i18n.getMessage("presetGooJapaneseDictionar"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jn"
	},
	{
		"l": browser.i18n.getMessage("presetGooJapaneseThesaurus"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=thsrs"
	},
	{
		"l": browser.i18n.getMessage("presetGooEnglishDictionary"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=en"
	},
	{
		"l": browser.i18n.getMessage("presetGooChineseJapaneseDictionary"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=cj"
	},
	{
		"l": browser.i18n.getMessage("presetGooJapaneseChineseDictionary"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jc"
	},
	{
		"l": browser.i18n.getMessage("presetEijiro"),
		"u": "https://eow.alc.co.jp/search?q=$1"
	},
	{
		"l": browser.i18n.getMessage("presetCambridgeDictionary"),
		"u": "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	},
	{
		"l": browser.i18n.getMessage("presetCambridgeDictionaryEn2Ja"),
		"u": "https://dictionary.cambridge.org/search/english-japanese/direct/?q=$1"
	},
	{
		"l": browser.i18n.getMessage("presetOxfordDictionary"),
		"u": "https://en.oxforddictionaries.com/search?utf8=✓&filter=dictionary&query=$1"
	},
	{
		"l": browser.i18n.getMessage("presetOxfordDictionaryUS"),
		"u": "https://en.oxforddictionaries.com/search?utf8=✓&filter=noad&query=$1"
	},
	{
		"l": browser.i18n.getMessage("presetDictionaryCom"),
		"u": "http://www.dictionary.com/browse/$1?s=ts"
	}
];
