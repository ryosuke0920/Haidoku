const DEFAULT_OPTION_LIST = {
	"en":[
		{
			"c": true,
			"l": browser.i18n.getMessage("presetDictionaryCom"),
			"u": "http://www.dictionary.com/browse/$1?s=ts"
		},
		{
			"c": true,
			"l": browser.i18n.getMessage("presetGoogleComSearch"),
			"u": "https://www.google.com/search?q=$1"
		}
	],
	"ja": [
		{
			"c": true,
			"l": browser.i18n.getMessage("presetWeblioEnglishDictionary"),
			"u": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
		},
		{
			"c": true,
			"l": browser.i18n.getMessage("presetGoogleTranslateEn2Ja"),
			"u": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1"
		},
		{
			"c": true,
			"l": browser.i18n.getMessage("presetYahooJapanDictionar"),
			"u": "https://dic.yahoo.co.jp/search/?fr=dic&stype=full&ei=UTF-8&p=$1"
		},
		{
			"c": true,
			"l": browser.i18n.getMessage("presetGooDictionar"),
			"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?mode=0&kind=all&MT=$1"
		},
		{
			"c": true,
			"l": browser.i18n.getMessage("presetGoogleSearch"),
			"u": "https://www.google.co.jp/search?q=$1"
		},
		{
			"c": true,
			"l": "Yahoo!JAPAN",
			"u": "http://search.yahoo.co.jp/search?ei=UTF-8&p=$1"
		},
	]
};
const PRESET_OPTION_LIST = [
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGoogleSearch"),
		"u": "https://www.google.co.jp/search?q=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGoogleTranslateEn2Ja"),
		"u": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1"
	},
	{
		"lo": "ja",
		"l": "Bing",
		"u": "https://www.bing.com/search?q=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGoogleSearch"),
		"u": "https://www.google.co.jp/search?q=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWikipedia"),
		"u": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetYahooJapanDictionar"),
		"u": "https://dic.yahoo.co.jp/search/?fr=dic&stype=full&ei=UTF-8&p=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWeblioDictionary"),
		"u": "https://www.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWeblioThesaurus"),
		"u": "https://thesaurus.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWeblioThesaurusAntonym"),
		"u": "https://thesaurus.weblio.jp/antonym/content_find?fixFmFocusType=&query=$1&searchType=exact"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWeblioEnglishDictionary"),
		"u": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWeblioChineseDictionary"),
		"u": "https://cjjc.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWeblioKoreanDictionary"),
		"u": "https://kjjk.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetWeblioKobun"),
		"u": "https://kobun.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGooDictionar"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?mode=0&kind=all&MT=$1"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGooJapaneseDictionar"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jn"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGooJapaneseThesaurus"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=thsrs"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGooEnglishDictionary"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=en"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGooChineseJapaneseDictionary"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=cj"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetGooJapaneseChineseDictionary"),
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jc"
	},
	{
		"lo": "ja",
		"l": browser.i18n.getMessage("presetEijiro"),
		"u": "https://eow.alc.co.jp/search?q=$1"
	},
	{
		"lo": "ja",
		"l": "Yahoo!JAPAN",
		"u": "http://search.yahoo.co.jp/search?ei=UTF-8&p=$1"
	},
	{
		"lo": "en",
		"l": browser.i18n.getMessage("presetGoogleSearch"),
		"u": "https://www.google.com/search?q=$1"
	},
	{
		"lo": "en",
		"l": "Cambridge Dictionary",
		"u": "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	},
	{
		"lo": "en",
		"l": "Cambridge Dictionary(English-Japanese)",
		"u": "https://dictionary.cambridge.org/search/english-japanese/direct/?q=$1"
	},
	{
		"lo": "en",
		"l": "Oxford Dictionaries",
		"u": "https://en.oxforddictionaries.com/search?utf8=✓&filter=dictionary&query=$1"
	},
	{
		"lo": "en",
		"l": "Oxford Dictionaries(North American English)",
		"u": "https://en.oxforddictionaries.com/search?utf8=✓&filter=noad&query=$1"
	},
	{
		"lo": "en",
		"l": "Dictionary.com",
		"u": "http://www.dictionary.com/browse/$1?s=ts"
	},
	{
		"lo": "en",
		"l": "Thesaurus.com",
		"u": "http://www.thesaurus.com/browse/$1?s=t"
	},
	{
		"lo": "en",
		"l": "TheFreeDictionary.com",
		"u": "https://www.thefreedictionary.com/_/search.aspx?tab=1&SearchBy=0&Word=$1&TFDBy=0"
	},
	{
		"lo": "en",
		"l": "Collins",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english&q=$1"
	},
	{
		"lo": "en",
		"l": "Merriam-Webster",
		"u": "https://www.merriam-webster.com/dictionary/$1"
	},
	{
		"lo": "en",
		"l": "YourDictionary.com",
		"u": "http://www.yourdictionary.com/$1?direct_search_result=yes"
	}
];
