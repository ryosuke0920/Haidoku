( () => {
	const MAX_FIELD = 50;
	const MAX_LABEL_BYTE = 100;
	const MAX_URL_BYTE = 300;
	let windowId = Math.random();
	let navNode;
	let formNode;
	let presetNode;
	let contactNode;
	let containerNode;
	let inputPrototypeNode;
	let tableNode;
	let cellPrototypeNode;
	let messageNode;
	let bgPage;
	let holdedNode;
	let draggedNode;
	let draggable_list = [];
	let dy = 0;
	let language;
	let languageJson = {};

	document.addEventListener("DOMContentLoaded", init);

	function init(e){
		initProperties().then( initI18n ).then( initPreset ).then( initField ).then( initListener ).catch( onError );
	}

	function initProperties(){
		let getter = browser.runtime.getBackgroundPage();

		function onGot(page) {
			bgPage = page;
		}

		navNode = document.querySelector("#nav");
		formNode = document.querySelector("#form");
		presetNode = document.querySelector("#preset");
		contactNode = document.querySelector("#contact");
		containerNode = document.querySelector("#container");
		inputPrototypeNode = document.querySelector("#inputPrototype");
		tableNode = document.querySelector("#table");
		cellPrototypeNode = document.querySelector("#cellPrototype");
		messageNode = document.querySelector("#message");
		language = browser.i18n.getUILanguage();
		let matcher = language.match("^(.+?)-");
		if ( matcher ){
			language = matcher[1];
		}

		return getter.then( onGot );
	}

	function initI18n(){
		let joson_list = [
			{ "selector": "title", "property": "innerText", "key": "extensionOptionName" },
			{ "selector": ".title", "property": "innerText", "key": "extensionOptionName" },
			{ "selector": ".formDescription", "property": "innerText", "key": "htmlFormDescription" },
			{ "selector": ".presetDescription", "property": "innerText", "key": "htmlPresetDescription" },
			{ "selector": ".showForm", "property": "innerText", "key": "htmlFormName" },
			{ "selector": ".showPreset", "property": "innerText", "key": "htmlPresetName" },
			{ "selector": ".showContact", "property": "innerText", "key": "htmlContactName" },
			{ "selector": "input.label", "property": "title", "key": "htmlLabelDescription" },
			{ "selector": "input.url", "property": "title", "key": "htmlUrlDescription" },
			{ "selector": ".addBlank", "property": "innerText", "key": "htmlAddBlankFieldButtonName" },
			{ "selector": ".labelText", "property": "innerText", "key": "htmlLabelText" },
			{ "selector": ".urlText", "property": "innerText", "key": "htmlUrlText" },
			{ "selector": ".removeField", "property": "innerText", "key": "htmlRemoveButtonName" },
			{ "selector": ".filterText", "property": "innerText", "key": "htmlFilterText" },
			{ "selector": "#languageFilter option[value=\"\"]", "property": "innerText", "key": "htmlLanguageAll" },
			{ "selector": "#languageFilter option[value=en]", "property": "innerText", "key": "htmlLanguageEn" },
			{ "selector": "#languageFilter option[value=ja]", "property": "innerText", "key": "htmlLanguageJa" },
			{ "selector": ".addPreset", "property": "innerText", "key": "htmlAddPresetButtonName" },
			{ "selector": ".contactText", "property": "innerHTML", "key": "htmlContactText" },
			{ "selector": ".myself", "property": "innerHTML", "key": "htmlMyself" }
		];
		for( let json of joson_list ){
			let list = document.querySelectorAll(json["selector"]);
			for( let node of list ){
				node[json["property"]] = browser.i18n.getMessage( json["key"] );
			}
		}
	}

	function initPreset(){
		let list = bgPage.getPresetOptionList();
		for(let option of list){
			let node = cellPrototypeNode.cloneNode(true);
			node.removeAttribute("id");
			node.setAttribute("data-language",option["la"]);
			node.querySelector(".label").innerText = option["l"];
			node.querySelector(".url").innerText = option["u"];
			node.addEventListener("click",checkPreset);
			tableNode.appendChild(node);
			languageJson[option["la"]] = true;
		}
		if(languageJson.hasOwnProperty(language)){
			presetNode.querySelector("#languageFilter").value = language;
		}
		languageFilter(language);
	}

	function initField(){
		let getter = browser.storage.sync.get({
			"ol": [],
			"bf": true
		});

		function onGot(res){
			let optionList = res["ol"];
			for(let item of optionList ){
				addField(item["c"], item["l"], item["u"]);
			}
			resetSort();
		}
		return getter.then(onGot);
	}

	function initListener(){
		browser.storage.onChanged.addListener(fileChangeBehavior);
		navNode.addEventListener("click", navBehavior);
		formNode.addEventListener("click", formBehavior);
		presetNode.addEventListener("click", presetBehavior);
		presetNode.querySelector("#languageFilter").addEventListener("change", languageFilterBehavior);
		window.addEventListener("mouseup", sortEnd);
		window.addEventListener("mousemove", sortMove);
	}

	function fileChangeBehavior(e){
		if ( e.hasOwnProperty("ol") && e.hasOwnProperty("w") && e["w"]["newValue"] != windowId ) {
			let optionList = e["ol"]["newValue"];
			removeAllField();
			for( let item of optionList ){
				addField(item["c"], item["l"], item["u"]);
			}
			resetSort();
		}
	}

	function navBehavior(e){
		let cassList = e.target.classList;
		if(cassList.contains("showForm")){
			showForm();
		}
		else if(cassList.contains("showPreset")){
			showPreset();
		}
		else if(cassList.contains("showContact")){
			showContact();
		}
	}

	function formBehavior(e){
		let cassList = e.target.classList;
		let promise;
		if(cassList.contains("check")){
			promise = saveOption();
		}
		else if(cassList.contains("addBlank")){
			if ( !checkFieldLength(1) ) {
				onCheckFieldLengthError();
				return ;
			}
			addField();
			promise = saveOption();
			resetSort();
		}
		else if(cassList.contains("removeField")){
			e.target.closest(".field").remove();
			promise = saveOption();
			resetSort();
		}
		else if(cassList.contains("showPreset")){
			showPreset();
		}
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
	}

	function languageFilterBehavior(e){
		languageFilter(e.target.value);
	}

	function showForm(){
		removeActive();
		addActive("showForm");
		show(formNode);
		hide(presetNode)
		hide(contactNode);
	}

	function showPreset(){
		removeActive();
		addActive("showPreset");
		hide(formNode);
		show(presetNode)
		hide(contactNode);
	}

	function showContact(){
		removeActive();
		addActive("showContact");
		hide(formNode);
		hide(presetNode)
		show(contactNode);
	}

	function removeActive(){
		let node = navNode.querySelector(".order.active");
		if( node ){
			node.classList.remove("active");
		}
	}

	function addActive(className){
		let node = navNode.querySelector(".order."+className);
		if( node ){
			node.classList.add("active");
		}
	}

	function show(node){
		node.classList.remove("hide");
	}

	function hide(node){
		node.classList.add("hide");
	}

	function languageFilter(language){
		let list = tableNode.querySelectorAll(".checkWrapper");
		for( let node of list ){
			show(node);
		}
		if ( !language || !languageJson.hasOwnProperty(language) ) {
			return;
		}
		list = tableNode.querySelectorAll(".checkWrapper:not([data-language~=\""+language+"\"])");
		for( let node of list ){
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
		messageManager( browser.i18n.getMessage("htmlCheckPresetLengthError", [ MAX_FIELD, sum, sum2, remaining ] ));
	}

	function addPreset(e){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		for(let node of list){
			let checkWrapperNode = node.closest(".checkWrapper");
			let label = checkWrapperNode.querySelector(".label").innerText;
			let p = checkWrapperNode.querySelector(".url").innerText;
			addField(true, label, p, "added");
		}
		let promise = saveOption();
		resetPreset();
		resetSort();
		showForm();
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
		for(let node of list){
			node.checked = false;
		}
	}

	function removeAllField(){
		let list = containerNode.querySelectorAll(".field");
		for( let node of list ){
			node.remove();
		}
	}

	function checkFieldLength(n=0){
		let count = 0;
		let list = containerNode.querySelectorAll(".field");
		if( list ) {
			count = list.length;
		}
		if ( MAX_FIELD < ( count + n ) ) return false;
		return true;
	}

	function onCheckFieldLengthError(){
		messageManager( browser.i18n.getMessage("htmlCheckFieldLengthError", MAX_FIELD ));
	}

	function messageManager( message="exampleMessage" ){
		let noticer = browser.notifications.create({
			"type": "basic",
			"iconUrl": browser.extension.getURL("image/icon.svg"),
			"title": browser.i18n.getMessage("extensionName"),
			"message": message
		});
		return noticer;
	}

	function addField( checked=false, label="", url="", cls=null ){
		let node = inputPrototypeNode.cloneNode(true);
		node.removeAttribute("id");
		node.addEventListener("submit", (e)=>{
			e.preventDefault();
			/* trigger validation */
		});
		if(cls) node.classList.add(cls);
		let labelSubmit = node.querySelector(".labelSubmit");
		let urlSubmit = node.querySelector(".urlSubmit");
		let check = node.querySelector(".check");
		let labelNode = node.querySelector(".label")
		let urlNode = node.querySelector(".url");
		let handleNode = node.querySelector(".handle");
		check.checked = checked;
		check.addEventListener("click", (e)=>{
			if(e.target.checked ){
				if( !checkLabel(labelNode) ){
					e.preventDefault();
					e.target.checked = false;
					labelSubmit.click();
				}
				else if( !checkUrl(urlNode) ){
					e.preventDefault();
					e.target.checked = false;
					urlSubmit.click();
				}
			}
		});
		labelNode.value = label;
		labelNode.addEventListener("input", (e)=>{
			if( !checkLabel(labelNode) ){
				check.checked = false;
				labelSubmit.click();
			}
		});
		labelNode.addEventListener("blur", blurBehavior);
		urlNode.value = url;
		urlNode.addEventListener("input", (e)=>{
			if( !checkUrl(urlNode) ){
				check.checked = false;
				urlSubmit.click();
			}
		});
		urlNode.addEventListener("blur", blurBehavior);
		handleNode.addEventListener("mousedown", sortStart);
		containerNode.appendChild(node);
		show(node);
	}

	function checkLabel(node){
		return checkTextBox(node, MAX_LABEL_BYTE);
	}

	function checkUrl(node){
		return checkTextBox(node, MAX_URL_BYTE);
	}

	function checkTextBox(node, maxLength){
		node.setCustomValidity("");
		if ( !node.checkValidity() ){
			return false;
		}
		if ( !checkByte(node.value, maxLength) ) {
			let length = byteLength(node.value);
			node.setCustomValidity(browser.i18n.getMessage("htmlCheckByteLengthError", [maxLength, length] ));
			return false;
		}
		return true;
	}

	function checkByte(text,length){
		let count = byteLength(text);
		if( count <= length ) return true;
		return false;
	}

	function byteLength(text){
		text = encodeURIComponent(text);
		let count = 0;
		let i = 0;
		while( i < text.length ){
			count++;
			if( text.substr(i,1) == "%" ){
				i += 3;
			}
			else {
				i += 1;
			}
		}
		return count;
	}

	function blurBehavior(e){
		let cassList = e.target.classList;
		let promise;
		if(cassList.contains("label") || cassList.contains("url")){
			promise = saveOption();
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
		for( let node of draggable_list ){
			if( node.offsetTop <= y && y <= (node.offsetTop + node.offsetHeight) ){
				return node;
			}
		}
		return null;
	}

	function resetSort(){
		let fields = containerNode.querySelectorAll(".draggable");
		for(let node of fields){
			node.removeAttribute("id");
		}
		for(let i=0; i<fields.length; i++){
			let sort = i+1;
			fields[i].setAttribute("id", "field-"+sort);
			fields[i].setAttribute("data-sort", sort);
			fields[i].querySelector(".sortNo").innerText = sort;
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
			saveOption();
		}
	}

	function makeOptionList(){
		let optionList = [];
		let fields = containerNode.querySelectorAll(".field");
		for( let i=0; i<fields.length; i++){
			let field = fields[i];
			let checked = field.querySelector(".check").checked;
			let label = fetchValue(field, ".label");
			let url = fetchValue(field, ".url");
			let data = {
				"c": checked,
				"l": label,
				"u": url
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
		let optionList = makeOptionList();
		let saver = bgPage.saveOption( optionList, windowId );
		return saver.catch( (e)=>{ bgPage.onSaveError(e) } );
	}

	function onError(e){
		console.error(e);
	}
})();
