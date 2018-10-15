const MAX_FIELD = 50;
const MAX_LABEL_BYTE = 100;
const MAX_URL_BYTE = 300;
const ADD_FIELD_CLASS = "add";
const ADD_FIELD_DURATION = 1.5 * 1000;
const SCROLL_RACIO = 1/2;
const CELL_TEXT_MAX_LENGTH = 31 /* Archaiomelesidonophrunicherata */

const JP_FROM = [
	"０","１","２","３","４","５","６","７","８","９",
	"Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ",
	"ａ","ｂ","ｃ","ｄ","ｅ","ｆ","ｇ","ｈ","ｉ","ｊ","ｋ","ｌ","ｍ","ｎ","ｏ","ｐ","ｑ","ｒ","ｓ","ｔ","ｕ","ｖ","ｗ","ｘ","ｙ","ｚ",
	"ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾁﾞ","ﾂﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ",
	"ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ","ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ",
	"ﾊ","ﾋ","ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ",
	"ｧ","ｨ","ｩ","ｪ","ｫ","ｯ","ｬ","ｭ","ｮ","｡","｢","｣","､","･","ｰ",
	"！","”","＃","＄","％","＆","’","（","）","＊","＋","，","−","．","／",
	"：","；","＜","＝","＞","？","＠","［","￥","＼","］","＾","＿","｀","｛","｜","｝","〜"
];
const JP_TO = [
	"0","1","2","3","4","5","6","7","8","9",
	"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
	"ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","セ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ",
	"ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ",
	"ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン",
	"ァ","ィ","ゥ","ェ","ォ","ッ","ャ","ュ","ョ","。","「","」","、","・","ー",
	"!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/",
	":",";","<","=",">","?","@","[","\\","\\","]","^","_","`","{","|","}","~"
];
const SPACE_REGEX = new RegExp(/\s+/,"g");
const SINGLE_SPACE = " ";
const PRESET_SEARCH_DELAY = 500;

let mainNode = document.querySelector("#main");
let navNode = document.querySelector("#nav");
let formNode = document.querySelector("#form");
let rankingNode = document.querySelector("#ranking");
let othersNode = document.querySelector("#others");
let historyNode = document.querySelector("#history");
let contactNode = document.querySelector("#contact");
let containerNode = document.querySelector("#container");
let inputPrototypeNode = document.querySelector("#inputPrototype");
let holdedNode;
let draggedNode;
let draggable_list = [];
let dy = 0;
let scrollDestination = 0;

let presetNode = document.querySelector("#preset");
let tableNode = document.querySelector("#table");
let cellPrototypeNode = document.querySelector("#cellPrototype");
let presetSearchNode = document.querySelector("#presetSearchText");
let languageJson = {};
let presetSearchQueue = [];

initI18n();
initNode();
Promise.resolve().then( initField ).then( initListener ).then( showBody ).catch( unexpectedError );

