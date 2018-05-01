( () => {
	document.addEventListener("DOMContentLoaded", init);

	function init(e){
		let getter = browser.storage.local.get({
			"registors": []
		});
		getter.then(onGot, onError);

		function onGot(res){
/*
			let registors = res["registors"];
			for(let i=0; i<registors.length; i++){
				let value = registors[i];
				let select = "#form input[name=check][value=\"" + value + "\"]";
				let checkbox = document.querySelector(select);
				checkbox.setAttribute("checked", true);
			}
*/
			addInputField();
			document.querySelector("#form").addEventListener("click", mainBehavior);
		}

		function onError(e){
			console.error(e);
		}
	}

	function mainBehavior(e){
		switch(e.target.getAttribute("class")){
			case "check":
				saveOptions();
				return;
			case "add":
				addInputField();
				return;
			case "removeField":
				e.target.closest(".field").remove();
				return;
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
		console.log(data);
		return data;
	}

	function saveOptions(){
		let fields = document.querySelectorAll("#form .field");
		let optionList = [];
		for( let i=0; i<fields.length; i++){
			let check = fields[i].querySelector(".check");
			let checked = check.checked;
			let value = check.value;
			let label = fetchValue(fields[i], ".label");
			let url = fetchValue(fields[i], ".url");
			let data = {
				"id": (i+1),
				"value": value,
				"checked": checked,
				"label": label,
				"url": url,
				"sort": i,
			};
			optionList.push(data);
		}
		let setter = browser.storage.local.set({
			"metadata": makeMetadata(),
			"optionList": optionList
		});
		setter.then(onSet, onError);

		function onSet(){
			console.log("optionList saved.");
		}

		function onError(e){
			console.error(e);
		}
	}
})();
