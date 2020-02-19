const CSS_PREFIX = "hdk";
const LINK_NODE_PADDING = 0;
const LINK_LIST_STYLE_CLASSIC = "c";
const LINK_LIST_STYLE_DARK = "d";
const LINK_LIST_FAVICON_NORMAL = "n";
const LINK_LIST_FAVICON_ONLY = "o";
const LINK_LIST_DIRECTION_VERTICAL = "v";
const LINK_LIST_DIRECTION_HORIZAONTAL = "h";
const LINK_LIST_SEPARATOR_VERTICAL = "v";
const LINK_LIST_SEPARATOR_HORIZONTAL = "h";
const LINK_LIST_ACTION_NORMAL = "n";
const LINK_LIST_ACTION_MOUSEOVER = "m";
const LINK_LIST_ACTION_MOUSECLICK = "c";
const DEFAULT_WIKTIONARY_HISTORY_SAVE_VALUE = true;
const DEFAULT_WIKIPEDIA_HISTORY_SAVE_VALUE = true;
const DOMAIN_MAX_LENGTH = 253;
const DOMAIN_LIST_MAX_SIZE = 50;
const DEFAULT_AUTO_VIEW_FLAG = true;
const DEFAULT_SHIFT_KEY_VIEW_FLAG = false;
const DEFAULT_CTRL_KEY_VIEW_FLAG = false;
const DEFAULT_ENABLE_VALUE = "1";
const DEFAULT_OPTION_LIST_ON_GET = [];
const DEFAULT_DOMAIN_LIST = [];
const DEFAULT_MEANING_VALUE = false;
const LINK_LIST_DEFAULT_STYLE = LINK_LIST_STYLE_CLASSIC;
const DEFAULT_LOCALE = "en";
const FOOTER_CONTENT = "Provided by Wiktionary under Creative Commons Attribution-Share Alike 3.0; additional terms may apply.";//https://www.mediawiki.org/wiki/API:Licensing
const FOOTER_CONTENT2 = "Provided by Wikipedia under Creative Commons Attribution-Share Alike 3.0; additional terms may apply.";//https://www.mediawiki.org/wiki/API:Licensing
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
	"zh": "https://zh.wiktionary.org",
	"w-de": "https://de.wikipedia.org",
	"w-en": "https://en.wikipedia.org",
	"w-fr": "https://fr.wikipedia.org",
	"w-ja": "https://ja.wikipedia.org",
	"w-ru": "https://ru.wikipedia.org",
	"w-zh": "https://zh.wikipedia.org"
};
const API_SERVICE_WIKIPEDIA_TYPE = "p";
const API_SERVICE_WIKTIONARY_TYPE = "t";
const API_SERVICE_PATH = "/w/api.php";
const API_SERVICE_PROPERTY = {
	"https://de.wiktionary.org":{
		"key": "https://de.wiktionary.org",
		"type": API_SERVICE_WIKTIONARY_TYPE,
		"wiki": new RegExp("^https://de\\.wiktionary\\.org/wiki/(.+)"),
		"defaultLanguage": ["Deutsch","Englisch"],
		"namespace":"Kategorie",
		"langCat": "Kategorie:Sprachen",
		"sectionHeading": "h2.section-heading",
		"followed": null,
		"languageTopRegex":".+\\(",
		"languageBottomRegex":"\\)$",
		"cutOut": "Bedeutungen:",
		"prefixFlag":true,
		"path": API_SERVICE_PATH
	},
	"https://en.wiktionary.org":{
		"key": "https://en.wiktionary.org",
		"type": API_SERVICE_WIKTIONARY_TYPE,
		"wiki": new RegExp("^https://en\\.wiktionary\\.org/wiki/(.+)"),
		"defaultLanguage": ["English language"],
		"namespace":"Category",
		"langCat": "Category:All_languages",
		"sectionHeading": "h2.section-heading",
		"followed": "language","//":"https://en.wiktionary.org/wiki/Wiktionary:Languages#Finding_and_organising_terms_in_a_language",
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": API_SERVICE_PATH
	},
	"https://fr.wiktionary.org":{
		"key": "https://fr.wiktionary.org",
		"type": API_SERVICE_WIKTIONARY_TYPE,
		"wiki": new RegExp("^https://fr\\.wiktionary\\.org/wiki/(.+)"),
		"defaultLanguage": ["français","anglais"],
		"namespace":"Catégorie",
		"langCat": "Catégorie:Langues",
		"sectionHeading": "h2.section-heading",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": API_SERVICE_PATH
	},
	"https://ja.wiktionary.org":{
		"key": "https://ja.wiktionary.org",
		"type": API_SERVICE_WIKTIONARY_TYPE,
		"wiki": new RegExp("^https://ja\\.wiktionary\\.org/wiki/(.+)"),
		"defaultLanguage": ["日本語","英語"],
		"namespace":"カテゴリ",
		"langCat": "カテゴリ:言語",
		"sectionHeading": "h2.section-heading",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": API_SERVICE_PATH
	},
	"https://ru.wiktionary.org":{
		"key": "https://ru.wiktionary.org",
		"type": API_SERVICE_WIKTIONARY_TYPE,
		"wiki": new RegExp("^https://ru\\.wiktionary\\.org/wiki/(.+)"),
		"defaultLanguage": ["Русский язык","Английский язык"],
		"namespace":"Категория",
		"langCat": "Категория:Алфавитный_список_языков",
		"sectionHeading": "h1.section-heading",
		"followed": "язык",
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":true,
		"path": API_SERVICE_PATH
	},
	"https://zh.wiktionary.org":{
		"key": "https://zh.wiktionary.org",
		"type": API_SERVICE_WIKTIONARY_TYPE,
		"wiki": new RegExp("^https://zh\\.wiktionary\\.org/wiki/(.+)"),
		"defaultLanguage": ["汉语","英语"],
		"namespace":"Category",
		"langCat": "分类:所有语言",
		"sectionHeading": "h2.section-heading",
		"followed": null,
		"languageTopRegex":"^",
		"languageBottomRegex":"$",
		"prefixFlag":false,
		"path": API_SERVICE_PATH
	},
	"https://de.wikipedia.org":{
		"key": "https://de.wikipedia.org",
		"type": API_SERVICE_WIKIPEDIA_TYPE,
		"wiki": new RegExp("^https://de\\.wikipedia\\.org/wiki/(.+)"),
		"path": API_SERVICE_PATH
	},
	"https://en.wikipedia.org":{
		"key": "https://en.wikipedia.org",
		"type": API_SERVICE_WIKIPEDIA_TYPE,
		"wiki": new RegExp("^https://en\\.wikipedia\\.org/wiki/(.+)"),
		"path": API_SERVICE_PATH
	},
	"https://fr.wikipedia.org":{
		"key": "https://fr.wikipedia.org",
		"type": API_SERVICE_WIKIPEDIA_TYPE,
		"wiki": new RegExp("^https://fr\\.wikipedia\\.org/wiki/(.+)"),
		"path": API_SERVICE_PATH
	},
	"https://ja.wikipedia.org":{
		"key": "https://ja.wikipedia.org",
		"type": API_SERVICE_WIKIPEDIA_TYPE,
		"wiki": new RegExp("^https://ja\\.wikipedia\\.org/wiki/(.+)"),
		"path": API_SERVICE_PATH
	},
	"https://ru.wikipedia.org":{
		"key": "https://ru.wikipedia.org",
		"type": API_SERVICE_WIKIPEDIA_TYPE,
		"wiki": new RegExp("^https://ru\\.wikipedia\\.org/wiki/(.+)"),
		"path": API_SERVICE_PATH
	},
	"https://zh.wikipedia.org":{
		"key": "https://zh.wikipedia.org",
		"type": API_SERVICE_WIKIPEDIA_TYPE,
		"wiki": new RegExp("^https://zh\\.wikipedia\\.org/wiki/(.+)"),
		"path": API_SERVICE_PATH
	}
};
const PAGE_NOT_FOUND_ERROR = "page not found";
const CONNECTION_ERROR = "connection error";
const SERVER_ERROR = "server error";
const HTTP_NG = "0";
const HTTP_200_OK = "200";
const HTTP_206_PARTIAL = "206";

