( () => {

	let conf = {
		"defailt":{
			"www.google.co.jp":"1",
			"www.yahoo.co.jp":"2",
			"dictionary.cambridge.org":"3"
		}
	};

	document.querySelector('#optionForm').addEventListener('submit',saveOptions);
	document.addEventListener('DOMContentLoaded', restoreOptions);

	function restoreOptions(e){
		console.log(e);

		let getter = browser.storage.local.get({
			"registors": []
		});
		getter.then(onGot, onError);

		function onGot(res){
			"use strict";
			console.log("onGot");
			console.log(res);
			let registors = res["registors"];
			console.log(registors);
			for(let i=0; i<registors.length; i++){
				console.log("i="+i);

				let value = registors[i];
				console.log("value=" + value);

				let select = "input[name=register][value=\"" + value + "\"]";
				console.log("select="+select);

				let checkbox = document.querySelector(select);
				checkbox.setAttribute("checked", true);
				console.log("checkbox="+checkbox);

			}
		}
		function onError(e){
			console.error(e);
			console.error("getter ng");
		}
	}

	function saveOptions(e){
		e.preventDefault();
		console.log(e);

		let form = e.target;
		let registers = form.querySelectorAll("input[name=register]:checked");
		let store_registers = [];

		for(let i=0; i<registers.length; i++){
			let value = registers[i].value;
			store_registers.push(value);
		}

		console.log(store_registers);

		let setter = browser.storage.local.set({
			"registors": store_registers
		});
		setter.then((e)=>{ok(e)}, ng);

		function ok(e){
			console.log("setter ok");
		}
		function ng(e){
			console.error("setter ng");
		}

	}
})();