function initI18n(){
	let list = [
		{ "selector": "title", "property": "innerText", "key": "extensionName" },
		{ "selector": ".title", "property": "innerText", "key": "extensionName" },
		{ "selector": ".formDescription", "property": "innerText", "key": "htmlFormDescription" },
		{ "selector": ".usageOrder", "property": "innerText", "key": "htmlUsageOrder" },
		{ "selector": ".usageCheck", "property": "innerText", "key": "htmlUsageCheck" },
		{ "selector": ".usageHist", "property": "innerText", "key": "htmlUsageHist" },
		{ "selector": ".usageDelete", "property": "innerText", "key": "htmlUsageDelete" },

		{ "selector": ".navi[data-navi-name=\"form\"]", "property": "innerText", "key": "htmlFormName" },
		{ "selector": ".navi[data-navi-name=\"history\"]", "property": "innerText", "key": "htmlHistoryName" },
		{ "selector": ".navi[data-navi-name=\"ranking\"]", "property": "innerText", "key": "htmlRankingName" },
		{ "selector": ".navi[data-navi-name=\"control\"]", "property": "innerText", "key": "htmlControlName" },
		{ "selector": ".navi[data-navi-name=\"others\"]", "property": "innerText", "key": "htmlOthersName" },
		{ "selector": ".navi[data-navi-name=\"contact\"]", "property": "innerText", "key": "htmlContactName" },

		{ "selector": ".addFromPreset", "property": "innerText", "key": "htmlAddFromPreset" },
		{ "selector": ".addBlank", "property": "innerText", "key": "htmlAddBlankFieldButtonName" },
		{ "selector": ".filterText", "property": "innerText", "key": "htmlFilterText" },
		{ "selector": "#languageFilter option[value=\"\"]", "property": "innerText", "key": "htmlLanguageAll" },
		{ "selector": "#languageFilter option[value=en]", "property": "innerText", "key": "htmlLanguageEn" },
		{ "selector": "#languageFilter option[value=ja]", "property": "innerText", "key": "htmlLanguageJa" },
		{ "selector": "#languageFilter option[value=zh]", "property": "innerText", "key": "htmlLanguageZh" },
		{ "selector": ".addPreset", "property": "innerText", "key": "htmlAddPresetButtonName" },
		{ "selector": ".presetDescription", "property": "innerText", "key": "htmlPresetDescription" },
		{ "selector": ".presetSearchText", "property": "placeholder", "key": "htmlPresetSearchKeyword" },
		{ "selector": ".presetClearSearchButton", "property": "innerText", "key": "htmlPresetClearSearchButton" },

		{ "selector": ".releaseNoteTitle", "property": "innerText", "key": "htmlRleaseNoteTitle" },
		{ "selector": ".releaseNoteDescription1", "property": "innerText", "key": "htmlReleaseNoteDescription1" },
		{ "selector": ".announcementTitle", "property": "innerText", "key": "htmlAnnouncementTitle" },
		{ "selector": ".announcementDescription", "property": "innerText", "key": "htmlAnnouncementDescription" },
		{ "selector": ".issueTitle", "property": "innerText", "key": "htmlIssueTitle" },
		{ "selector": ".issueDescription", "property": "innerText", "key": "htmlIssueDescription" },
		{ "selector": ".contactTitle", "property": "innerText", "key": "htmlContactTitle" },
		{ "selector": ".iam", "property": "innerText", "key": "htmlIam" },
		{ "selector": ".licenseTitle", "property": "innerText", "key": "htmlLicenseTitle" },
		{ "selector": ".licenseDescription", "property": "innerText", "key": "htmlLicenseDescription" },
	];
	setI18n(list);
}

function initNode(){
	let language = ponyfill.i18n.getUILanguage();
	let matcher = language.match("^(.+?)-");
	if ( matcher ) language = matcher[1];
	for(let i=0; i<PRESET_OPTION_LIST.length; i++){
		let option = PRESET_OPTION_LIST[i];
		let clone = document.importNode(cellPrototypeNode.content, true);
		let node = clone.querySelector("section");
		node.setAttribute("data-language",option["la"]);
		node.querySelector(".label").innerText = option["l"];
		node.querySelector(".url").innerText = option["u"];
		if(option.hasOwnProperty("aside")) {
			let aside = node.querySelector(".presetAside");
			aside.innerText = option["aside"];
			show(aside);
		}
		node.addEventListener("click",checkPreset);
		tableNode.appendChild(clone);
		languageJson[option["la"]] = true;
	}
	if(languageJson.hasOwnProperty(language)){
		presetNode.querySelector("#languageFilter").value = language;
	}
	languageFilter(language);
}

function initField(){
	let getter = ponyfill.storage.sync.get({
		"ol": DEFAULT_OPTION_LIST_ON_GET
	});

	function onGot(res){
		let optionList = res["ol"];
		for(let i=0; i<optionList.length; i++){
			let item = optionList[i];
			if( !item.hasOwnProperty("h") ) item["h"] = false;
			addField(item["c"], item["h"], item["l"], item["u"]);
		}
		resetSort();
	}
	return getter.then(onGot);
}

function initListener(){
	ponyfill.storage.onChanged.addListener(fileChangeBehavior);
	navNode.addEventListener("click", navBehavior);
	formNode.addEventListener("click", formBehavior);
	window.addEventListener("mouseup", sortEnd);
	window.addEventListener("mousemove", sortMove);
	window.addEventListener("click", hideInputMessage);
	window.addEventListener("keydown", formScrollCancel);
	window.addEventListener("mousedown", formScrollCancel);
	window.addEventListener("wheel", formScrollCancel);
	window.addEventListener("click", clickComponent );

	presetNode.addEventListener("click", presetBehavior);
	presetNode.querySelector("#languageFilter").addEventListener("change", languageFilterBehavior);
	presetSearchNode.addEventListener("input", presetSearchInput);
}

