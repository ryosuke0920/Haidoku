( () => {
	const MAX_FIELD = 50;
	const MAX_LABEL_BYTE = 100;
	const MAX_URL_BYTE = 300;
	const CLASS_PREFIX = "lessLaborGoToDictionary";
	let windowId = Math.random();
	let navNode;
	let mainNode;
	let formNode;
	let presetNode;
	let othersNode;
	let historyNode;
	let sampleLinkListNode;
	let linkListClassNodeList;
	let contactNode;
	let containerNode;
	let inputPrototypeNode;
	let tableNode;
	let cellPrototypeNode;
	let historyContainerNode;
	let rowlPrototypeNode;
	let bgPage;
	let holdedNode;
	let draggedNode;
	let draggable_list = [];
	let dy = 0;
	let language;
	let languageJson = {};

	starter()
		.then( initProperties )
		.then( initI18n )
		.then( initPreset )
		.then( initField )
		.then( initListener )
		.then( initHistory )
		.then( showBody )
		.catch( unexpectedError );

	function starter(){
		return Promise.resolve();
	}

	function initProperties(){
		let getter = ponyfill.runtime.getBackgroundPage();

		function onGot(page) {
			bgPage = page;
		}

		mainNode = document.querySelector("#main");
		navNode = document.querySelector("#nav");
		formNode = document.querySelector("#form");
		presetNode = document.querySelector("#preset");
		othersNode = document.querySelector("#others");
		historyNode = document.querySelector("#history");
		sampleLinkListNode = document.querySelector("#sampleLinkList");
		sampleLinkListNode.resetClassStyles = ()=>{
			sampleLinkListNode.classList.remove(CLASS_PREFIX+"-modern");
			sampleLinkListNode.classList.remove(CLASS_PREFIX+"-pop");
		};
		sampleLinkListNode.setClassModernStyle = ()=>{
			sampleLinkListNode.classList.add(CLASS_PREFIX+"-modern");
		};
		sampleLinkListNode.setClassPopStyle = ()=>{
			sampleLinkListNode.classList.add(CLASS_PREFIX+"-pop");
		};
		linkListClassNodeList = document.querySelectorAll(".linkListClass");
		contactNode = document.querySelector("#contact");
		containerNode = document.querySelector("#container");
		inputPrototypeNode = document.querySelector("#inputPrototype");
		tableNode = document.querySelector("#table");
		cellPrototypeNode = document.querySelector("#cellPrototype");
		historyContainerNode = historyNode.querySelector("#historyContainer");
		rowlPrototypeNode = historyNode.querySelector("#rowPrototype");
		language = ponyfill.i18n.getUILanguage();
		let matcher = language.match("^(.+?)-");
		if ( matcher ){
			language = matcher[1];
		}

		return getter.then( onGot );
	}

	function initI18n(){
		let joson_list = [
			{ "selector": "title", "property": "innerText", "key": "extensionName" },
			{ "selector": ".title", "property": "innerText", "key": "extensionName" },
			{ "selector": ".formDescription", "property": "innerText", "key": "htmlFormDescription" },
			{ "selector": ".presetDescription", "property": "innerText", "key": "htmlPresetDescription" },
			{ "selector": ".showForm", "property": "innerText", "key": "htmlFormName" },
			{ "selector": ".showPreset", "property": "innerText", "key": "htmlPresetName" },
			{ "selector": ".showHistory", "property": "innerText", "key": "htmlHistoryName" },
			{ "selector": ".showOthers", "property": "innerText", "key": "htmlOthersName" },
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
			{ "selector": "#languageFilter option[value=zh]", "property": "innerText", "key": "htmlLanguageZh" },
			{ "selector": ".addPreset", "property": "innerText", "key": "htmlAddPresetButtonName" },
			{ "selector": ".historyUpdateButton", "property": "innerText", "key": "htmlHistoryUpdateButton" },
			{ "selector": ".historyPageText", "property": "innerText", "key": "htmlHistoryPageText" },
			{ "selector": ".historyRowSizeText", "property": "innerText", "key": "htmlHistoryRowSizeText" },
			{ "selector": ".historyRowSizeAllText", "property": "innerText", "key": "htmlHistoryRowSizeAllText" },
			{ "selector": ".historyOrderAsc", "property": "innerText", "key": "htmlHistoryOrderAsc" },
			{ "selector": ".historyOrderDesc", "property": "innerText", "key": "htmlHistoryOrderDesc" },
			{ "selector": ".historyDeleteButton", "property": "innerText", "key": "htmlHistoryCheckDelete" },
			{ "selector": ".historyDeleteAllButton", "property": "innerText", "key": "htmlHistoryAllDelete" },
			{ "selector": ".historyDescription", "property": "innerText", "key": "htmlHistoryDescription" },
			{ "selector": ".headHistoryDate", "property": "innerText", "key": "htmlHistoryDate" },
			{ "selector": ".headHistoryText", "property": "innerText", "key": "htmlHistoryText" },
			{ "selector": ".headHistoryFromSite", "property": "innerText", "key": "htmlHistoryFromSite" },
			{ "selector": ".headHistoryToSite", "property": "innerText", "key": "htmlHistoryToSite" },
			{ "selector": ".historyPageFirst", "property": "innerText", "key": "htmlPageFirst" },
			{ "selector": ".historyPagePrev", "property": "innerText", "key": "htmlPagePrev" },
			{ "selector": ".historyPageNext", "property": "innerText", "key": "htmlPageNext" },
			{ "selector": ".historyPageLast", "property": "innerText", "key": "htmlPageLast" },
			{ "selector": ".linkListStyle", "property": "innerText", "key": "htmlLinkListStyle" },
			{ "selector": ".linkListStyleClassic", "property": "innerText", "key": "htmlLinkListStyleClassic" },
			{ "selector": ".linkListStyleModern", "property": "innerText", "key": "htmlLinkListStyleModern" },
			{ "selector": ".linkListStylePop", "property": "innerText", "key": "htmlLinkListStylePop" },
			{ "selector": ".contactText", "property": "innerHTML", "key": "htmlContactText" },
			{ "selector": ".myself", "property": "innerHTML", "key": "htmlMyself" },
			{ "selector": ".lessLaborGoToDictionary-zoomDown", "property": "src", "value": ponyfill.extension.getURL("/image/minus.svg"), },
			{ "selector": ".lessLaborGoToDictionary-zoomUp", "property": "src", "value": ponyfill.extension.getURL("/image/plus.svg"), }
		];
		for(let i=0; i<joson_list.length; i++){
			let json = joson_list[i];
			let list = document.querySelectorAll(json["selector"]);
			for(let i=0; i<list.length; i++){
				let node = list[i];
				if( json.hasOwnProperty("key") ){
					node[json["property"]] = ponyfill.i18n.getMessage( json["key"] );
				}
				else {
					node[json["property"]] = json["value"];
				}
			}
		}
	}

	function initPreset(){
		let list = bgPage.getPresetOptionList();
		for(let i=0; i<list.length; i++){
			let option = list[i];
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
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"cl": ""
		});

		function onGot(res){
			let optionList = res["ol"];
			for(let i=0; i<optionList.length; i++){
				let item = optionList[i];
				addField(item["c"], item["l"], item["u"]);
			}
			resetSort();
			setLinkListClass(res["cl"]);
		}
		return getter.then(onGot);
	}

	function initListener(){
		ponyfill.storage.onChanged.addListener(fileChangeBehavior);
		navNode.addEventListener("click", navBehavior);
		formNode.addEventListener("click", formBehavior);
		presetNode.addEventListener("click", presetBehavior);
		presetNode.querySelector("#languageFilter").addEventListener("change", languageFilterBehavior);
		historyNode.addEventListener("click", historyBehavior);
		window.addEventListener("mouseup", sortEnd);
		window.addEventListener("mousemove", sortMove);
		for(let i=0; i<linkListClassNodeList.length; i++) {
			let node = linkListClassNodeList[i];
			node.addEventListener("click", linkListClassBehavior);
		}
	}

	function setLinkListClass(value){
		let node = othersNode.querySelector(".linkListClass[value=\""+value+"\"]");
		node.checked = true;
		setSampleLinkListStyle(value);
	}

	function linkListClassBehavior(e){
		let value = e.target.value;
		setSampleLinkListStyle(value);
		saveLinkListClass(value);
	}

	function setSampleLinkListStyle(value){
		sampleLinkListNode.resetClassStyles();
		if( value == "p" ){
			sampleLinkListNode.setClassPopStyle();
		}
		else if( value == "m" ){
			sampleLinkListNode.setClassModernStyle();
		}
	}

	function saveLinkListClass(value){
		let data = { "cl": value };
		return save(data).catch(onSaveError);
	}

	function fileChangeBehavior(e){
		if( !e.hasOwnProperty("w")) return;
		if( e["w"]["newValue"] == windowId ) return;
		if( e.hasOwnProperty("ol") ){
			removeAllField();
			let optionList = e["ol"]["newValue"];
			for( let i=0; i<optionList.length; i++){
				let item = optionList[i];
				addField(item["c"], item["l"], item["u"]);
			}
			resetSort();
		}
		else if( e.hasOwnProperty("cl") ){
			setLinkListClass(e["cl"]["newValue"]);
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
		else if(cassList.contains("showHistory")){
			showHistory();
		}
		else if(cassList.contains("showOthers")){
			showOthers();
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
			resetSort();
			promise = saveOption();
		}
		else if(cassList.contains("removeField")){
			e.target.closest(".field").remove();
			resetSort();
			promise = saveOption();
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

	function initHistory(){
		historyUpdateTable();
	}

	function historyBehavior(e){
		let cassList = e.target.classList;
		if(cassList.contains("historyUpdateButton")){
			removeHistoryRows();
			historyUpdateButton();
		}
		else if(cassList.contains("historyPageFirst")){
			removeHistoryRows();
			historyUpdateTableFirst();
		}
		else if(cassList.contains("historyPagePrev")){
			removeHistoryRows();
			historyUpdateTablePrev();
		}
		else if(cassList.contains("historyPageNext")){
			removeHistoryRows();
			historyUpdateTableNext();
		}
		else if(cassList.contains("historyPageLast")){
			removeHistoryRows();
			historyUpdateTableEnd();
		}
		else if(cassList.contains("historyCheckAllRows")){
			historyCheckAllRows(e.target.checked);
		}
		else if(cassList.contains("historyDeleteButton")){
			historyDelete();
		}
		else if(cassList.contains("historyDeleteAllButton")){
			historyDeleteAll();
		}
	}

	function historyDeleteAll(){
		if( ! window.confirm(ponyfill.i18n.getMessage("alertHistoryAllDelete")) )return;
		return starter()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyDeleteAllRows)
		.then(historyDeleteAllClose);
	}

	function historyDeleteAllRows(e){
		let db = e.target.result;
		let promise = new Promise((resolve,reject)=>{
			let transaction = db.transaction(["historys"], WRITE);
			let objectStore = transaction.objectStore(HISTORYS);
			let req = objectStore.clear();
			req.onsuccess = (e)=>{ resolve(e); };
			req.onerror = (e)=>{ reject(e); };
		});
		return promise;
	}

	function thisToZero(){
		this.page = 0;
		this.start = this.end = -1;
	}

	function historyDeleteAllClose() {
		removeHistoryRows();
		let data = {};
		thisToZero.bind(data)();
		historyClose.bind(data)();
	}

	function historyDelete() {
		let list = historyContainerNode.querySelectorAll(".historyCheckbox:checked");
		if( list.length <= 0 ) return;
		let ids = [];
		for(let i=0; i<list.length; i++){
			ids.push( parseInt(list[i].value) );
		}
		let data = {"ids": ids};
		return starter()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyDeleteTransaction)
		.then(historyDeleteRow.bind(data))
		.then(historyDeleteClose);
	}

	function historyDeleteTransaction(e){
		let db = e.target.result;
		let transaction = db.transaction(["historys"], WRITE);
		let objectStore = transaction.objectStore(HISTORYS);
		return objectStore;
	}

	function historyDeleteRow(objectStore){
		if( this.ids.length <= 0 ) return ;
		let id = this.ids.pop();
		let promise = new Promise((resolve,reject)=>{
			let req = objectStore.delete(id);
			req.onsuccess = (e)=>{ resolve(objectStore); };
			req.onerror = (e)=>{ reject(e); };
		});
		return promise.then(historyDeleteRow.bind(this));
	}

	function historyDeleteClose(){
		removeHistoryRows();
		historyUpdateButton();
	}

	function removeHistoryRows(){
		historyNode.querySelector(".historyCheckAllRows").checked = false;
		while( historyContainerNode.lastChild ){
			historyContainerNode.removeChild( historyContainerNode.lastChild );
		}
	}

	function getHistoryRowSize(){
		let select = historyNode.querySelector(".historyRowSize");
		return parseInt(select.value);
	}

	function getHistoryPage(num=-1){
		let pageNode = historyNode.querySelector(".historyPage");
		let page = parseInt(pageNode.value) + num;
		if (page < 0) page = 0;
		return page;
	}

	function historyUpdateButton(){
		if( isAllSize() ) return historyUpdateTableAll();
		let page = getHistoryPage(-1);
		return historyUpdateTable(page);
	}

	function historyUpdateTableFirst(){
		if( isAllSize() ) return historyUpdateTableAll();
		return historyUpdateTable(0);
	}

	function historyUpdateTablePrev(){
		if( isAllSize() ) return historyUpdateTableAll();
		let page = getHistoryPage(-2);
		return historyUpdateTable(page);
	}

	function historyUpdateTableNext(){
		if( isAllSize() ) return historyUpdateTableAll();
		let page = getHistoryPage(0);
		return historyUpdateTable(page);
	}

	function getHistoryOrder(){
		let node = historyNode.querySelector(".historyOrder");
		return node.value;
	}

	function historyUpdateTableEnd(){
		if( isAllSize() ) return historyUpdateTableAll();
		let size = getHistoryRowSize();
		let data = {
			"order": getHistoryOrder(),
			"affectedRow": 0,
			"size": size
		};
		return starter()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyCount.bind(data))
		.then(historyDecideRangeEnd.bind(data))
		.then(historyCursor.bind(data))
		.then(historyClose.bind(data));
	}

	function isAllSize(){
		let checkbox = historyNode.querySelector(".historyRowSizeAll");
		return checkbox.checked;
	}

	function historyUpdateTableAll(){
		let data = {
			"all":true,
			"order": getHistoryOrder(),
			"affectedRow":0
		};
		return starter()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyCount.bind(data))
		.then(historyAllRange.bind(data))
		.then(historyCursor.bind(data))
		.then(historyClose.bind(data));
	}

	function historyUpdateTable(page=0){
		let size = getHistoryRowSize();
		let data = {
			"order": getHistoryOrder(),
			"affectedRow": 0,
			"size": size,
			"page": page
		};
		return starter()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyCount.bind(data))
		.then(historyDecideRange.bind(data))
		.then(historyCursor.bind(data))
		.then(historyClose.bind(data));
	}

	function historyCount(e){
		let db = e.target.result;
		let promise = new Promise((resolve,reject)=>{
			let transaction = db.transaction(["historys"], READ);
			let objectStore = transaction.objectStore(HISTORYS);
			let req = objectStore.count();
			req.onsuccess = (e)=>{ resolve(e); };
			req.onerror = (e)=>{ reject(e); };
		});
		return promise;
	}

	function historyAllRange(e){
		let db = e.target.result;
		this.count = e.target.result;
		if( !this.count ){
			thisToZero.bind(this)();
			return e;
		}
		this.page = 0;
		this.start = 0;
		this.end = this.count - 1;
		return e;
	}

	function historyDecideRange(e){
		let db = e.target.result;
		this.count = e.target.result;
		if( !this.count ){
			thisToZero.bind(this)();
			return e;
		}
		this.start = this.page * this.size;
		this.end = this.start + this.size - 1;
		if ( this.count - 1 < this.end ) historyDecideRangeEnd.bind(this)(e);
		return e;
	}

	function historyDecideRangeEnd(e){
		let db = e.target.result;
		this.count = e.target.result;
		if( !this.count ){
			thisToZero.bind(this)();
			return e;
		}
		this.page = Math.ceil( this.count / this.size )-1;
		this.start = this.page * this.size;
		this.end = this.count - 1;
		return e;
	}

	function historyCursor(e){
		if( !this.count ) return Promise.resolve();
		let promise = new Promise((resolve,reject)=>{
			let transaction = e.target.transaction;
			let objectStore = transaction.objectStore(HISTORYS);
			let req = objectStore.openCursor(null,this.order);
			let i=0;
			req.onsuccess = (e)=>{
				let cursor = e.target.result;
				if( ! cursor ) {
					resolve(e);
					return;
				}
				if( this.start <= i && i <= this.end ){
					++this.affectedRow;
					historyMakeRow(
						cursor.key,
						cursor.value.date,
						cursor.value.text,
						cursor.value.fromURL,
						cursor.value.fromTitle,
						cursor.value.toURL,
						cursor.value.toTitle
					);
				}
				i++;
				cursor.continue();
			};
			req.onerror = (e)=>{ reject(e); };
		});
		return promise;
	}

	function historyMakeRow(id,date,text,fromURL,fromTitle,toURL,toTitle){
		let node = rowlPrototypeNode.cloneNode(true);
		node.removeAttribute("id");
		let historyCheckbox = node.querySelector(".historyCheckbox");
		historyCheckbox.value = id;
		let historyDate = node.querySelector(".historyDate");
		historyDate.innerText = date.toLocaleDateString();
		historyDate.title = date.toLocaleString();
		let historyText = node.querySelector(".historyText");
		historyText.innerText = text;
		historyText.title = text;
		let historyFromSite = node.querySelector(".historyFromSite");
		historyFromSite.title = fromURL;
		let historyFromSiteAnchor = historyFromSite.querySelector("a");
		historyFromSiteAnchor.href = fromURL;
		historyFromSiteAnchor.innerText = fromTitle;
		let historyToSite = node.querySelector(".historyToSite");
		let url = toURL.replace("$1",encodeURIComponent(text));
		historyToSite.title = url;
		let historyToSiteAnchor = historyToSite.querySelector("a");
		historyToSiteAnchor.href = url;
		historyToSiteAnchor.innerText = toTitle;
		historyContainerNode.appendChild(node);
	}

	function historyClose(){
		let pageNode = historyNode.querySelector(".historyPage");
		pageNode.value = this.page + 1;
		let startRowNode = historyNode.querySelector(".historyStartRow");
		startRowNode.innerText = this.start + 1;
		let endRowNode = historyNode.querySelector(".historyEndRow");
		endRowNode.innerText = this.end + 1;
		let countRowNode = historyNode.querySelector(".historyCountRow");
		countRowNode.innerText = this.count || 0;
	}

	function historyCheckAllRows(checked){
		let list = historyContainerNode.querySelectorAll(".historyCheckbox");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			node.checked = checked;
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
		if( node ){
			node.classList.remove("active");
		}
	}

	function addActive(className){
		let node = navNode.querySelector(".navi."+className);
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
		for(let i=0; i<list.length; i++){
			let node = list[i];
			show(node);
		}
		if ( !language || !languageJson.hasOwnProperty(language) ) {
			return;
		}
		list = tableNode.querySelectorAll(".checkWrapper:not([data-language~=\""+language+"\"])");
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
		for(let i=0; i<list.length; i++){
			let node = list[i];
			node.checked = false;
		}
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
		if( list ) {
			count = list.length;
		}
		if ( MAX_FIELD < ( count + n ) ) return false;
		return true;
	}

	function onCheckFieldLengthError(){
		return notice( ponyfill.i18n.getMessage("htmlCheckFieldLengthError", [MAX_FIELD] ));
	}

	function notice(message){
		let noticer = ponyfill.notifications.create({
			"type": "basic",
			"iconUrl": ponyfill.extension.getURL("/image/icon.svg"),
			"title": ponyfill.i18n.getMessage("extensionName"),
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
			node.setCustomValidity(ponyfill.i18n.getMessage("htmlCheckByteLengthError", [maxLength, length] ));
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
		for(let i=0; i<draggable_list.length; i++){
			let node = draggable_list[i];
			if( node.offsetTop <= y && y <= (node.offsetTop + node.offsetHeight) ){
				return node;
			}
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
		let data = { "ol": makeOptionList() };
		return save(data).catch(onSaveError);
	}

	function save(data) {
		data["w"] = Math.random();
		return bgPage.save(data)
	}

	function onSaveError(e){
		return bgPage.onSaveError(e);
	}

	function unexpectedError(e){
		return bgPage.unexpectedError(e);
	}
})();
