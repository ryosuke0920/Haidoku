(()=>{
	initControl();

	function initControl(){
		console.log("initControl");
		let list = [
			{ "selector": ".displayFunctionTitle", "property": "innerText", "key": "htmlDisplayFunctionTitle" },
			{ "selector": ".domainListTitle", "property": "innerText", "key": "htmlDomainListTitle" },
			{ "selector": "#displayFunctionDescription", "property": "innerText", "key": "htmlDisplayFunctionDescription" },
			{ "selector": "#autoDisplayText", "property": "innerText", "key": "extensionOptionAutoView" },
			{ "selector": "#manualDisplayShiftKeyText", "property": "innerText", "key": "extensionOptionManualViewByShiftKey" },
			{ "selector": "#manualDisplayCtrlKeyText", "property": "innerText", "key": "extensionOptionManualViewByCtrlKey" }
		];
		setI18n(list);
		applyConfig();
		ponyfill.storage.onChanged.addListener(storageOnChageBehavior);
		document.querySelector("#control").addEventListener("click", onClickBehavior);
	}
	function applyConfig(){
		return Promise.resolve().then(getConfig).then(gotConfig);
	}
	function getConfig(){
		return ponyfill.storage.sync.get({
			"bf": DEFAULT_AUTO_VIEW_FLAG,
			"sk": DEFAULT_SHIFT_KEY_VIEW_FLAG,
			"ck": DEFAULT_CTRL_KEY_VIEW_FLAG,
			"dl": DEFAULT_DOMAIN_LIST
		});
	}
	function gotConfig(e){
		applyAutoDisplayCheck(e.bf);
		applyManualDisplayShiftKeyCheck(e.sk);
		applyManualDisplayCtrlKeyCheck(e.ck);
	}
	function storageOnChageBehavior(e){
		if( e.hasOwnProperty("w") && e["w"]["newValue"] == windowId ) return;
		if(e.hasOwnProperty("bf")){
			applyAutoDisplayCheck(e.bf.newValue);
		}
		else if(e.hasOwnProperty("sk")){
			applyManualDisplayShiftKeyCheck(e.sk.newValue);
		}
		else if(e.hasOwnProperty("ck")){
			applyManualDisplayCtrlKeyCheck(e.ck.newValue);
		}
	}
	function applyAutoDisplayCheck(value){
		document.querySelector("#autoDisplayCheck").checked = value;
	}
	function applyManualDisplayShiftKeyCheck(value){
		document.querySelector("#manualDisplayShiftKeyCheck").checked = value;
	}
	function applyManualDisplayCtrlKeyCheck(value){
		document.querySelector("#manualDisplayCtrlKeyCheck").checked = value;
	}
	function onClickBehavior(e){
		if(e.target.id == "autoDisplayCheck"){
			saveW({"bf": e.target.checked}).catch(onSaveError);
		}
		else if(e.target.id == "manualDisplayShiftKeyCheck"){
			saveW({"sk": e.target.checked}).catch(onSaveError);
		}
		else if(e.target.id == "manualDisplayCtrlKeyCheck"){
			saveW({"ck": e.target.checked}).catch(onSaveError);
		}
	}

})();
