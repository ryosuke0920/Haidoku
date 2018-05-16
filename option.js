( () => {
	let windowId = Math.random();
	let containerNode;
	let inputPrototypeNode;
	let formNode;
	let presetNode;
	let tableNode;
	let cellPrototypeNode;
	let bgPage;

	let holdedNode;
	let draggedNode;
	let draggable_list = [];
	let dx = 0;
	let dy = 0;

	document.addEventListener("DOMContentLoaded", init);

	function init(e){
		let promise = initProperties();
		promise.then( initI18n ).then( initPreset ).then( initField ).then( initListener ).catch( onError );
	}

	function initProperties(){
		let getter = browser.runtime.getBackgroundPage();

		function onGet(page) {
			bgPage = page;
			containerNode = document.querySelector("#container");
			inputPrototypeNode = document.querySelector("#inputPrototype");
			formNode = document.querySelector("#form");
			presetNode = document.querySelector("#preset");
			tableNode = document.querySelector("#table");
			cellPrototypeNode = document.querySelector("#cellPrototype");
		}

		return getter.then( onGet );
	}

	function initI18n(){
		let joson_list = [
			{ "selector": "input.label", "property": "title", "key": "htmlLabelDescription" },
			{ "selector": "input.url", "property": "title", "key": "htmlUrlDescription" },
			{ "selector": ".addBlank", "property": "innerText", "key": "htmlAddBlankFieldButtonName" },
			{ "selector": ".showPreset", "property": "innerText", "key": "htmlAddPresetFieldButtonName" },
			{ "selector": ".labelText", "property": "innerText", "key": "htmlLabelText" },
			{ "selector": ".urlText", "property": "innerText", "key": "htmlUrlText" },
			{ "selector": ".removeField", "property": "innerText", "key": "htmlRemoveButtonName" },
			{ "selector": ".addPreset", "property": "innerText", "key": "htmlAddPresetButtonName" },
			{ "selector": ".cancelPreset", "property": "innerText", "key": "htmlCancelButtonName" }
		];
		for( let json of joson_list ){
			let list = document.querySelectorAll(json["selector"]);
			for( let node of list ){
				node[json["property"]] = browser.i18n.getMessage( json["key"] );
			}
		}
	}

	function initField(){
		let getter = browser.storage.local.get({
			"optionList": []
		});

		function onGot(res){
			let optionList = res["optionList"];
			for(let item of optionList ){
				addInputField(item["checked"], item["label"], item["url"], item["ico"]);
			}
			resetSort();
		}
		return getter.then(onGot, onError);
	}

	function initPreset(){
		let list = bgPage.getPresetOptionList();
		for(let option of list){
			let node = cellPrototypeNode.cloneNode(true);
			node.removeAttribute("id");
			node.querySelector(".label").innerText = option["label"];
			node.querySelector(".url").innerText = option["url"];
			node.addEventListener("click",checkPreset);
			tableNode.appendChild(node);
			node.classList.remove("hide");
		}
	}

	function initListener(){
		browser.storage.onChanged.addListener(fileChangeBehavior);
		formNode.addEventListener("click", formBehavior);
		presetNode.addEventListener("click", presetBehavior);
		window.addEventListener("mouseup", sortEnd);
		window.addEventListener("mousemove", sortMove);
	}

	function fileChangeBehavior(e){
		if ( e["metadata"]["newValue"]["windowId"] != windowId ) {
			let optionList = e["optionList"]["newValue"];
			removeAllField();
			for( let item of optionList ){
				addInputField(item["checked"], item["label"], item["url"], item["ico"]);
			}
			resetSort();
		}
	}

	function blurBehavior(e){
		let cassList = e.target.classList;
		let promise;
		if(cassList.contains("label") || cassList.contains("url")){
			promise = saveOption();
		}
	}

	function formBehavior(e){
		let cassList = e.target.classList;
		let promise;
		if(cassList.contains("check")){
			promise = saveOption();
		}
		else if(cassList.contains("addBlank")){
			addInputField();
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
		if(cassList.contains("cancelPreset")){
			closePreset();
		}
		else if(cassList.contains("addPreset")){
			addPreset();
		}
	}

	function addPreset(e){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		for(let node of list){
			let checkWrapperNode = node.closest(".checkWrapper");
			let label = checkWrapperNode.querySelector(".label").innerText;
			let p = checkWrapperNode.querySelector(".url").innerText;
			addInputField(true, label, p);
		}
		let promise = saveOption();
		closePreset();
	}

	function checkPreset(e){
		if( e.target.tagName == "INPUT" ) {
			return;
		}
		let checkboxNode = this.querySelector(".checkbox");
		checkboxNode.checked = !checkboxNode.checked;
	}

	function showPreset(){
		let list = formNode.querySelectorAll("input,button");
		for(let node of list){
			node.setAttribute("disabled", true);
		}
		formNode.classList.add("hide");
		preset.classList.add("show");
	}

	function closePreset(){
		let list;
		list = formNode.querySelectorAll("input,button");
		for(let node of list){
			node.removeAttribute("disabled");
		}
		formNode.classList.remove("hide");
		preset.classList.remove("show");
		list = tableNode.querySelectorAll(".checkbox:checked");
		for(let node of list){
			node.removeAttribute("checked");
		}
	}

	function removeAllField(){
		let list = containerNode.querySelectorAll(".field");
		for( let node of list ){
			node.remove();
		}
	}

	function addInputField( checked=false, label="", url="", ico="image/dummy.svg" ){
		let node = inputPrototypeNode.cloneNode(true);
		node.removeAttribute("id");
		node.querySelector(".check").checked = checked;
		let labelNode = node.querySelector(".label")
		labelNode.value = label;
		labelNode.addEventListener("blur", blurBehavior);
		let urlNode = node.querySelector(".url");
		urlNode.value = url;
		urlNode.addEventListener("blur", blurBehavior);
		let handleNode = node.querySelector(".handle");
		handleNode.addEventListener("mousedown", sortStart);
		node.querySelector(".ico").src = ico;
		containerNode.appendChild(node);
		node.classList.remove("hide");
	}

	function sortStart(e){
		draggedNode = e.target.closest(".draggable");
		holdedNode = draggedNode.cloneNode(true);
		holdedNode.removeAttribute("id");
		holdedNode.classList.add("hold");
		holdedNode.classList.remove("draggable");
		containerNode.insertBefore(holdedNode, draggedNode);
		dx = holdedNode.offsetLeft - e.clientX;
		dy = holdedNode.offsetTop - e.clientY;
		holdedNode.style.left = (e.clientX + dx) +"px";
		holdedNode.style.top = (e.clientY + dy) +"px";
		draggedNode.classList.add("invisible");
		draggable_list = containerNode.querySelectorAll(".draggable");
		e.preventDefault();
	}

	function mouseOver(x, y) {
		for( let node of draggable_list ){
			//console.log("x=" + x + ", top=" + node.offsetTop + ", bottom=" + (node.offsetTop + node.offsetHeight) + ", left=" + node.offsetLeft + ", right=" + (node.offsetLeft + node.offsetWidth) );
			if( node.offsetTop <= y && y <= (node.offsetTop + node.offsetHeight)
				&& node.offsetLeft <= x && x <= (node.offsetLeft + node.offsetWidth) ){
				return node;
			}
		}
		return null;
	}

	function sortMove(e){
		if(draggedNode){
			holdedNode.style.left = (e.clientX + dx) +"px";
			holdedNode.style.top = (e.clientY + dy) +"px";
			let overedNode = mouseOver(e.clientX, e.clientY);
			if( overedNode && overedNode != draggedNode ) {
				let draggedSort = draggedNode.getAttribute("sort");
				let overedSort = overedNode.getAttribute("sort");
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

	function resetSort(){
		let fields = containerNode.querySelectorAll(".draggable");
		for(let i=0; i<fields.length; i++){
			let sort = i+1;
			fields[i].setAttribute("id", sort);
			fields[i].setAttribute("sort", sort);
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

	function fetchValue(element, selector){
		let node = element.querySelector(selector);
		if (!node) return null;
		return node.value;
	}

	function makeOptionList(){
		let optionList = [];
		let fields = containerNode.querySelectorAll(".field");
		for( let i=0; i<fields.length; i++){
			let field = fields[i];
			let checked = field.querySelector(".check").checked;
			let label = fetchValue(field, ".label");
			let url = fetchValue(field, ".url");
			let ico = field.querySelector(".ico").src;
			let data = {
				"checked": checked,
				"label": label,
				"url": url,
				"ico": ico,
			};
			optionList.push(data);
		}
		return optionList;
	}

	function saveOption(){
		let metadata = bgPage.makeMetadata(windowId);
		let optionList = makeOptionList();
		let saver = bgPage.saveOption( metadata, optionList );
		return saver.then( ()=>{}, (e)=>{ bgPage.onSaveError(e) } );
	}

	function onError(e){
		console.error(e);
	}
})();
