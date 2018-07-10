const PRESET_OPTION_LIST = [
	{
		"la": "en",
		"l": "Wikipedia (en.wikipedia.org)",
		"u": "https://en.wikipedia.org/w/index.php?search=$1&title=Special:Search&go=Go"
	},
	{
		"la": "en",
		"l": "Wiktionary (en.wiktionary.org)",
		"u": "https://en.wiktionary.org/wiki/Special:Search?search=$1&go=Look+up"
	},
	{
		"la": "en",
		"l": "Google (www.google.com)",
		"u": "https://www.google.com/search?q=$1"
	},
	{
		"la": "en",
		"l": "Google Images",
		"u": "https://www.google.com/search?tbm=isch&q=$1"
	},
	{
		"la": "en",
		"l": "Google Videos",
		"u": "https://www.google.com/search?q=$1&tbm=vid"
	},
	{
		"la": "en ja zh",
		"l": "Bing",
		"u": "https://www.bing.com/search?q=$1"
	},
	{
		"la": "en",
		"l": "YAHOO!",
		"u": "https://search.yahoo.com/search?p=$1"
	},
	{
		"la": "en ja zh",
		"l": "DuckDuckGo",
		"u": "https://duckduckgo.com/?q=$1"
	},
	{
		"la": "en ja zh",
		"l": "DuckDuckGo Images",
		"u": "https://duckduckgo.com/?q=$1&iar=images"
	},
	{
		"la": "en ja zh",
		"l": "DuckDuckGo videos",
		"u": "https://duckduckgo.com/?q=$1&iar=videos"
	},
	{
		"la": "en ja zh",
		"l": "Ecosia",
		"u": "https://www.ecosia.org/search?q=$1"
	},
	{
		"la": "en ja zh",
		"l": "Ecosia Images",
		"u": "https://www.ecosia.org/images?q=$1"
	},
	{
		"la": "en ja zh",
		"l": "Ecosia Videos",
		"u": "https://www.ecosia.org/videos?q=$1"
	},
	{
		"la": "en ja zh",
		"l": "You Tube",
		"u": "https://www.youtube.com/results?search_query=$1"
	},
	{
		"la": "en ja zh",
		"l": "You Tube (+pronounce)",
		"u": "https://www.youtube.com/results?search_query=pronounce+$1"
	},
	{
		"la": "en",
		"l": "wordnik",
		"u": "https://www.wordnik.com/words/$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary",
		"u": "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-Spanish)",
		"u": "https://dictionary.cambridge.org/search/english-spanish/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-French)",
		"u": "https://dictionary.cambridge.org/search/english-french/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-German)",
		"u": "https://dictionary.cambridge.org/search/english-german/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-Indonesian)",
		"u": "https://dictionary.cambridge.org/search/english-indonesian/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-Italian)",
		"u": "https://dictionary.cambridge.org/search/english-italian/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-Polish)",
		"u": "https://dictionary.cambridge.org/search/english-polish/direct/?q=$1"
	},
	{
		"la": "en",
		"l": "Cambridge Dictionary(English-Portuguese)",
		"u": "https://dictionary.cambridge.org/search/english-portuguese/direct/?q=$1"
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
		"l": "Collins English-French",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english-french&q=$1"
	},
	{
		"la": "en",
		"l": "Collins French-English",
		"u": "https://www.collinsdictionary.com/search/?dictCode=french-english&q=$1"
	},
	{
		"la": "en",
		"l": "Collins English-German",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english-german&q=$1"
	},
	{
		"la": "en",
		"l": "Collins German-English",
		"u": "https://www.collinsdictionary.com/search/?dictCode=german-english&q=$1"
	},
	{
		"la": "en",
		"l": "Collins English-Spanish",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english-spanish&q=$1"
	},
	{
		"la": "en",
		"l": "Collins Spanish-English",
		"u": "https://www.collinsdictionary.com/search/?dictCode=spanish-english&q=$1"
	},
	{
		"la": "en",
		"l": "Collins English-Italian",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english-italian&q=$1"
	},
	{
		"la": "en",
		"l": "Collins Italian-English",
		"u": "https://www.collinsdictionary.com/search/?dictCode=italian-english&q=$1"
	},
	{
		"la": "en",
		"l": "Collins English-Chinese",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english-chinese&q=$1"
	},
	{
		"la": "en",
		"l": "Collins Chinese-English",
		"u": "https://www.collinsdictionary.com/search/?dictCode=chinese-english&q=$1"
	},
	{
		"la": "en",
		"l": "Collins English-Portuguese",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english-portuguese&q=$1"
	},
	{
		"la": "en",
		"l": "Collins Portuguese-English",
		"u": "https://www.collinsdictionary.com/search/?dictCode=portuguese-english&q=$1"
	},
	{
		"la": "en",
		"l": "Collins English-Hindi",
		"u": "https://www.collinsdictionary.com/search/?dictCode=english-hindi&q=$1"
	},
	{
		"la": "en",
		"l": "Collins Hindi-English",
		"u": "https://www.collinsdictionary.com/search/?dictCode=hindi-english&q=$1"
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
		"l": "Wikipedia (ja.wikipedia.org)",
		"u": "https://ja.wikipedia.org/wiki/Special:Search?go=Go&search=$1"
	},
	{
		"la": "ja",
		"l": "Wiktionary (ja.wiktionary.org)",
		"u": "https://ja.wiktionary.org/wiki/?search=$1"
	},
	{
		"la": "ja",
		"l": "Google (www.google.co.jp)",
		"u": "https://www.google.co.jp/search?q=$1"
	},
	{
		"la": "ja",
		"l": "Google 画像検索",
		"u": "https://www.google.co.jp/search?tbm=isch&q=$1"
	},
	{
		"la": "ja",
		"l": "Google 動画検索",
		"u": "https://www.google.co.jp/search?q=$1&tbm=vid"
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
	},
	{
		"la": "ja",
		"l": "韓国語 辞書 Kpedia",
		"u": "http://www.kpedia.jp/s/1/$1"
	},
	{
		"la": "ja",
		"l": "楽天ウェブ検索",
		"u": "https://websearch.rakuten.co.jp/WebIS?qt=$1"
	},
	{
		"la": "ja",
		"l": "経済用語基礎辞典",
		"u": "http://1joho.sakura.ne.jp/cgi/mt02/mt-search.cgi?IncludeBlogs=2&search=$1"
	},
	{
		"la": "ja",
		"l": "語源由来辞典",
		"u": "http://search.gogen-allguide.com/search.cgi?charset=utf8&q=$1"
	},
	{
		"la": "ja",
		"l": "e-Words IT用語辞典",
		"u": "http://e-words.jp/?q=$1"
	},
	{
		"la": "zh",
		"l": "维基百科 (zh.wikipedia.org)",
		"u": "https://zh.wikipedia.org/w/index.php?search=$1"
	},
	{
		"la": "zh",
		"l": "维基词典 (zh.wiktionary.org)",
		"u": "https://zh.wiktionary.org/w/index.php?search=$1"
	},
	{
		"la": "zh",
		"l": "Baidu百度",
		"u": "https://www.baidu.com/s?wd=$1"
	},
	{
		"la": "zh",
		"l": "YAHOO! (hk.yahoo.com)",
		"u": "https://hk.search.yahoo.com/search?p=$1"
	},
	{
		"la": "zh",
		"l": "Google(www.google.com.hk)",
		"u": "https://www.google.com.hk/search?q=$1"
	},
	{
		"la": "zh",
		"l": "Google Images",
		"u": "https://www.google.com.hk/search?q=$1&tbm=isch"
	},
	{
		"la": "zh",
		"l": "Google Videos",
		"u": "https://www.google.com.hk/search?q=$1&tbm=vid"
	}
];
