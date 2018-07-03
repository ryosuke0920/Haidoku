( () => {
	let othersNode = document.querySelector("#others");
	let sampleLinkListNode = document.querySelector("#"+CSS_PREFIX+"-viewer");
	let linkListStyleNodeList = document.querySelectorAll(".linkListStyle");
	let linkListActionNodeList = document.querySelectorAll(".linkListAction");

	Promise.resolve().then(initOthers).then(initStyle).catch(unexpectedError);

	function initOthers(){
		initI18n();
		initNode();
		initListener();
	}

	function initI18n(){
		let list = [
			{ "selector": ".linkListStyle", "property": "innerText", "key": "htmlLinkListStyle" },
			{ "selector": ".linkListStyleClassic", "property": "innerText", "key": "htmlLinkListStyleClassic" },
			{ "selector": ".linkListStyleDark", "property": "innerText", "key": "htmlLinkListStyleDark" },
			{ "selector": ".linkListAction", "property": "innerText", "key": "htmlLinkListAction" },
			{ "selector": ".linkListActionNormal", "property": "innerText", "key": "htmlLinkListActionNormal" },
			{ "selector": ".linkListActionMouseover", "property": "innerText", "key": "htmlLinkListActionMouseover" },
			{ "selector": "."+CSS_PREFIX+"-zoomDown", "property": "title", "key": "htmlZoomDown" },
			{ "selector": "."+CSS_PREFIX+"-zoomUp", "property": "title", "key": "htmlZoomUp" },
			{ "selector": "."+CSS_PREFIX+"-copy", "property": "title", "key": "htmlCopy" },
			{ "selector": "."+CSS_PREFIX+"-resize", "property": "title", "key": "htmlResize" },
			{ "selector": "."+CSS_PREFIX+"-option", "property": "title", "key": "htmlOption" }
		];
		setI18n(list);
	}

	function initNode(){
		sampleLinkListNode.resetClassStyles = ()=>{
			sampleLinkListNode.classList.remove(CSS_PREFIX+"-dark");
		};
		sampleLinkListNode.resetClassAction = ()=>{
			sampleLinkListNode.classList.remove(CSS_PREFIX+"-mouseover");
		};
		sampleLinkListNode.setClassDarkStyle = ()=>{
			sampleLinkListNode.classList.add(CSS_PREFIX+"-dark");
		};
		sampleLinkListNode.setClassMouseoverStyle = ()=>{
			sampleLinkListNode.classList.add(CSS_PREFIX+"-mouseover");
		};
		for(let i=0; i<linkListStyleNodeList.length; i++) {
			let node = linkListStyleNodeList[i];
			node.addEventListener("click", linkListStyleBehavior);
		}
		for(let i=0; i<linkListActionNodeList.length; i++) {
			let node = linkListActionNodeList[i];
			node.addEventListener("click", linkListActionBehavior);
		}
	}

	function initStyle(){
		let getter = ponyfill.storage.sync.get({
			"cl": LINK_LIST_STYLE_CLASSIC,
			"ca": LINK_LIST_ACTION_NORMAL
		});
		function onGot(res){
			setlinkListStyle(res["cl"]);
			setlinkListAction(res["ca"]);
		}
		return getter.then(onGot);
	}

	function initListener(){
		ponyfill.storage.onChanged.addListener(fileChangeBehavior);
	}

	function fileChangeBehavior(e){
		if( !e.hasOwnProperty("w")) return;
		if( e["w"]["newValue"] == windowId ) return;
		if( e.hasOwnProperty("cl") ) setlinkListStyle(e["cl"]["newValue"]);
		else if( e.hasOwnProperty("ca") ) setlinkListAction(e["ca"]["newValue"]);
	}

	function setlinkListStyle(value){
		let node = othersNode.querySelector(".linkListStyle[value=\""+value+"\"]");
		node.checked = true;
		setSampleLinkListStyle(value);
	}

	function setlinkListAction(value){
		let node = othersNode.querySelector(".linkListAction[value=\""+value+"\"]");
		node.checked = true;
		setSampleLinkListAction(value);
	}

	function linkListStyleBehavior(e){
		let value = e.target.value;
		setSampleLinkListStyle(value);
		savelinkListStyle(value);
	}

	function linkListActionBehavior(e){
		let value = e.target.value;
		setSampleLinkListAction(value);
		savelinkListAction(value);
	}

	function setSampleLinkListStyle(value){
		sampleLinkListNode.resetClassStyles();
		if( value == LINK_LIST_STYLE_DARK ) sampleLinkListNode.setClassDarkStyle();
	}

	function setSampleLinkListAction(value){
		sampleLinkListNode.resetClassAction();
		if( value == LINK_LIST_ACTION_MOUSEOVER ) sampleLinkListNode.setClassMouseoverStyle();
	}

	function savelinkListStyle(value){
		let data = { "cl": value };
		return save(data).catch(onSaveError);
	}

	function savelinkListAction(value){
		let data = { "ca": value };
		return save(data).catch(onSaveError);
	}

})();
