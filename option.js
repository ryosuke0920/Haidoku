( () => {
	let windowId = Math.random();
	let form = document.querySelector("#form");

	document.addEventListener("DOMContentLoaded", init);

	function init(e){
		let getter = browser.storage.local.get({
			"optionList": null
		});
		getter.then(onGot, onError);

		function onGot(res){
			let optionList;
			if (!res["optionList"]){
				optionList = [
					{
						"checked": true,
						"label": "Google",
						"url": "https://www.google.co.jp/search?q=$1",
						"ico": "image/www.google.co.jp.ico"
					},
					{
						"checked": true,
						"label": "Google Translate en->ja",
						"url": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1",
						"ico": "image/translate.google.co.jp.ico"
					},
					{
						"checked": true,
						"label": "Google Translate ja->en",
						"url": "https://translate.google.co.jp/?hl=ja&tab=TT#ja/en/$1",
						"ico": "image/translate.google.co.jp.ico"
					},
					{
						"checked": true,
						"label": "Yahoo!",
						"url": "https://search.yahoo.co.jp/q=$1",
						"ico": "image/dummy.svg"
					},
					{
						"checked": true,
						"label": "Cambridge",
						"url": "https://dictionary.cambridge.org/search/english/direct/?q=$1",
						"ico": "image/dictionary.cambridge.org.ico"
					}
				];
			}
			else {
				optionList = res["optionList"];
			}
			resetInputField();
			for(let i=0; i<optionList.length; i++){
				let item = optionList[i];
				addInputField(item["checked"], item["label"], item["url"], item["ico"]);
			}
			browser.storage.onChanged.addListener(fileChangeBehavior);
			let inputs = document.querySelectorAll(".label,.url");
			for(let i=0; i<inputs.length; i++){
				inputs[i].addEventListener("blur", blurBehavior);
			}
			form.addEventListener("click", clickBehavior);
		}
	}

	function fileChangeBehavior(e){
		console.log("windowId="+windowId);
		console.log("fileChangeBehavior");
		if ( e["metadata"]["newValue"]["windowId"] != windowId) {
			let optionList = e["optionList"]["newValue"];
			resetInputField();
			for(let i=0; i<optionList.length; i++){
				let item = optionList[i];
				addInputField(item["checked"], item["label"], item["url"], item["ico"]);
			}
		}
		console.log("fileChangeBehavior drop.");
	}

	function blurBehavior(e){
		console.log("blurBehavior");
		switch(e.target.getAttribute("class")){
			case "label":
			case "url":
				saveOptions();
				break;
		}
		console.log("blurBehavior drop.");
	}

	function clickBehavior(e){
		console.log("clickBehavior");
		switch(e.target.getAttribute("class")){
			case "check":
				saveOptions();
				break;
			case "add":
				addInputField();
				saveOptions();
				break;
			case "removeField":
				e.target.closest(".field").remove();
				saveOptions();
				break;
		}
		console.log("clickBehavior drop.");
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
		let fields = form.querySelectorAll(".field");
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

	function saveOptions(){
		let setter = browser.storage.local.set({
			"metadata": makeMetadata(),
			"optionList": makeOptionList()
		});
		setter.then(onSet, onError);

		function onSet(){
		}

		function onError(e){
			console.error(e);
			browser.notifications.create({
				"type": "basic",
				"title": browser.i18n.getMessage("extensionName"),
				"message": browser.i18n.getMessage("notificationSaveOptionError")
			});
		}
	}

	function onError(e){
		console.error(e);
	}

})();
( () => {
	let list;
	list = document.querySelectorAll(".url");
	for( let i=0; i<list.length; i++){
		list[i].setAttribute("title", "the url you want to go. if you set \"$1\", it will be replaced to the words you selected.");
	}
	list = document.querySelectorAll(".label");
	for( let i=0; i<list.length; i++){
		list[i].setAttribute("title", "this will be appeared in the context menu.");
	}
	list = document.querySelectorAll(".add");
	for( let i=0; i<list.length; i++){
		list[i].innerText = "add";
	}
})();
