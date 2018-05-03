( () => {
	document.addEventListener("DOMContentLoaded", init);
	window.addEventListener("blur",saveOptions);

	function init(e){
		let getter = browser.storage.local.get({
			"optionList": []
		});
		getter.then(onGot, onError);

		function onGot(res){
			addInputField();
			document.querySelector("#form").addEventListener("click", mainBehavior);
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

	function addInputField(){
		let customNode = document.querySelector("#custom");
		let inputPrototypeNode = document.querySelector("#inputPrototype").cloneNode(true);
		inputPrototypeNode.removeAttribute("id");
		customNode.appendChild(inputPrototypeNode);
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
			"updateDate": now.toString()
		};
		return data;
	}

	function makeOptionList(){
		let fields = document.querySelectorAll("#form .field");
		let optionList = [];
		for( let i=0; i<fields.length; i++){
			let check = fields[i].querySelector(".check");
			let checked = check.checked;
			let value = check.value;
			let label = fetchValue(fields[i], ".label");
			let url = fetchValue(fields[i], ".url");
			let id = i+1;
			id = id.toString();
			let data = {
				"id": id,
				"value": value,
				"checked": checked,
				"label": label,
				"url": url,
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
