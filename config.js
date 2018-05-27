const DEFAULT_OPTION_LIST = {
	"en":[
		{
			"c": true,
			"l": "Wikipedia",
			"u": "https://en.wikipedia.org/w/index.php?search=$1&title=Special:Search&go=Go"
		},
		{
			"c": true,
			"l": "Dictionary.com",
			"u": "http://www.dictionary.com/browse/$1?s=ts"
		},
		{
			"c": true,
			"l": "Google",
			"u": "https://www.google.com/search?q=$1"
		}
	],
	"ja": [
		{
			"c": true,
			"l": "ウィキペディア",
			"u": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
		},
		{
			"c": true,
			"l": "weblio 英和辞典・和英辞典",
			"u": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
		},
		{
			"c": true,
			"l": "Google 翻訳 英語→日本語",
			"u": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1"
		},
		{
			"c": true,
			"l": "Google",
			"u": "https://www.google.co.jp/search?q=$1"
		}
	]
};
const PRESET_OPTION_LIST = [
	{
		"la": "en",
		"l": "Wikipedia",
		"u": "https://en.wikipedia.org/w/index.php?search=$1&title=Special:Search&go=Go"
	},
	{
		"la": "en",
		"l": "Google",
		"u": "https://www.google.com/search?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary",
		"u": "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-Japanese)",
		"u": "https://dictionary.cambridge.org/search/english-japanese/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Oxford Dictionaries",
		"u": "https://en.oxforddictionaries.com/search?utf8=✓&filter=dictionary&query=$1"
	},
	{
		"la": "en",
		"l": "Oxford Dictionaries(North American English)",
		"u": "https://en.oxforddictionaries.com/search?utf8=✓&filter=noad&query=$1"
	},
	{
		"la": "en",
		"l": "Dictionary.com",
		"u": "http://www.dictionary.com/browse/$1?s=ts"
	},
	{
		"la": "en",
		"l": "Thesaurus.com",
		"u": "http://www.thesaurus.com/browse/$1?s=t"
	},
	{
		"la": "en",
		"l": "TheFreeDictionary.com",
		"u": "https://www.thefreedictionary.com/_/search.aspx?tab=1&SearchBy=0&Word=$1&TFDBy=0"
	},
	{
		"la": "en",
		"l": "Collins",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english&q=$1"
	},
	{
		"la": "en",
		"l": "Merriam-Webster",
		"u": "https://www.merriam-webster.com/dictionary/$1"
	},
	{
		"la": "en",
		"l": "YourDictionary.com",
		"u": "http://www.yourdictionary.com/$1?direct_search_result=yes"
	},
	{
		"la": "ja",
		"l": "ウィキペディア",
		"u": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
	},
	{
		"la": "ja",
		"l": "Google",
		"u": "https://www.google.co.jp/search?q=$1"
	},
	{
		"la": "ja",
		"l": "Google 翻訳 英語→日本語",
		"u": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1"
	},
	{
		"la": "ja",
		"l": "Google 翻訳 日本語→英語",
		"u": "https://translate.google.co.jp/?hl=ja&tab=TT#ja/en/$1"
	},
	{
		"la": "ja",
		"l": "Bing",
		"u": "https://www.bing.com/search?q=$1"
	},
	{
		"la": "ja",
		"l": "Yahoo!JAPAN",
		"u": "http://search.yahoo.co.jp/search?ei=UTF-8&p=$1"
	},
	{
		"la": "ja",
		"l": "Yahoo!JAPAN 辞書",
		"u": "https://dic.yahoo.co.jp/search/?fr=dic&stype=full&ei=UTF-8&p=$1"
	},
	{
		"la": "ja",
		"l": "weblio 辞書",
		"u": "https://www.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"la": "ja",
		"l": "weblio 類語辞典",
		"u": "https://thesaurus.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"la": "ja",
		"l": "weblio 対義語・反対語",
		"u": "https://thesaurus.weblio.jp/antonym/content_find?fixFmFocusType=&query=$1&searchType=exact"
	},
	{
		"la": "ja",
		"l": "weblio 英和辞典・和英辞典",
		"u": "https://ejje.weblio.jp/content_find?searchType=exact&query=$1"
	},
	{
		"la": "ja",
		"l": "weblio 日中・中日辞典",
		"u": "https://cjjc.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"la": "ja",
		"l": "weblio 日韓韓日辞典",
		"u": "https://kjjk.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"la": "ja",
		"l": "weblio 古語辞典",
		"u": "https://kobun.weblio.jp/content_find?query=$1&searchType=exact"
	},
	{
		"la": "ja",
		"l": "goo 辞書",
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?mode=0&kind=all&MT=$1"
	},
	{
		"la": "ja",
		"l": "goo 国語辞書",
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jn"
	},
	{
		"la": "ja",
		"l": "goo 類語辞書",
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=thsrs"
	},
	{
		"la": "ja",
		"l": "goo 英和・和英辞書",
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=1&kind=en"
	},
	{
		"la": "ja",
		"l": "goo 中日辞書",
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=cj"
	},
	{
		"la": "ja",
		"l": "goo 日中辞書",
		"u": "https://dictionary.goo.ne.jp/freewordsearcher.html?MT=$1&mode=0&kind=jc"
	},
	{
		"la": "ja",
		"l": "英辞郎 on the WEB",
		"u": "https://eow.alc.co.jp/search?q=$1"
	}
];
