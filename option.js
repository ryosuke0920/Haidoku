( () => {
	let windowId = Math.random();
	let containerNode;
	let inputPrototypeNode;
	let formNode;
	let pointer;

	let holded;
	let dragged;
	let draggable_list = [];
	let dx = 0;
	let dy = 0;

	document.addEventListener("DOMContentLoaded", init);

	function init(e){
		initProperties();
		initI18n();
		let promise = initField();
		promise.then( initListener, onError );
	}

	function initProperties(){
		containerNode = document.querySelector("#container");
		inputPrototypeNode = document.querySelector("#inputPrototype");
		formNode = document.querySelector("#form");
		pointer = document.querySelector("#pointer");
	}

	function initI18n(){
		let joson_list = [
			{ "selector": ".label", "property": "title", "key": "htmlLabelDescription" },
			{ "selector": ".url", "property": "title", "key": "htmlUrlDescription" },
			{ "selector": ".addBlank", "property": "innerText", "key": "htmlAddBlankFieldButtonName" },
			{ "selector": ".addPriset", "property": "innerText", "key": "htmlAddPresetFieldButtonName" },
			{ "selector": ".labelText", "property": "innerText", "key": "htmlLabelText" },
			{ "selector": ".urlText", "property": "innerText", "key": "htmlUrlText" },
			{ "selector": ".removeField", "property": "innerText", "key": "htmlRemoveButtonName" }
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

	function initListener(){
		browser.storage.onChanged.addListener(fileChangeBehavior);
		formNode.addEventListener("click", clickBehavior);
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
		let promise;
		switch(e.target.getAttribute("class")){
			case "label":
			case "url":
				promise = saveOption();
				break;
		}
	}

	function clickBehavior(e){
		let promise;
		switch(e.target.getAttribute("class")){
			case "check":
				saveOption();
				break;
			case "addBlank":
				addInputField();
				resetSort();
				promise = saveOption();
				break;
			case "removeField":
				e.target.closest(".field").remove();
				resetSort();
				promise = saveOption();
				break;
			case "addPreset":
				break;
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
		node.style.display="block";
	}

	function sortStart(e){
		dragged = e.target.closest(".draggable");
		holded = dragged.cloneNode(true);
		holded.removeAttribute("id");
		holded.classList.add("hold");
		holded.classList.remove("draggable");
		containerNode.insertBefore(holded, dragged);
		dx = holded.offsetLeft - e.clientX;
		dy = holded.offsetTop - e.clientY;
		holded.style.left = (e.clientX + dx) +"px";
		holded.style.top = (e.clientY + dy) +"px";
		dragged.classList.add("hide");
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
		if(dragged){
			holded.style.left = (e.clientX + dx) +"px";
			holded.style.top = (e.clientY + dy) +"px";
			let overed = mouseOver(e.clientX, e.clientY);
			if( overed && overed != dragged ) {
				let draggedSort = dragged.getAttribute("sort");
				let overedSort = overed.getAttribute("sort");
				if ( overedSort < draggedSort ) {
					containerNode.insertBefore(dragged, overed);
				}
				else if ( draggedSort < overedSort ) {
					containerNode.insertBefore(dragged, overed.nextElementSibling);
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
		let list = containerNode.querySelectorAll(".draggable");
		for(let node of list){
			node.classList.remove("hide");
		}
		if ( holded ) holded.remove();
		holded = null;
		draggable_list = [];
		if( dragged ) saveOption();
		dragged = null;
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
		let getter = browser.runtime.getBackgroundPage();

		function onGet(page){
			let metadata = page.makeMetadata(windowId);
			let optionList = makeOptionList();
			let saver = page.saveOption( metadata, optionList );
			return saver;
		}

		return getter.then( onGet, (e)=>{ page.onSaveError(e) } );
	}

	function onError(e){
		console.error(e);
	}
})();
