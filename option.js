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
				let select = "#form input[name=register][value=\"" + value + "\"]";
				let checkbox = document.querySelector(select);
				checkbox.setAttribute("checked", true);
			}
*/
			addInputField();
			document.querySelector("#form").addEventListener("click", mainBehavior);
		}

		function onError(e){
			console.log("onError");
			console.error(e);
		}
	}

	function mainBehavior(e){
		switch(e.target.getAttribute("class")){
			case "register":
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
		if (!tmp){
			return null;
		}
		return tmp.value;
	}

	function saveOptions(){
		let fields = document.querySelectorAll("#form .field");
		for( let i=0; i<fields.length; i++){
			let register = fields[i].querySelector(".register");
			let label = fetchValue(fields[i], ".label");
			let url = fetchValue(fields[i], ".url");
			console.log(register);
			console.log(label);
			console.log(url);
		}
		let store_registers = [];
/*
		let registers = document.querySelectorAll("input[name=register]:checked");
		for(let i=0; i<registers.length; i++){
			let value = registers[i].value;
			store_registers.push(value);
		}
*/
		let setter = browser.storage.local.set({
			"registors": store_registers
		});
		setter.then(onSet, onError);

		function onSet(){}

		function onError(e){
			console.log("onError");
			console.error(e);
		}
	}
})();
