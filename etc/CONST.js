const CSS_PREFIX = "lessLaborGoToDictionary";
/* cl */
const LINK_LIST_STYLE_CLASSIC = "c";
const LINK_LIST_STYLE_DARK = "d";
/* f */
const LINK_LIST_FAVICON_NORMAL = "n";
const LINK_LIST_FAVICON_ONLY = "o";
/* ld */
const LINK_LIST_DIRECTION_VERTICAL = "v";
const LINK_LIST_DIRECTION_HORIZAONTAL = "h";
/* ls */
const LINK_LIST_SEPARATOR_VERTICAL = "v";
const LINK_LIST_SEPARATOR_HORIZONTAL = "h";
/* ca */
const LINK_LIST_ACTION_NORMAL = "n";
const LINK_LIST_ACTION_MOUSEOVER = "m";
const LINK_LIST_ACTION_MOUSECLICK = "c";

const DEFAULT_LOCALE = "en";

const API_SWITCH_DISABLED = "";
const API_SWITCH_ENABLED = "1";
const API_SERVICE_CODE_NONE = "-";
const API_SERVICE_NONE = null;
const API_SERVICE = {
	"de": "https://de.wiktionary.org",
	"en": "https://en.wiktionary.org",
	"fr": "https://fr.wiktionary.org",
	"ja": "https://ja.wiktionary.org",
	"ru": "https://ru.wiktionary.org",
	"zh": "https://zh.wiktionary.org"
};
const API_SERVICE_PROPERTY = {
	"https://de.wiktionary.org":{
		"defaultLanguage": ["Deutsch","Englisch"],
		"namespace":"Kategorie",
		"langCat": "Kategorie:Sprachen",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":".+\\(",
		"languageBottomRegex":"\\)$",
		"cutOut": "Bedeutungen:",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://en.wiktionary.org":{
		"defaultLanguage": ["English"],
		"namespace":"Category",
		"langCat": "Category:All_languages",
		"sectionHeading": "h2.in-block",
		"followed": "language","//":"https://en.wiktionary.org/wiki/Wiktionary:Languages#Finding_and_organising_terms_in_a_language",
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://fr.wiktionary.org":{
		"defaultLanguage": ["français","anglais"],
		"namespace":"Catégorie",
		"langCat": "Catégorie:Langues",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://ja.wiktionary.org":{
		"defaultLanguage": ["日本語","英語"],
		"namespace":"カテゴリ",
		"langCat": "カテゴリ:言語",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://ru.wiktionary.org":{
		"defaultLanguage": ["Русский","Английский"],
		"namespace":"Категория",
		"langCat": "Категория:Алфавитный_список_языков",
		"sectionHeading": "h1.in-block",
		"followed": "язык",
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": "/w/api.php"
	},
	"https://zh.wiktionary.org":{
		"defaultLanguage": ["汉语","英语"],
		"namespace":"Category",
		"langCat": "分类:所有语言",
		"sectionHeading": "h2.in-block",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":false,
		"path": "/w/api.php"
	}
};
const PAGE_NOT_FOUND_ERROR = "page not found";
const CONNECTION_ERROR = "connection error";
const SERVER_ERROR = "server error";
const APPLICATION_ERROR = "application error";
const HTTP_NG = "0";
const HTTP_200_OK = "200";
const HTTP_206_PARTIAL = "206";
