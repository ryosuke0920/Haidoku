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
		let inputPrototypeNode = document.querySelector("#inputPrototype");
		inputPrototypeNode = inputPrototypeNode.cloneNode(true);
		inputPrototypeNode.removeAttribute("id");
		customNode.appendChild(inputPrototypeNode);
		inputPrototypeNode.style.display="block";
	}


	function saveOptions(){
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