function formScrollCancel(e){
	scrollDestination = -1;
}

function fileChangeBehavior(e, area){
	if( !e.hasOwnProperty("w")) return;
	if( e["w"]["newValue"] == windowId ) return;
	if( !e.hasOwnProperty("ol") ) return;
	removeAllField();
	let optionList = e["ol"]["newValue"];
	for( let i=0; i<optionList.length; i++){
		let item = optionList[i];
		if( !item.hasOwnProperty("h") ) item["h"] = false;
		addField(item["c"], item["h"], item["l"], item["u"]);
	}
	resetSort();
}

function formBehavior(e){
	let classList = e.target.classList;
	if(classList.contains("addBlank")){
		if ( !checkFieldLength(1) ) {
			onCheckFieldLengthError();
			return ;
		}
		addNewField();
		resetSort();
		saveOption().catch(onSaveError);
		smoothScroll();
	}
	else if(e.target.closest(".removeField")){
		e.target.closest(".field").remove();
		resetSort();
		saveOption().catch(onSaveError);
	}
	else if(classList.contains("addFromPreset")){
		show(formNode.querySelector("#preset"));
	}
}

function showBody(){
	show( document.querySelector("body") );
}

function hideAllPanels(){
	let list = mainNode.querySelectorAll(".panel");
	for(let i=0; i<list.length; i++){
		let node = list[i];
		hide(node);
	}
}

function navBehavior(e){
	if(e.target.classList.contains("navi")) {
		let id = e.target.getAttribute("data-navi-name");
		removeActive();
		addActive(e.target.getAttribute("data-navi-name"));
		hideAllPanels();
		show( document.querySelector("#"+id) );
	}
}

function removeActive(){
	let node = navNode.querySelector(".navi.active");
	if( node ) node.classList.remove("active");
}

function addActive(name){
	let node = navNode.querySelector(".navi[data-navi-name=\""+name+"\"]");
	if( node ) node.classList.add("active");
}

function removeAllField(){
	let list = containerNode.querySelectorAll(".field");
	for(let i=0; i<list.length; i++){
		let node = list[i];
		node.remove();
	}
}

function checkFieldLength(n=0){
	let count = 0;
	let list = containerNode.querySelectorAll(".field");
	if( list ) count = list.length;
	if ( MAX_FIELD < ( count + n ) ) return false;
	return true;
}

function onCheckFieldLengthError(){
	return notice( ponyfill.i18n.getMessage("htmlCheckFieldLengthError", [MAX_FIELD] ));
}

function hideInputMessage(e){
	if( e.target.closest(".check") ) return;
	let list = formNode.querySelectorAll(".inputMessage:not(.hide)");
	for(let i=0; i<list.length; i++){
		hide(list[i]);
	}
}

function removeAddAnimation(){
	this.classList.remove(ADD_FIELD_CLASS);
}

function addNewField( checked=false, hist=true, label="", url="" ){
	return addField( checked, hist, label, url, ADD_FIELD_CLASS );
}

