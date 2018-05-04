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
			console.log(res);
			let optionList;
			if (!res["optionList"]){
				console.log("no data");
				optionList = [
					{
						"checked": true,
						"label": "Google",
						"url": "https://www.google.co.jp/search?q=$1",
						"ico": "ico/www.google.co.jp.ico"
					},
					{
						"checked": true,
						"label": "Yahoo!",
						"url": "https://search.yahoo.co.jp/q=$1",
						"ico": "ico/dummy.svg"
					},
					{
						"checked": true,
						"label": "Cambridge",
						"url": "https://dictionary.cambridge.org/search/english/direct/?q=$1",
						"ico": "ico/dictionary.cambridge.org.ico"
					}
				];
			}
			else {
				console.log("has data");
				optionList = res["optionList"];
			}
			console.log(optionList);
			for(let i=0; i<optionList.length; i++){
				let item = optionList[i];
				addInputField(item["checked"], item["label"], item["url"], item["ico"]);
			}
			browser.storage.onChanged.addListener(fileChangeBehavior);
			window.addEventListener("blur",saveOptions);
			form.addEventListener("click", mainBehavior);
		}
	}

	function fileChangeBehavior(e){
		if ( e["metadata"]["newValue"]["windowId"] != windowId) {
			let newValue = e["optionList"]["newValue"];
			makeForm(e["optionList"]["newValue"]);
		}
	}

	function mainBehavior(e){
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
				break;
		}
	}

	function makeForm(optionList){
		console.log(optionList);
	}

	function addInputField( checked=false, label="", url="", ico="ico/dummy.ico" ){
		let inputPrototypeNode = document.querySelector("#inputPrototype").cloneNode(true);
		inputPrototypeNode.removeAttribute("id");
		inputPrototypeNode.querySelector(".check").checked = checked;
		inputPrototypeNode.querySelector(".label").value = label;
		inputPrototypeNode.querySelector(".url").value = url;
		inputPrototypeNode.querySelector(".ico").src = ico;
		form.appendChild(inputPrototypeNode);
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
		let fields = form.querySelectorAll(".field");
		let optionList = [];
		for( let i=0; i<fields.length; i++){
			let check = fields[i].querySelector(".check");
			let checked = check.checked;
			let value = check.value;
			let label = fetchValue(fields[i], ".label");
			let url = fetchValue(fields[i], ".url");
			let ico = fields[i].querySelector(".ico").src;
			let id = i+1;
			id = id.toString();
			let data = {
				"id": id,
				"value": value,
				"checked": checked,
				"label": label,
				"url": url,
				"ico": ico,
				"sort": i
			};
			optionList.push(data);
		}
		return optionList;
	}

	function saveOptions(){
		let setter = browser.storage.local.set({
			"metadata": makeMetadata(),
			"optionList": makeOptionList()
		});
		let promise = setter.then(onSet, onError);

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
})();
