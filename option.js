( () => {
	let windowId = Math.random();
	document.addEventListener("DOMContentLoaded", init);

	function init(e){
		let getter = browser.storage.local.get({
			"optionList": null
		});
		getter.then(onGot, onError);

		function onGot(res){
			let optionList = res["optionList"];
			for(let i=0; i<optionList.length; i++){
				let item = optionList[i];
				addInputField(item["checked"], item["label"], item["url"], item["ico"]);
			}
			browser.storage.onChanged.addListener(fileChangeBehavior);
			let inputs = document.querySelectorAll(".label,.url");
			for(let i=0; i<inputs.length; i++){
				inputs[i].addEventListener("blur", blurBehavior);
			}
			document.querySelector("#form").addEventListener("click", clickBehavior);
		}
	}

	function fileChangeBehavior(e){
		if ( e["metadata"]["newValue"]["windowId"] != windowId) {
			let optionList = e["optionList"]["newValue"];
			resetInputField();
			for(let i=0; i<optionList.length; i++){
				let item = optionList[i];
				addInputField(item["checked"], item["label"], item["url"], item["ico"]);
			}
		}
	}

	function blurBehavior(e){
		switch(e.target.getAttribute("class")){
			case "label":
			case "url":
				saveOption();
				break;
		}
	}

	function clickBehavior(e){
		switch(e.target.getAttribute("class")){
			case "check":
				saveOption();
				break;
			case "addBlank":
				addInputField();
				saveOption();
				break;
			case "removeField":
				e.target.closest(".field").remove();
				saveOption();
				break;
			case "addPreset":
				break;
		}
	}

	function resetInputField(){
		let container = document.querySelector("#container");
		while(container.firstChild){
			container.removeChild(container.firstChild);
		}
	}

	function addInputField( checked=false, label="", url="", ico="image/dummy.svg" ){
		let inputPrototypeNode = document.querySelector("#inputPrototype").cloneNode(true);
		inputPrototypeNode.removeAttribute("id");
		inputPrototypeNode.querySelector(".check").checked = checked;
		inputPrototypeNode.querySelector(".label").value = label;
		inputPrototypeNode.querySelector(".url").value = url;
		inputPrototypeNode.querySelector(".ico").src = ico;
		let container = document.querySelector("#container");
		container.appendChild(inputPrototypeNode);
		inputPrototypeNode.style.display="block";
	}

	function fetchValue(element, selector){
		let tmp = element.querySelector(selector);
		if (!tmp) return null;
		return tmp.value;
	}

	function makeMetadata(){
		let manifest = browser.runtime.getManifest();
		let now = new Date();
		let data = {
			"version": manifest.version,
			"updateDate": now.toString(),
			"windowId": windowId
		};
		return data;
	}

	function makeOptionList(){
		let optionList = [];
		let fields = document.querySelectorAll("#form .field");
		for( let i=0; i<fields.length; i++){
			let field = fields[i];
			let checked = field.querySelector(".check").checked;
			let label = fetchValue(field, ".label");
			let url = fetchValue(field, ".url");
			let ico = field.querySelector(".ico").src;
			let id = ( "" + (i+1) ).toString();
			let data = {
				"id": id,
				"checked": checked,
				"label": label,
				"url": url,
				"ico": ico,
				"sort": i
			};
			//console.log(data);
			optionList.push(data);
		}
		return optionList;
	}

	function saveOption(){
		let getter = browser.runtime.getBackgroundPage();
		getter.then( onGet, onError );

		function onGet(page){
			let metadata = page.makeMetadata(windowId);
			let optionList = makeOptionList();
			let saver = page.saveOption( metadata, optionList );
			return saver;
		}
	}

	function onError(e){
		console.error(e);
	}

})();
( () => {
	let list;
	list = document.querySelectorAll(".label");
	for( let i=0; i<list.length; i++){
		list[i].setAttribute("title", browser.i18n.getMessage("htmlLabelDescription"));
	}
	list = document.querySelectorAll(".url");
	for( let i=0; i<list.length; i++){
		list[i].setAttribute("title", browser.i18n.getMessage("htmlUrlDescription"));
	}
	list = document.querySelectorAll(".addBlank");
	for( let i=0; i<list.length; i++){
		list[i].innerText = browser.i18n.getMessage("htmlAddBlankFieldButtonName");
	}
	list = document.querySelectorAll(".addPriset");
	for( let i=0; i<list.length; i++){
		list[i].innerText = browser.i18n.getMessage("htmlAddPresetFieldButtonName");
	}
	list = document.querySelectorAll(".labelText");
	for( let i=0; i<list.length; i++){
		list[i].innerText = browser.i18n.getMessage("htmlLabelText");
	}
	list = document.querySelectorAll(".urlText");
	for( let i=0; i<list.length; i++){
		list[i].innerText = browser.i18n.getMessage("htmlUrlText");
	}
	list = document.querySelectorAll(".removeField");
	for( let i=0; i<list.length; i++){
		list[i].innerText = browser.i18n.getMessage("htmlRemoveButtonName");
	}
})();
