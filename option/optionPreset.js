(() => {
	let presetNode = document.querySelector("#preset");
	let tableNode = document.querySelector("#table");
	let cellPrototypeNode = document.querySelector("#cellPrototype");
	let language;
	let languageJson = {};

	Promise.resolve().then( initPreset ).catch( unexpectedError );

	function initPreset(){
		initI18n();
		initNode();
		initListener();
	}

	function initI18n(){
		let list = [
			{ "selector": ".filterText", "property": "innerText", "key": "htmlFilterText" },
			{ "selector": "#languageFilter option[value=\"\"]", "property": "innerText", "key": "htmlLanguageAll" },
			{ "selector": "#languageFilter option[value=en]", "property": "innerText", "key": "htmlLanguageEn" },
			{ "selector": "#languageFilter option[value=ja]", "property": "innerText", "key": "htmlLanguageJa" },
			{ "selector": "#languageFilter option[value=zh]", "property": "innerText", "key": "htmlLanguageZh" },
			{ "selector": ".addPreset", "property": "innerText", "key": "htmlAddPresetButtonName" }
		];
		setI18n(list);
	}

	function initNode(){
		language = ponyfill.i18n.getUILanguage();
		let matcher = language.match("^(.+?)-");
		if ( matcher ) language = matcher[1];
		for(let i=0; i<PRESET_OPTION_LIST.length; i++){
			let option = PRESET_OPTION_LIST[i];
			let node = cellPrototypeNode.cloneNode(true);
			node.removeAttribute("id");
			node.setAttribute("data-language",option["la"]);
			node.querySelector(".label").innerText = option["l"];
			node.querySelector(".url").innerText = option["u"];
			node.addEventListener("click",checkPreset);
			tableNode.appendChild(node);
			languageJson[option["la"]] = true;
		}
		if(languageJson.hasOwnProperty(language)){
			presetNode.querySelector("#languageFilter").value = language;
		}
		languageFilter(language);
	}

	function initListener(){
		presetNode.addEventListener("click", presetBehavior);
		presetNode.querySelector("#languageFilter").addEventListener("change", languageFilterBehavior);
	}

	function presetBehavior(e){
		let cassList = e.target.classList;
		if(cassList.contains("addPreset")){
			if ( !checkPrestLength() ) {
				onCheckPresetLengthError();
				return ;
			}
			addPreset();
		}
	}

	function languageFilterBehavior(e){
		languageFilter(e.target.value);
	}

	function languageFilter(language){
		let list = tableNode.querySelectorAll(".checkWrapper");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			show(node);
		}
		if ( !language || !languageJson.hasOwnProperty(language) ) {
			return;
		}
		list = tableNode.querySelectorAll(".checkWrapper:not([data-language~=\""+language+"\"])");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			hide(node);
		}
	}

	function checkPrestLength(){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		return checkFieldLength(list.length);
	}

	function onCheckPresetLengthError(){
		let sum = ""+0;
		let list = containerNode.querySelectorAll(".field");
		if( list ) sum = list.length;
		let remaining = MAX_FIELD - sum;
		let list2 = tableNode.querySelectorAll(".checkbox:checked");
		let sum2 = 0;
		if( list2 ) sum2 = list2.length;
		return notice( ponyfill.i18n.getMessage("htmlCheckPresetLengthError", [ MAX_FIELD, sum, sum2, remaining ] ));
	}

	function addPreset(e){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			let checkWrapperNode = node.closest(".checkWrapper");
			let label = checkWrapperNode.querySelector(".label").innerText;
			let p = checkWrapperNode.querySelector(".url").innerText;
			addNewField(true, true, label, p);
		}
		let promise = saveOption();
		resetPreset();
		resetSort();
		showForm();
		smoothScroll();
	}

	function checkPreset(e){
		if( e.target.tagName == "INPUT" ) {
			/* input type="checkbox" */
			return;
		}
		let checkboxNode = this.querySelector(".checkbox");
		checkboxNode.checked = !checkboxNode.checked;
	}

	function resetPreset(){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			node.checked = false;
		}
	}

})();
