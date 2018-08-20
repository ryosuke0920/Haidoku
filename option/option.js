const MAX_FIELD = 50;
const MAX_LABEL_BYTE = 100;
const MAX_URL_BYTE = 300;
const URL_REGEX = new RegExp(/^(?:[hH][tT][tT][pP][sS]?|[fF][tT][pP][sS]?):\/\/\w+/);
const ADD_FIELD_CLASS = "add";
const ADD_FIELD_DURATION = 1.5 * 1000;
const SCROLL_RACIO = 1/2;
let mainNode = document.querySelector("#main");
let navNode = document.querySelector("#nav");
let formNode = document.querySelector("#form");
let presetNode = document.querySelector("#preset");
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

Promise.resolve().then( initI18n ).then( initField ).then( initListener ).then( showBody ).catch( unexpectedError );

function initI18n(){
	let list = [
		{ "selector": "title", "property": "innerText", "key": "extensionName" },
		{ "selector": ".title", "property": "innerText", "key": "extensionName" },
		{ "selector": ".formDescription", "property": "innerText", "key": "htmlFormDescription" },
		{ "selector": ".usageOrder", "property": "innerText", "key": "htmlUsageOrder" },
		{ "selector": ".usageCheck", "property": "innerText", "key": "htmlUsageCheck" },
		{ "selector": ".usageHist", "property": "innerText", "key": "htmlUsageHist" },
		{ "selector": ".usageDelete", "property": "innerText", "key": "htmlUsageDelete" },
		{ "selector": ".presetDescription", "property": "innerText", "key": "htmlPresetDescription" },
		{ "selector": ".showForm", "property": "innerText", "key": "htmlFormName" },
		{ "selector": ".showPreset", "property": "innerText", "key": "htmlPresetName" },
		{ "selector": ".showHistory", "property": "innerText", "key": "htmlHistoryName" },
		{ "selector": ".showRanking", "property": "innerText", "key": "htmlRankingName" },
		{ "selector": ".showOthers", "property": "innerText", "key": "htmlOthersName" },
		{ "selector": ".showContact", "property": "innerText", "key": "htmlContactName" },
		{ "selector": "input.label", "property": "title", "key": "htmlLabelDescription" },
		{ "selector": "input.url", "property": "title", "key": "htmlUrlDescription" },
		{ "selector": ".addBlank", "property": "innerText", "key": "htmlAddBlankFieldButtonName" },
		{ "selector": ".labelText", "property": "innerText", "key": "htmlLabelText" },
		{ "selector": ".urlText", "property": "innerText", "key": "htmlUrlText" },
		{ "selector": ".removeField", "property": "title", "key": "htmlRemoveButtonName" },
		{ "selector": ".contactText", "property": "innerHTML", "key": "htmlContactText" },
		{ "selector": ".myself", "property": "innerHTML", "key": "htmlMyself" }
	];
	setI18n(list);
}

function initField(){
	let getter = ponyfill.storage.sync.get({
		"ol": []
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

function navBehavior(e){
	let classList = e.target.classList;
	if(classList.contains("showForm")){
		showForm();
	}
	else if(classList.contains("showPreset")){
		showPreset();
	}
	else if(classList.contains("showContact")){
		showContact();
	}
	else if(classList.contains("showHistory")){
		showHistory();
	}
	else if(classList.contains("showRanking")){
		showRanking();
	}
	else if(classList.contains("showOthers")){
		showOthers();
	}
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
}

function showBody(){
	show( document.querySelector("body") );
}

function showForm(){
	removeActive();
	addActive("showForm");
	hideAllPanels();
	show(formNode);
}

function showPreset(){
	removeActive();
	addActive("showPreset");
	hideAllPanels();
	show(presetNode)
}

function showContact(){
	removeActive();
	addActive("showContact");
	hideAllPanels();
	show(contactNode);
}


function showHistory(){
	removeActive();
	addActive("showHistory");
	hideAllPanels();
	show(historyNode);
}

function showRanking(){
	removeActive();
	addActive("showRanking");
	hideAllPanels();
	show(rankingNode);
}

function showOthers(){
	removeActive();
	addActive("showOthers");
	hideAllPanels();
	show(othersNode);
}

function hideAllPanels(){
	let list = mainNode.querySelectorAll(".panel");
	for(let i=0; i<list.length; i++){
		let node = list[i];
		hide(node);
	}
}

function removeActive(){
	let node = navNode.querySelector(".navi.active");
	if( node ) node.classList.remove("active");
}

function addActive(className){
	let node = navNode.querySelector(".navi."+className);
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
	let node = inputPrototypeNode.cloneNode(true);
	node.removeAttribute("id");
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
	containerNode.appendChild(node);
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

function isURL(text){
	if( !text.match(URL_REGEX) ) return false;
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
		let label = fetchValue(field, ".label");
		let url = fetchValue(field, ".url");
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
