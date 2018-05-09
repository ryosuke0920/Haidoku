( () => {
	let windowId = Math.random();
	let containerNode;
	let inputPrototypeNode;
	let formNode;

	document.addEventListener("DOMContentLoaded", init);

	function init(e){
		initProperties();
		initI18n();
		let promise = initField();
		promise.then( initListener, onError );
	}

	function initProperties(){
		this.containerNode = document.querySelector("#container");
		this.inputPrototypeNode = document.querySelector("#inputPrototype");
		this.formNode = document.querySelector("#form");
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
		this.formNode.addEventListener("click", clickBehavior);
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
		while(this.containerNode.firstChild){
			this.containerNode.removeChild(this.containerNode.firstChild);
		}
	}

	function resetSort(){
		let fields = this.containerNode.querySelectorAll(".field");
		for(let i=0; i<fields.length; i++){
			let sort = i+1;
			fields[i].setAttribute("sort", sort);
		}
	}

	function addInputField( checked=false, label="", url="", ico="image/dummy.svg" ){
		let node = this.inputPrototypeNode.cloneNode(true);
		node.removeAttribute("id");
		node.querySelector(".check").checked = checked;
		let labelNode = node.querySelector(".label")
		labelNode.value = label;
		labelNode.addEventListener("blur", blurBehavior);
		let urlNode = node.querySelector(".url");
		urlNode.value = url;
		urlNode.addEventListener("blur", blurBehavior);
		node.querySelector(".ico").src = ico;
		this.containerNode.appendChild(node);
		node.style.display="block";
	}

	function fetchValue(element, selector){
		let node = element.querySelector(selector);
		if (!node) return null;
		return node.value;
	}

	function makeOptionList(){
		let optionList = [];
		let fields = this.containerNode.querySelectorAll(".field");
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