function addField( checked=false, hist=true, label="", url="", cls=null ){
	let clone = document.importNode(inputPrototypeNode.content, true);
	let i18nList = [
		{ "selector": ".labelText", "property": "innerText", "key": "htmlLabelText" },
		{ "selector": ".urlText", "property": "innerText", "key": "htmlUrlText" },
		{ "selector": ".removeField", "property": "title", "key": "htmlRemoveButtonName" },
		{ "selector": "input.label", "property": "title", "key": "htmlLabelDescription" },
		{ "selector": "input.url", "property": "title", "key": "htmlUrlDescription" }
	];
	setI18n(i18nList, clone);
	let node = clone.querySelector(".field");
	if(cls) {
		node.classList.add(cls);
		setTimeout( removeAddAnimation.bind(node), ADD_FIELD_DURATION );
	}
	let checkNode = node.querySelector(".check");
	let histNode = node.querySelector(".hist");
	let labelNode = node.querySelector(".label");
	let labelMessageNode = node.querySelector(".labelMessage");
	let urlNode = node.querySelector(".url");
	let urlMessageNode = node.querySelector(".urlMessage");
	let handleNode = node.querySelector(".handle");
	if(checked) checkNode.setAttribute("data-checked", "1");
	checkNode.addEventListener("click", (e)=>{
		let checkNode = e.currentTarget;
		if( !checkNode.getAttribute("data-checked") ){
			let error = false;
			if( !checkLabel(labelNode,labelMessageNode) ) error = true;
			if( !checkUrl(urlNode, urlMessageNode) ) error = true;
			if( error ){
				e.preventDefault();
				return;
			}
			checkNode.setAttribute("data-checked","1");
		}
		else {
			checkNode.removeAttribute("data-checked");
		}
		saveOption().catch(onSaveError);
	});
	if(hist) histNode.setAttribute("data-checked", "1");
	histNode.addEventListener("click",(e)=>{
		let histNode = e.currentTarget;
		if( !histNode.getAttribute("data-checked") ){
			histNode.setAttribute("data-checked","1");
		}
		else {
			histNode.removeAttribute("data-checked");
		}
		saveOption().catch(onSaveError);
	});
	labelNode.value = label;
	labelNode.addEventListener("input", (e)=>{
		if( !checkLabel(labelNode,labelMessageNode) && checkNode.getAttribute("data-checked") ){
			checkNode.removeAttribute("data-checked");
			saveOption().catch(onSaveError);
		}
	});
	labelNode.addEventListener("blur", blurBehavior);
	urlNode.value = url;
	urlNode.addEventListener("input", (e)=>{
		if( !checkUrl(urlNode, urlMessageNode) && checkNode.getAttribute("data-checked") ){
			checkNode.removeAttribute("data-checked");
			saveOption().catch(onSaveError);
		}
	});
	urlNode.addEventListener("blur", blurBehavior);
	handleNode.addEventListener("mousedown", sortStart);
	containerNode.appendChild(clone);
	show(node);
}

function smoothScroll(){
	let body = document.querySelector("body");
	scrollDestination = body.offsetHeight - window.innerHeight;
	function animation(){
		if ( 0 <= scrollDestination && scrollDestination != window.scrollY ) {
			let delta = Math.ceil(( scrollDestination - window.scrollY ) * SCROLL_RACIO );
			window.scrollTo(0,delta+window.scrollY);
			setTimeout( animation, 80 );
		}
	}
	animation();
}

function checkLabel(node, messageNode){
	hide(messageNode);
	if( !checkBlank(node.value) ){
		messageNode.innerText = ponyfill.i18n.getMessage("htmlCheckBlankError");
		show(messageNode);
		return false;
	}
	if( !checkByte(node.value, MAX_LABEL_BYTE) ){
		messageNode.innerText = ponyfill.i18n.getMessage("htmlCheckByteLengthError", [MAX_LABEL_BYTE, byteLength(node.value)] );
		show(messageNode);
		return false;
	}
	return true;
}

function checkUrl(node, messageNode){
	hide(messageNode);
	if( !checkBlank(node.value) ){
		messageNode.innerText = ponyfill.i18n.getMessage("htmlCheckBlankError");
		show(messageNode);
		return false;
	}
	else if( !checkByte(node.value, MAX_URL_BYTE) ){
		messageNode.innerText = ponyfill.i18n.getMessage("htmlCheckByteLengthError", [MAX_URL_BYTE, byteLength(node.value)] );
		show(messageNode);
		return false;
	}
	else if( !isURL(node.value) ){
		messageNode.innerText = ponyfill.i18n.getMessage("htmlCheckURLError");
		show(messageNode);
		return false;
	}
	return true;
}

function blurBehavior(e){
	let classList = e.target.classList;
	if(classList.contains("label") || classList.contains("url")){
		saveOption().catch(onSaveError);
	}
}

