( () => {
	document.addEventListener("DOMContentLoaded", initOptions);

	let buttons = document.querySelectorAll(".addInputField");
	for(let i=0; i<buttons.length; i++){
		console.log(buttons[i]);
		buttons[i].addEventListener("click", addInputField);
	}

	let removeFieldNode = document.querySelectorAll(".removeField");
	for(let i=0; i<removeFieldNode.length; i++){
		console.log(removeFieldNode[i]);
		removeFieldNode[i].addEventListener("click", removeField);
	}
	addInputField();

	function removeField(){
		console.log("removeField");
	}

	function addInputField(){
		console.log("addInputField");
		let customNode = document.querySelector("#custom");
		console.log(customNode);
		let inputPrototypeNode = document.querySelector("#inputPrototype");
		inputPrototypeNode = inputPrototypeNode.cloneNode(true);
		inputPrototypeNode.removeAttribute("id");
		customNode.appendChild(inputPrototypeNode);
		inputPrototypeNode.style.display="block";
		console.log(inputPrototypeNode);
	}

	function initOptions(e){
		console.log("initOptions");

		let getter = browser.storage.local.get({
			"registors": []
		});
		getter.then(onGot, onError).then(addEvents, onError);

		function onGot(res){
			console.log("onGot");
			console.log(res);
			let registors = res["registors"];
			console.log(registors);
			for(let i=0; i<registors.length; i++){
				let value = registors[i];
				console.log("value=" + value);
				let select = "input[name=register][value=\"" + value + "\"]";
				console.log("select="+select);
				let checkbox = document.querySelector(select);
				console.log(checkbox);
				checkbox.setAttribute("checked", true);
			}
		}

		function addEvents(res){
			console.log("aadEvents");
			let inputs = document.querySelectorAll('input[name="register"]');
			for( let i=0; i<inputs.length; i++){
				inputs[i].addEventListener("CheckboxStateChange", saveOptions);
			}
		}

		function onError(e){
			console.log("onError");
			console.error(e);
		}
	}

	function saveOptions(e){
		console.log("saveOptions");
		e.preventDefault();
		let registers = document.querySelectorAll("input[name=register]:checked");
		let store_registers = [];
		for(let i=0; i<registers.length; i++){
			let value = registers[i].value;
			store_registers.push(value);
		}
		console.log(store_registers);
		let setter = browser.storage.local.set({
			"registors": store_registers
		});
		setter.then(onSet, onError);

		function onSet(){
			console.log("onSet");
		}

		function onError(e){
			console.log("onError");
			console.error(e);
		}
	}
})();
