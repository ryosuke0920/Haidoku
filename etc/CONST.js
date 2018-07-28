const CSS_PREFIX = "lessLaborGoToDictionary";
/* cl */
const LINK_LIST_STYLE_CLASSIC = "c";
const LINK_LIST_STYLE_DARK = "d";
/* ca */
const LINK_LIST_ACTION_NORMAL = "n";
const LINK_LIST_ACTION_MOUSEOVER = "m";
const LINK_LIST_ACTION_MOUSECLICK = "c";

const FAVICON_NODATA = "nodata";

const DEFAULT_LOCALE = "en";

const API_SERVICE = {
	"en": "https://en.wiktionary.org",
	"ja": "https://ja.wiktionary.org"
};
const API_SERVICE_PROPERTY = {
	"https://en.wiktionary.org":{
		"defaultLanguage": ["English"],
		"namespace":"Category",
		"langCat": "Category:All_languages",
		"followed": "language","//":"https://en.wiktionary.org/wiki/Wiktionary:Languages#Finding_and_organising_terms_in_a_language",
		"reduceSection": [
			new RegExp("^Etymology"),new RegExp("^Synonyms"),new RegExp("^Hyponyms"),
			new RegExp("^Derived terms"),new RegExp("^Related terms"),new RegExp("^Translations"),
			new RegExp("^References"),new RegExp("^Further reading"),new RegExp("^Anagrams")
		],
		"path": "/w/api.php"
	},
	"https://ja.wiktionary.org":{
		"defaultLanguage": ["英語"],
		"namespace":"カテゴリ",
		"langCat": "カテゴリ:言語",
		"followed": null,
		"reduceSection": [
			new RegExp("^関連語"),new RegExp("^上位語"),new RegExp("^下位語"),new RegExp("^同族語"),new RegExp("^複合語"),
			new RegExp("^同系語"),new RegExp("^語源"),new RegExp("^派生語"),new RegExp("^対義語"),new RegExp("^熟語"),
			new RegExp("^翻訳"),new RegExp("^類義語"),new RegExp("^参照"),new RegExp("^異綴"),new RegExp("^アナグラム"),
			new RegExp("^異表記"),new RegExp("^訳語"),new RegExp("^同音異義語"),new RegExp("^典拠")
		],
		"path": "/w/api.php"
	}
};