function sortStart(e){
	draggedNode = e.target.closest(".draggable");
	holdedNode = draggedNode.cloneNode(true);
	holdedNode.removeAttribute("id");
	holdedNode.classList.add("hold");
	holdedNode.classList.remove("draggable");
	containerNode.insertBefore(holdedNode, draggedNode);
	dy = holdedNode.offsetTop - e.pageY;
	holdedNode.style.top = (e.pageY + dy) +"px";
	draggedNode.classList.add("invisible");
	draggable_list = containerNode.querySelectorAll(".draggable");
	e.preventDefault();
}

function sortMove(e){
	if(draggedNode){
		holdedNode.style.top = (e.pageY + dy) +"px";
		let overedNode = isMouseOver(e.pageX, e.pageY);
		if( overedNode && overedNode != draggedNode ) {
			let draggedSort = draggedNode.getAttribute("data-sort");
			let overedSort = overedNode.getAttribute("data-sort");
			if ( overedSort < draggedSort ) {
				containerNode.insertBefore(draggedNode, overedNode);
			}
			else if ( draggedSort < overedSort ) {
				containerNode.insertBefore(draggedNode, overedNode.nextElementSibling);
			}
			resetSort();
		}
	}
}

function isMouseOver(x, y) {
	for(let i=0; i<draggable_list.length; i++){
		let node = draggable_list[i];
		if( node.offsetTop <= y && y <= (node.offsetTop + node.offsetHeight) ) return node;
	}
	return null;
}

function resetSort(){
	let fields = containerNode.querySelectorAll(".draggable");
	for(let i=0; i<fields.length; i++){
		let node = fields[i];
		node.removeAttribute("id");
	}
	for(let i=0; i<fields.length; i++){
		let sort = i+1;
		fields[i].setAttribute("id", "field-"+sort);
		fields[i].setAttribute("data-sort", sort);
	}
}

function sortEnd(e){
	if( draggedNode ){
		let node = containerNode.querySelector(".draggable.invisible");
		if( node )node.classList.remove("invisible");
		if ( holdedNode ) holdedNode.remove();
		holdedNode = null;
		draggable_list = [];
		draggedNode = null;
		saveOption().catch(onSaveError);
	}
}

function makeOptionList(){
	let optionList = [];
	let fields = containerNode.querySelectorAll(".field");
	for( let i=0; i<fields.length; i++){
		let field = fields[i];
		let checkNode = field.querySelector(".check");
		let checked = false;
		if( checkNode && checkNode.getAttribute("data-checked") ) checked = true;
		let histNode = field.querySelector(".hist");
		let hist = false;
		if( histNode && histNode.getAttribute("data-checked") ) hist = true;
		let label = cutStrByByte(fetchValue(field, ".label"), MAX_LABEL_BYTE);
		let url = cutStrByByte(fetchValue(field, ".url"), MAX_URL_BYTE);
		let data = {
			"c": checked,
			"l": label,
			"u": url,
			"h": hist
		};
		optionList.push(data);
	}
	return optionList;
}

function cutStrByByte(str,byte){
	while( !checkByte(str, byte) ){
		str = str.slice(0,-1);
	}
	return str;
}

function fetchValue(element, selector){
	let node = element.querySelector(selector);
	if (!node) return null;
	return node.value;
}

function saveOption(){
	let data = { "ol": makeOptionList() };
	return saveW(data);
}

function clickComponent(e){
	if(e.target.classList.contains("excludeImage")){
		let node = e.target.closest(".erasticTextComponent");
		shortErasticText(node);
	}
	else if(e.target.classList.contains("includeImage")){
		let node = e.target.closest(".erasticTextComponent");
		longErasticText(node);
	}
	else if( e.target.classList.contains("panelComponent") ){
		hide(e.target);
	}
	else if( e.target.classList.contains("removePanelComponent") ){
		hide(e.target.closest(".panelComponent"));
	}
}

function shortErasticText(node){
	node.classList.add("short");
	node.classList.remove("long");
	let textNode = node.querySelector(".erasticText");
	textNode.innerText = textNode.getAttribute("data-short-text");
}

function longErasticText(node){
	node.classList.remove("short");
	node.classList.add("long");
	let textNode = node.querySelector(".erasticText");
	textNode.innerText = textNode.getAttribute("data-long-text");
}

