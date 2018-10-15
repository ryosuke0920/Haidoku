const CSS_PREFIX = "lessLaborGoToDictionary";
const LINK_NODE_PADDING = 5;
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

const DOMAIN_MAX_LENGTH = 253;

const DEFAULT_AUTO_VIEW_FLAG = true;
const DEFAULT_SHIFT_KEY_VIEW_FLAG = false;
const DEFAULT_CTRL_KEY_VIEW_FLAG = false;
const DEFAULT_ENABLE_VALUE = "1";
const DEFAULT_OPTION_LIST_ON_GET = [];
const DEFAULT_DOMAIN_LIST = [];
const DEFAULT_MEANING_VALUE = true;

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
		"defaultLanguage": ["English language"],
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
		"defaultLanguage": ["Русский язык","Английский язык"],
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

const WIDGET_STYLE = `
* {
	padding: 0;
	margin: 0;
}
#lessLaborGoToDictionary-widget {
	display: block;
	position: absolute;
	z-index: 2147483646;
	background-color: white;
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;
	overflow: auto;
	resize: both;
	user-select: none;
	-moz-user-select: none;
	font-family: sans-serif;
	font-size: 1em;
}
#lessLaborGoToDictionary-widget.lessLaborGoToDictionary-hide {
	display: none;
}
#lessLaborGoToDictionary-widget.lessLaborGoToDictionary-dark {
	border-top-right-radius: 5px;
	border-bottom-left-radius: 5px;
	background: linear-gradient(to bottom right, #404040, #202020);
}
#lessLaborGoToDictionary-widget.lessLaborGoToDictionary-stopper {
	width: 30px !important;
	height: 30px !important;
	padding: 0px !important;
	overflow: hidden;
	resize: none;
	background: none;
	background-color: transparent;
	border-radius: 15px;
}
#lessLaborGoToDictionary-cover {
	display: none;
	cursor: pointer;
	width: 30px;
	height: 30px;
}
.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-cover {
	display: block;
}
#lessLaborGoToDictionary-menu {
	height: 22px;
	line-height: 0;
	white-space: nowrap;
	margin-bottom: 3px;
}
.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-menu {
	display: none;
}
.lessLaborGoToDictionary-buttonIcon {
	display: inline-block;
	height: 16px;
	width: 16px;
	cursor: pointer;
	background-size: cover;
	margin-right: 5px;
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;
	user-select: none;
	-moz-user-select: none;
}
#lessLaborGoToDictionary-move {
	cursor: move;
}
.lessLaborGoToDictionary-separator #lessLaborGoToDictionary-grid {
	display: grid;
	grid-template-columns: min-content minmax(100px,auto);
}
.lessLaborGoToDictionary-stopper #lessLaborGoToDictionary-grid {
	display: none;
}
#lessLaborGoToDictionary-container {
	margin-bottom: 3px;
}
.lessLaborGoToDictionary-list {
	display: block;
	white-space: nowrap;
	margin-right: 5px;
}
.lessLaborGoToDictionary-inline .lessLaborGoToDictionary-list {
	display: inline;
	white-space: normal;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-list {
	color: white;
	border-top: 2px solid #505050;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-list:hover {
	background-color:#505050;
}
.lessLaborGoToDictionary-anchor {
	display: block;
	text-decoration: none;
}
.lessLaborGoToDictionary-inline .lessLaborGoToDictionary-anchor {
	display: inline;
}
.lessLaborGoToDictionary-anchor:hover {
	text-decoration: underline;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor {
	color: white;
	text-decoration: none;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor:visited {
	color: #B0B0B0;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor:hover {
	text-decoration: none;
}
.lessLaborGoToDictionary-dark .lessLaborGoToDictionary-anchor:active {
	color: #F07070;
}
.lessLaborGoToDictionary-favicon {
	width: 16px;
	height: 16px;
	margin: auto;
}
.lessLaborGoToDictionary-label {
	cursor: pointer;
	margin-left: 5px;
}
.lessLaborGoToDictionary-mini .lessLaborGoToDictionary-label {
	display: none;
}
#lessLaborGoToDictionary-apiContent {
	border-radius: 10px;
	font-family: 'Helvetica Neue','Helvetica','Nimbus Sans L','Arial','Liberation Sans',sans-serif;
	font-size: 14px;
	user-select: text;
	-moz-user-select: text;
}
#lessLaborGoToDictionary-apiContent a {
	color: #3366cc;
	text-decoration: none;
}
#lessLaborGoToDictionary-apiContent a:visited {
	color: #551a8b;
}
#lessLaborGoToDictionary-apiContent a:hover {
	text-decoration: underline;
}
#lessLaborGoToDictionary-apiContent a:active {
	color: #ee0000;
}
#lessLaborGoToDictionary-apiContent.lessLaborGoToDictionary-hide {
	display: none;
}
#lessLaborGoToDictionary-apiContent > * {
	border-right: solid 1px gray;
	border-left: solid 1px gray;
	background-color: white;
	padding:5px 10px;
}
#lessLaborGoToDictionary-apiHeader {
	position: relative;
	border-top: solid 1px gray;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-color:#eaecf0;
	display: flex;
}
#lessLaborGoToDictionary-apiFooter {
	border-bottom: solid 1px gray;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	font-size:0.9em;
	background-color:#eaecf0;
}
#lessLaborGoToDictionary-apiHeaderTextArea {
	display: block;
	flex: auto;
	min-width: 0;
}
#lessLaborGoToDictionary-apiHeaderTextArea > * {
	display:block;
	min-width: 0;
}
#lessLaborGoToDictionary-apiHeaderTextArea * {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.lessLaborGoToDictionary-checkboxButton {
	position: relative;
	background-color: gray;
	display: inline-block;
	height: 20px;
	width: 30px;
	min-width: 30px;
	border-radius: 15px;
	right: 0.5em;
	cursor: pointer;
	user-select: none;
	-moz-user-select: none;
}
.lessLaborGoToDictionary-circle {
	position: absolute;
	background: linear-gradient(to bottom, #FFFFFF, #F0F0F0 );
	display: inline-block;
	border-radius: 8px;
	height: 16px;
	width: 16px;
	top: 2px;
	left: 2px;
	cursor: pointer;
}
.lessLaborGoToDictionary-checkboxButton[data-checked="1"] {
	background-color: #5bd94d;
}
.lessLaborGoToDictionary-checkboxButton[data-checked="1"] .lessLaborGoToDictionary-circle {
	left: unset;
	right: 2px;
}
#lessLaborGoToDictionary-apiHeaderTextArea {
	font-size: 1.2em;
}
#lessLaborGoToDictionary-history.lessLaborGoToDictionary-hide,
#lessLaborGoToDictionary-historyDone.lessLaborGoToDictionary-hide {
	display: none;
}
#lessLaborGoToDictionary-history {
	margin-right: 10px;
}
#lessLaborGoToDictionary-historyDone {
	margin-right: 10px;
	cursor: auto;
}
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiTitleWrapper,
.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-apiTitleWrapper {
	display: none;
}
#lessLaborGoToDictionary-apiTitle {
	font-weight: bold;
	cursor: pointer;
	color: #3366cc;
}
#lessLaborGoToDictionary-apiTitle:visited {
	color: #551a8b;
}
#lessLaborGoToDictionary-apiTitle:hover {
	text-decoration: underline;
}
#lessLaborGoToDictionary-apiTitle:active {
	color: #ee0000;
}
#lessLaborGoToDictionary-nowLoadingMsg {
	display: none;
}
.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-nowLoadingMsg {
	display: block;
}
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-nowLoadingMsg {
	display: none;
}
#lessLaborGoToDictionary-apiOffMsg {
	display: none;
}
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiOffMsg {
	display: block;
}
#lessLaborGoToDictionary-apiLoading {
	padding: 0;
	display: none;
	height: 5em;
}
.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-apiLoading {
	display: block;
}
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiLoading {
	display: none;
}
#lessLaborGoToDictionary-apiLoadingContent {
	background-repeat: no-repeat;
	background-position: center;
	height:100%;
	animation: loading 2s ease-out 0s infinite running;
	background-size: 0%;
	opacity: 1;
}
@keyframes loading {
	0%{
		background-size: 0%;
		opacity: 1;
	}
	50%{
		background-size: 100%;
		opacity: 0;
	}
	100%{
		background-size: 100%;
		opacity: 0;
	}
}
#lessLaborGoToDictionary-apiOff {
	display: none;
	font-size: 0.9em;
}
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiOff {
	display: block;
}
.lessLaborGoToDictionary-warning {
	color: red;
	font-weight: bold;
}
.lessLaborGoToDictionary-loading #lessLaborGoToDictionary-apiBody,
.lessLaborGoToDictionary-apiDisabled #lessLaborGoToDictionary-apiBody {
	display: none;
}
#lessLaborGoToDictionary-apiBody h1,
#lessLaborGoToDictionary-apiBody h2,
#lessLaborGoToDictionary-apiBody h3,
#lessLaborGoToDictionary-apiBody h4,
#lessLaborGoToDictionary-apiBody h5,
#lessLaborGoToDictionary-apiBody h6,
#lessLaborGoToDictionary-apiBody div,
#lessLaborGoToDictionary-apiBody p,
#lessLaborGoToDictionary-apiBody ol,
#lessLaborGoToDictionary-apiBody ul,
#lessLaborGoToDictionary-apiBody dl,
#lessLaborGoToDictionary-apiBody dt,
#lessLaborGoToDictionary-apiBody dd,
#lessLaborGoToDictionary-apiBody table {
	margin-top: 0.5em;
	margin-bottom: 1em;
}
#lessLaborGoToDictionary-apiBody h1 {
	font-size: 1.6em;
}
#lessLaborGoToDictionary-apiBody h2 {
	font-size: 1.5em;
}
#lessLaborGoToDictionary-apiBody h3 {
	font-size: 1.3em;
}
#lessLaborGoToDictionary-apiBody h4 {
	font-size: 1.2em;
}
#lessLaborGoToDictionary-apiBody h5 {
	font-size: 1.1em;
}
#lessLaborGoToDictionary-apiBody h6 {
	font-size: 1em;
}
#lessLaborGoToDictionary-apiBody ul,
#lessLaborGoToDictionary-apiBody ol {
	margin-left: 1em;
}
#lessLaborGoToDictionary-apiBody hr {
	border: none;
}
#lessLaborGoToDictionary-apiBody table {
	border-collapse: collapse;
}
#lessLaborGoToDictionary-apiBody th,
#lessLaborGoToDictionary-apiBody td {
	padding: 5px;
	text-align: left;
}
#lessLaborGoToDictionary-apiBody caption {
	text-align: left;
}
#lessLaborGoToDictionary-apiBody table.wikitable > tr > th,
#lessLaborGoToDictionary-apiBody table.wikitable > * > tr > th,
#lessLaborGoToDictionary-apiBody table.wikitable > tr > td,
#lessLaborGoToDictionary-apiBody table.wikitable > * > tr > td {
	border: 1px solid rgba(84,89,93,0.3);
}
#lessLaborGoToDictionary-apiBody table.wikitable > tr > th,
#lessLaborGoToDictionary-apiBody table.wikitable > * > tr > th {
	background-color: #eaecf0;
	font-weight: bold;
}
#lessLaborGoToDictionary-apiBody h1.in-block,
#lessLaborGoToDictionary-apiBody h2.in-block,
#lessLaborGoToDictionary-apiBody h3.in-block,
#lessLaborGoToDictionary-apiBody h4.in-block,
#lessLaborGoToDictionary-apiBody h5.in-block,
#lessLaborGoToDictionary-apiBody h6.in-block {
	border-bottom: solid 2px black;
}
#lessLaborGoToDictionary-apiBody h2.in-block::before {
	content: "# ";
}
#lessLaborGoToDictionary-apiBody .mw-empty-elt {
	display: none;
}
#lessLaborGoToDictionary-apiBody a.new {
	color: #dd3333;
}
#lessLaborGoToDictionary-apiBody table.wikitable {
	border: 1px solid black;
}
#lessLaborGoToDictionary-apiBody table.audiotable td,
#lessLaborGoToDictionary-apiBody table.audiotable th {
	border: none;
}
#lessLaborGoToDictionary-apiBody .NavFrame > .NavHead {
	cursor: pointer;
	background-color: #c0c0f0;
}
#lessLaborGoToDictionary-apiBody .NavFrame > .NavHead:hover {
	background-color: #c0f0c0;
}
#lessLaborGoToDictionary-apiBody .lessLaborGoToDictionary-play {
	display: inline-block;
	background: transparent;
	box-sizing: border-box;
	width: 0;
	height: 20px;
	border-color: transparent transparent transparent #202020;
	border-style: solid;
	border-width: 10px 0px 10px 20px;
	cursor: pointer;
	vertical-align: middle;
	margin: 2px;
}
#lessLaborGoToDictionary-apiBody div.lessLaborGoToDictionary-apiWarningMessage {
	padding: 2px;
	border: solid 1px red;
	border-radius: 5px;
	background-color: rgba(255,0,0,0.65);
	color: white;
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;
}
`;
