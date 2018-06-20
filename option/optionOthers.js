( () => {
	const CLASS_PREFIX = "lessLaborGoToDictionary";
	let othersNode = document.querySelector("#others");
	let sampleLinkListNode = document.querySelector("#sampleLinkList");
	let linkListClassNodeList = document.querySelectorAll(".linkListClass");
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
			{ "selector": ".linkListStylePop", "property": "innerText", "key": "htmlLinkListStylePop" },
			{ "selector": ".lessLaborGoToDictionary-zoomDown", "property": "src", "value": ponyfill.extension.getURL("/image/minus.svg"), },
			{ "selector": ".lessLaborGoToDictionary-zoomUp", "property": "src", "value": ponyfill.extension.getURL("/image/plus.svg"), }
		];
		setI18n(list);
	}

	function initNode(){
		sampleLinkListNode.resetClassStyles = ()=>{
			sampleLinkListNode.classList.remove(CLASS_PREFIX+"-dark");
			sampleLinkListNode.classList.remove(CLASS_PREFIX+"-pop");
		};
		sampleLinkListNode.setClassDarkStyle = ()=>{
			sampleLinkListNode.classList.add(CLASS_PREFIX+"-dark");
		};
		sampleLinkListNode.setClassPopStyle = ()=>{
			sampleLinkListNode.classList.add(CLASS_PREFIX+"-pop");
		};
		for(let i=0; i<linkListClassNodeList.length; i++) {
			let node = linkListClassNodeList[i];
			node.addEventListener("click", linkListClassBehavior);
		}
	}

	function initStyle(){
		let getter = ponyfill.storage.sync.get({
			"cl": ""
		});
		function onGot(res){
			setLinkListClass(res["cl"]);
		}
		return getter.then(onGot);
	}

	function initListener(){
		ponyfill.storage.onChanged.addListener(fileChangeBehavior);
	}

	function fileChangeBehavior(e){
		if( !e.hasOwnProperty("w")) return;
		if( e["w"]["newValue"] == windowId ) return;
		if( e.hasOwnProperty("cl") ){
			setLinkListClass(e["cl"]["newValue"]);
		}
	}

	function setLinkListClass(value){
		let node = othersNode.querySelector(".linkListClass[value=\""+value+"\"]");
		node.checked = true;
		setSampleLinkListStyle(value);
	}

	function linkListClassBehavior(e){
		let value = e.target.value;
		setSampleLinkListStyle(value);
		saveLinkListClass(value);
	}

	function setSampleLinkListStyle(value){
		sampleLinkListNode.resetClassStyles();
		if( value == "p" ){
			sampleLinkListNode.setClassPopStyle();
		}
		else if( value == "d" ){
			sampleLinkListNode.setClassDarkStyle();
		}
	}

	function saveLinkListClass(value){
		let data = { "cl": value };
		return save(data).catch(onSaveError);
	}

})();