function presetBehavior(e){
	let cassList = e.target.classList;
	if(cassList.contains("addPreset")){
		if ( !checkPrestLength() ) {
			onCheckPresetLengthError();
			return ;
		}
		addPreset();
	}
	else if(cassList.contains("presetClearSearchButton")){
		presetClearSearch();
	}
}

function presetClearSearch(){
	presetSearchNode.value = "";
	presetSearchQueue = [];
	presetRemoveCellHide();
}

function presetRemoveCellHide(){
	let list = tableNode.querySelectorAll(".checkWrapper.cell-hide");
	for(let i=0; i<list.length; i++){
		list[i].classList.remove("cell-hide");
	}
}

function reduceSpace(text){
	return text.replace(SPACE_REGEX, SINGLE_SPACE).trim();
}

function commonize(text){
	for( let i=0; i<JP_FROM.length; i++ ){
		while(-1 < text.indexOf(JP_FROM[i])){
			text = text.replace(JP_FROM[i], JP_TO[i]);
		}
	}
	text = text.toLowerCase();
	return text;
}

function presetSearchInput(){
	let tmp = reduceSpace(presetSearchNode.value);
	if ( tmp.length == 0 ) {
		presetRemoveCellHide();
		return;
	}
	presetSearchQueue.push(presetSearchNode.value);
	setTimeout(()=>{
		if( presetSearchQueue.length <= 0 ) return;
		let text = presetSearchQueue.shift();
		if( presetSearchQueue.length <= 0 ) {
			presetRemoveCellHide();
			presetSearch(text);
		}
	},PRESET_SEARCH_DELAY);
}

function presetSearch(text){
	text = commonize(reduceSpace(text));
	let texts = text.split(SINGLE_SPACE);
	let nodes = tableNode.querySelectorAll(".checkWrapper:not(.hide)");
	for(let i=0; i<nodes.length; i++){
		let node = nodes[i];
		let content = commonize(node.innerText);
		for( let j=0; j<texts.length; j++){
			let word = texts[j];
			if ( content.indexOf(word) <= -1 ){
				node.classList.add("cell-hide");
				break;
			}
		}
	}
}

function languageFilterBehavior(e){
	languageFilter(e.target.value);
	presetSearch(presetSearchNode.value);
}

function languageFilter(str){
	let list = tableNode.querySelectorAll(".checkWrapper");
	for(let i=0; i<list.length; i++){
		let node = list[i];
		show(node);
	}
	if ( !str || !languageJson.hasOwnProperty(str) ) {
		return;
	}
	list = tableNode.querySelectorAll(".checkWrapper:not([data-language~=\""+str+"\"])");
	for(let i=0; i<list.length; i++){
		let node = list[i];
		hide(node);
	}
}

function checkPrestLength(){
	let list = tableNode.querySelectorAll(".checkbox:checked");
	return checkFieldLength(list.length);
}

function onCheckPresetLengthError(){
	let sum = ""+0;
	let list = containerNode.querySelectorAll(".field");
	if( list ) sum = list.length;
	let remaining = MAX_FIELD - sum;
	let list2 = tableNode.querySelectorAll(".checkbox:checked");
	let sum2 = 0;
	if( list2 ) sum2 = list2.length;
	return notice( ponyfill.i18n.getMessage("htmlCheckPresetLengthError", [ MAX_FIELD, sum, sum2, remaining ] ));
}

function addPreset(e){
	let list = tableNode.querySelectorAll(".checkbox:checked");
	for(let i=0; i<list.length; i++){
		let node = list[i];
		let checkWrapperNode = node.closest(".checkWrapper");
		let label = checkWrapperNode.querySelector(".label").innerText;
		let p = checkWrapperNode.querySelector(".url").innerText;
		addNewField(true, true, label, p);
	}
	let promise = saveOption();
	resetPreset();
	resetSort();
	hide(preset);
	smoothScroll();
}

function checkPreset(e){
	if( e.target.tagName == "INPUT" ) {
		/* input type="checkbox" */
		return;
	}
	let checkboxNode = this.querySelector(".checkbox");
	checkboxNode.checked = !checkboxNode.checked;
}

function resetPreset(){
	let list = tableNode.querySelectorAll(".checkbox:checked");
	for(let i=0; i<list.length; i++){
		let node = list[i];
		node.checked = false;
	}
}
