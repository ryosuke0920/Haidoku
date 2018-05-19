( () => {
	let windowId = Math.random();
	let navNode;
	let formNode;
	let presetNode;
	let contactNode;
	let containerNode;
	let inputPrototypeNode;
	let tableNode;
	let cellPrototypeNode;
	let bgPage;
	let holdedNode;
	let draggedNode;
	let draggable_list = [];
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
		}

		navNode = document.querySelector("#nav");
		formNode = document.querySelector("#form");
		presetNode = document.querySelector("#preset");
		contactNode = document.querySelector("#contact");
		containerNode = document.querySelector("#container");
		inputPrototypeNode = document.querySelector("#inputPrototype");
		tableNode = document.querySelector("#table");
		cellPrototypeNode = document.querySelector("#cellPrototype");

		return getter.then( onGet );
	}

	function initI18n(){
		let joson_list = [
			{ "selector": "title", "property": "innerText", "key": "extensionOptionName" },
			{ "selector": ".title", "property": "innerText", "key": "extensionOptionName" },
			{ "selector": ".formDescription", "property": "innerText", "key": "extensionOptionDescription" },
			{ "selector": ".presetDescription", "property": "innerText", "key": "extensionPresetDescription" },
			{ "selector": "input.label", "property": "title", "key": "htmlLabelDescription" },
			{ "selector": "input.url", "property": "title", "key": "htmlUrlDescription" },
			{ "selector": ".addBlank", "property": "innerText", "key": "htmlAddBlankFieldButtonName" },
			{ "selector": ".showPreset", "property": "innerText", "key": "htmlAddPresetFieldButtonName" },
			{ "selector": ".labelText", "property": "innerText", "key": "htmlLabelText" },
			{ "selector": ".urlText", "property": "innerText", "key": "htmlUrlText" },
			{ "selector": ".removeField", "property": "innerText", "key": "htmlRemoveButtonName" },
			{ "selector": ".addPreset", "property": "innerText", "key": "htmlAddPresetButtonName" },
			{ "selector": ".contactText", "property": "innerHTML", "key": "htmlContactText" },
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
			"optionList": [],
			"boxFlag": true
		});

		function onGot(res){
			let optionList = res["optionList"];
			for(let item of optionList ){
				addInputField(item["checked"], item["label"], item["url"]);
			}
			resetSort();
		}
		return getter.then(onGot);
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
			show(node);
		}
	}

	function initListener(){
		browser.storage.onChanged.addListener(fileChangeBehavior);
		navNode.addEventListener("click", navBehavior);
		formNode.addEventListener("click", formBehavior);
		presetNode.addEventListener("click", presetBehavior);
		window.addEventListener("mouseup", sortEnd);
		window.addEventListener("mousemove", sortMove);
	}

	function fileChangeBehavior(e){
		console.log(e);
		if ( e["windowId"]["newValue"] != windowId ) {
			let optionList = e["optionList"]["newValue"];
			removeAllField();
			for( let item of optionList ){
				addInputField(item["checked"], item["label"], item["url"]);
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

	function removeActive(){
		let node = navNode.querySelector(".order.active");
		if( node ){
			node.classList.remove("active");
		}
	}

	function addActive(txt){
		let node = navNode.querySelector(".order."+txt);
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
		if(cassList.contains("addPreset")){
			addPreset();
		}
	}

	function addPreset(e){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		for(let node of list){
			let checkWrapperNode = node.closest(".checkWrapper");
			let label = checkWrapperNode.querySelector(".label").innerText;
			let p = checkWrapperNode.querySelector(".url").innerText;
			addInputField(true, label, p, "added");
		}
		let promise = saveOption();
		resetPreset();
		showForm();
	}

	function checkPreset(e){
		if( e.target.tagName == "INPUT" ) {
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

	function addInputField( checked=false, label="", url="", cls=null ){
		let node = inputPrototypeNode.cloneNode(true);
		node.removeAttribute("id");
		node.addEventListener("submit", (e)=>{
			e.preventDefault();
		});
		if(cls)node.classList.add(cls);
		let submitButton = node.querySelector(".submit");

		let check = node.querySelector(".check");
		check.checked = checked;
		check.addEventListener("click", (e)=>{
			if(e.target.checked && !node.checkValidity()){
				e.preventDefault();
				e.target.checked = false;
				submitButton.click();
			}
		});
		let labelNode = node.querySelector(".label")
		labelNode.value = label;
		labelNode.addEventListener("change", (e)=>{
			if( !node.checkValidity() ){
				check.checked = false;
				submitButton.click();
			}
		});
		labelNode.addEventListener("blur", blurBehavior);
		let urlNode = node.querySelector(".url");
		urlNode.value = url;
		urlNode.addEventListener("change", (e)=>{
			if( !node.checkValidity() ){
				check.checked = false;
				submitButton.click();
			}
		});
		urlNode.addEventListener("blur", blurBehavior);

		let handleNode = node.querySelector(".handle");
		handleNode.addEventListener("mousedown", sortStart);
		containerNode.appendChild(node);
		show(node);
	}

	function sortStart(e){
		draggedNode = e.target.closest(".draggable");
		holdedNode = draggedNode.cloneNode(true);
		holdedNode.removeAttribute("id");
		holdedNode.classList.add("hold");
		holdedNode.classList.remove("draggable");
		containerNode.insertBefore(holdedNode, draggedNode);
		dy = holdedNode.offsetTop - e.clientY;
		holdedNode.style.top = (e.clientY + dy) +"px";
		draggedNode.classList.add("invisible");
		draggable_list = containerNode.querySelectorAll(".draggable");
		e.preventDefault();
	}

	function isMouseOver(x, y) {
		for( let node of draggable_list ){
			if( node.offsetTop <= y && y <= (node.offsetTop + node.offsetHeight) ){
				return node;
			}
		}
		return null;
	}

	function sortMove(e){
		if(draggedNode){
			holdedNode.style.top = (e.clientY + dy) +"px";
			let overedNode = isMouseOver(e.clientX, e.clientY);
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
			let data = {
				"checked": checked,
				"label": label,
				"url": url
			};
			optionList.push(data);
		}
		return optionList;
	}

	function saveOption(){
		let optionList = makeOptionList();
		let saver = bgPage.saveOption( optionList, windowId );
		return saver.then( ()=>{}, (e)=>{ bgPage.onSaveError(e) } );
	}

	function onError(e){
		console.error(e);
	}
})();