const WIDGET_STYLE = `
* {
	padding: 0;
	margin: 0;
}
#hdk-widget {
	background-color: #F0F0F0;
	display: block;
	position: absolute;
	z-index: 2147483646;
	box-shadow: 0 0 2px black;
	overflow: auto;
	resize: both;
	user-select: none;
	-moz-user-select: none;
	font-family: sans-serif;
	font-size: 1em;
}
#hdk-widget.hdk-hide {
	display: none;
}
#hdk-widget.hdk-dark {
	background-color: #202020;
}
#hdk-widget.hdk-stopper {
	width: 30px !important;
	height: 30px !important;
	padding: 0px !important;
	overflow: hidden;
	resize: none;
	background: none;
	background-color: transparent;
	box-shadow: none;
}
#hdk-cover {
	display: none;
	cursor: pointer;
	width: 30px;
	height: 30px;
	position: absolute;
	top: 0;
}
.hdk-stopper #hdk-cover {
	display: block;
}
#hdk-menu {
	background: linear-gradient(#FFFFFF, #F0F0F0);
	white-space: nowrap;
	padding: 3px;
	height: 22px;
	border-bottom: solid 1px #808080;
	position: sticky;
	top: 0;
	z-index: 1;
}
.hdk-dark #hdk-menu {
	background: linear-gradient(#404040, #202020);
}
#hdk-menu > * {
	margin-right: 3px;
}
.hdk-stopper #hdk-menu {
	display: none;
}
.hdk-buttonIcon {
	display: inline-block;
	height: 20px;
	min-height: 20px;
	width: 20px;
	min-width: 20px;
	cursor: pointer;
	background-size: cover;
	user-select: none;
	-moz-user-select: none;
}
.hdk-textButton {
	display: none;
	color: #808080;
	font-weight: bold;
	cursor: pointer;
}
.hdk-enableWiktionary #hdk-wiktionaryButton,
.hdk-enableWikipedia #hdk-wikipediaButton {
	display: inline;
}
.hdk-selectWiktionary #hdk-wiktionaryButton,
.hdk-selectWikipedia #hdk-wikipediaButton {
	border-bottom: solid 2px #808080;
}
#hdk-move {
	cursor: move;
}
#hdk-grid {
}
.hdk-separator #hdk-grid {
	display: grid;
	grid-template-columns: min-content minmax(200px,auto);
	grid-template-rows: min-content 1fr;
}
.hdk-stopper #hdk-grid {
	display: none;
}
#hdk-footer {
	display: none;
	border-top: solid 1px #808080;
	background: linear-gradient(#FFFFFF, #F0F0F0);
	height: 22px;
}
.hdk-enableWiktionary #hdk-footer,
.hdk-enableWikipedia #hdk-footer {
	display: block;
}
.hdk-stopper #hdk-footer {
	display: none;
}
.hdk-dark #hdk-footer {
	background: linear-gradient(#404040, #202020);
}
#hdk-container {
	background: linear-gradient(#FFFFFF, #F0F0F0);
	padding: 3px;
}
.hdk-dark #hdk-container {
	background: linear-gradient(#404040, #202020);
}
.hdk-list {
	display: block;
	white-space: nowrap;
}
.hdk-inline .hdk-list {
	display: inline;
	white-space: normal;
	margin-right: 3px;
}
.hdk-dark .hdk-list {
}
.hdk-dark .hdk-list:hover {
	background-color:#505050;
}
.hdk-anchor {
	display: block;
	text-decoration: none;
}
.hdk-inline .hdk-anchor {
	display: inline;
}
.hdk-anchor:hover {
	text-decoration: underline;
}
.hdk-dark .hdk-anchor {
	color: white;
	text-decoration: none;
}
.hdk-dark .hdk-anchor:visited {
	color: #B0B0B0;
}
.hdk-dark .hdk-anchor:hover {
	text-decoration: none;
}
.hdk-dark .hdk-anchor:active {
	color: #F07070;
}
.hdk-favicon {
	width: 16px;
	height: 16px;
}
.hdk-label {
	cursor: pointer;
	margin-left: 5px;
}
.hdk-mini .hdk-label {
	display: none;
}
#hdk-apiContent {
	display: none;
	border-top: solid 1px #808080;
	position: relative;
	background-color: white;
	font-family: 'Helvetica Neue','Helvetica','Nimbus Sans L','Arial','Liberation Sans',sans-serif;
	font-size: 14px;
	user-select: text;
	-moz-user-select: text;
}
.hdk-dark #hdk-apiContent {
	background-color: #DDDDDD;
}
.hdk-separator #hdk-apiContent {
	border-top: none;
	border-left: solid 1px #808080;
	grid-column-start: 2;
	grid-column-end: 3;
	grid-row-start: 1;
	grid-row-end: 3;
}
.hdk-enableWiktionary #hdk-apiContent,
.hdk-enableWikipedia #hdk-apiContent {
	display: block;
}
#hdk-apiContent a {
	color: #3366cc;
	text-decoration: none;
}
#hdk-apiContent a:visited {
	color: #551a8b;
}
#hdk-apiContent a:hover {
	text-decoration: underline;
}
#hdk-apiContent a:active {
	color: #ee0000;
}
#hdk-apiHeader {
	background: linear-gradient(#FFFFFF, #F0F0F0);
	padding: 3px;
	display: flex;
	white-space: nowrap;
	overflow: hidden;
}
.hdk-dark #hdk-apiHeader {
	background: linear-gradient(#404040, #202020);
}
#hdk-apiHeader > * {
	margin-right: 5px;
}
.hdk-wikiContent {
	min-height: 5em;
	position: relative;
	border-top: solid 1px #808080;
}
.hdk-hide.hdk-wikiContent,
.hdk-apiDisabled .hdk-wikiContent {
	display: none !important;
}
.hdk-checkboxButton {
	position: relative;
	background-color: #808080;
	display: inline-block;
	height: 20px;
	width: 30px;
	min-width: 30px;
	border-radius: 15px;
	cursor: pointer;
	user-select: none;
	-moz-user-select: none;
}
.hdk-circle {
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
.hdk-checkboxButton[data-checked="1"] {
	background-color: #5bd94d;
}
.hdk-checkboxButton[data-checked="1"] .hdk-circle {
	left: unset;
	right: 2px;
}
.hdk-apiTitleBox {
	font-size: 14px;
	padding: 5px;
}
.hdk-apiTitleBox.hdk-hide {
	display: none;
}
.hdk-unmatchText {
	margin-bottom: 0.5em;
}
.hdk-unmatchText.hdk-hide {
	display: none;
}
.hdk-apiWarningMessage {
	padding: 2px;
	border: solid 1px red;
	border-radius: 5px;
	background-color: rgba(255,0,0,0.65);
	color: white;
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;
}
.hdk-apiWarningMessage.hdk-orange {
	border: solid 1px orange;
	background-color: rgba(255,165,0,0.65);
	color: #7F5200;
}
.hdk-historyButton {
	vertical-align: middle;
	margin-right: 5px;
}
#hdk-historyDone, #hdk-historyDone2 {
	cursor: auto;
}
.hdk-historyButton.hdk-hide {
		display: none;
}
#hdk-apiOffMsg {
	display: none;
}
.hdk-apiDisabled #hdk-apiOffMsg {
	display: block;
}
.hdk-linkageMessage {
	margin-bottom: 1em;
}
.hdk-apiLoading {
	display: none;
	position: absolute;
	top: 5px;
	right: 5px;
}
.hdk-separator .hdk-apiLoading {
}
.hdk-loading .hdk-apiLoading {
	display: block;
}
.hdk-apiDisabled .hdk-apiLoading {
	display: none;
}
.hdk-apiLoadingContent {
	background-repeat: no-repeat;
	background-position: center;
	height: 20px;
	width: 20px;
	border-radius: 10px;
	background-color: #5bd94d;
	animation: loading 0.2s linear infinite running;
}
@keyframes loading {
	0%{
		visibility: visible;
	}
	50%{
		visibility: hidden;
	}
	100%{
		visibility: hidden;
	}
}
#hdk-apiOff {
	border-top: solid 1px #808080;
	display: none;
	padding: 3px;
}
.hdk-apiDisabled #hdk-apiOff {
	display: block;
}
.hdk-apiWikiText {
	padding: 5px;
}
.hdk-apiWikiText h1,
.hdk-apiWikiText h2,
.hdk-apiWikiText h3,
.hdk-apiWikiText h4,
.hdk-apiWikiText h5,
.hdk-apiWikiText h6,
.hdk-apiWikiText div,
.hdk-apiWikiText p,
.hdk-apiWikiText ol,
.hdk-apiWikiText ul,
.hdk-apiWikiText dl,
.hdk-apiWikiText dt,
.hdk-apiWikiText dd,
.hdk-apiWikiText table {
	margin-top: 0.5em;
	margin-bottom: 1em;
}
.hdk-apiWikiText h1 {
	font-size: 1.6em;
}
.hdk-apiWikiText h2 {
	font-size: 1.5em;
}
.hdk-apiWikiText h3 {
	font-size: 1.3em;
}
.hdk-apiWikiText h4 {
	font-size: 1.2em;
}
.hdk-apiWikiText h5 {
	font-size: 1.1em;
}
.hdk-apiWikiText h6 {
	font-size: 1em;
}
.hdk-apiWikiText ul,
.hdk-apiWikiText ol {
	list-style-position: inside;
}
.hdk-apiWikiText hr {
	border: none;
}
.hdk-apiWikiText table {
	border-collapse: collapse;
}
.hdk-apiWikiText th,
.hdk-apiWikiText td {
	padding: 5px;
	text-align: left;
}
.hdk-apiWikiText caption {
	text-align: left;
}
.hdk-apiWikiText table.wikitable > tr > th,
.hdk-apiWikiText table.wikitable > * > tr > th,
.hdk-apiWikiText table.wikitable > tr > td,
.hdk-apiWikiText table.wikitable > * > tr > td {
	border: 1px solid rgba(84,89,93,0.3);
}
.hdk-apiWikiText table.wikitable > tr > th,
.hdk-apiWikiText table.wikitable > * > tr > th {
	background-color: #eaecf0;
	font-weight: bold;
}
.hdk-apiWikiText h1.in-block,
.hdk-apiWikiText h2.in-block,
.hdk-apiWikiText h3.in-block,
.hdk-apiWikiText h4.in-block,
.hdk-apiWikiText h5.in-block,
.hdk-apiWikiText h6.in-block {
	border-bottom: solid 2px black;
}
.hdk-apiWikiText h2.in-block::before {
	content: "# ";
}
.hdk-apiWikiText .mw-empty-elt {
	display: none;
}
#hdk-apiContent .hdk-apiWikiText a.new {
	color: #dd3333;
}
.hdk-apiWikiText table.wikitable {
	border: 1px solid black;
}
.hdk-apiWikiText table.audiotable td,
.hdk-apiWikiText table.audiotable th {
	border: none;
}
.hdk-apiWikiText .NavFrame > .NavHead {
	cursor: pointer;
	background-color: #c0c0f0;
}
.hdk-apiWikiText .NavFrame > .NavHead:hover {
	background-color: #c0f0c0;
}
.hdk-apiWikiText .hdk-audioControl {
	display: inline-block;
	background-color: white;
	padding: 2px;
	border-radius: 2px;
}
.hdk-apiWikiText .hdk-audioControl > *{
	vertical-align: middle;
}
.hdk-apiWikiText .hdk-play,
.hdk-apiWikiText .hdk-stop,
.hdk-apiWikiText .hdk-volume {
	width: 16px;
	height: 16px;
}
.hdk-apiWikiText .hdk-play,
.hdk-apiWikiText .hdk-stop {
	cursor: pointer;
}
.hdk-apiWikiText .hdk-play, .hdk-apiWikiText .hdk-volume {
	display: inline-block;
}
.hdk-apiWikiText .hdk-stop {
	display: none;
}
.hdk-apiWikiText .hdk-playing .hdk-play {
	display: none;
}
.hdk-apiWikiText .hdk-playing .hdk-stop {
	display: inline-block;
}
.hdk-apiWikiText .hdk-volumeInput {
	display: inline-block;
	width: 50px;
}
.hdk-apiWikiText .hdk-apiFooter {
	color: #808080;
	font-size: 90%;
}
`;
