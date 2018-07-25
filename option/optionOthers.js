( () => {
	let othersNode = document.querySelector("#others");
	let sampleLinkListNode = document.querySelector("#"+CSS_PREFIX+"-viewer");
	let linkListStyleNodeList = document.querySelectorAll(".linkListStyle");
	let linkListActionNodeList = document.querySelectorAll(".linkListAction");
	let linkListApiServiceNode = document.querySelector(".linkListApiService");
	let linkListApiLangNode = document.querySelector(".linkListApiLang");
	let linkListApiCutOutNode = document.querySelector(".linkListApiCutOut");
	let apiLangCache = {};
	let apiService = "";

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
			{ "selector": ".linkListActionMouseclick", "property": "innerText", "key": "htmlLinkListActionMouseclick" },
			{ "selector": "."+CSS_PREFIX+"-zoomDown", "property": "title", "key": "htmlZoomDown" },
			{ "selector": "."+CSS_PREFIX+"-zoomUp", "property": "title", "key": "htmlZoomUp" },
			{ "selector": "."+CSS_PREFIX+"-copy", "property": "title", "key": "htmlCopy" },
			{ "selector": "."+CSS_PREFIX+"-resize", "property": "title", "key": "htmlResize" },
			{ "selector": "."+CSS_PREFIX+"-option", "property": "title", "key": "htmlOption" }
		];
		setI18n(list);
	}

	function initNode(){
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
		let lang = getUiLang();
		if( !API_SERVICE.hasOwnProperty(lang) ) lang = DEFAULT_LOCALE;
		let getter = ponyfill.storage.sync.get({
			"cl": LINK_LIST_STYLE_CLASSIC,
			"ca": LINK_LIST_ACTION_MOUSECLICK,
			"s": lang,
			"co": true
		});
		function onGot(res){
			setLinkListStyle(res["cl"]);
			setLinkListAction(res["ca"]);
			setlinkListApiService(res["s"]);
			setlinkListApiCutOut(res["co"]);
		}
		return getter.then(onGot);
	}

	function initListener(){
		ponyfill.storage.onChanged.addListener(fileChangeBehavior);
		linkListApiServiceNode.addEventListener("change", apiServiceBehavior);
		linkListApiCutOutNode.addEventListener("change", apiCutOutBehavior);
	}

	function fileChangeBehavior(e){
		if( !e.hasOwnProperty("w")) return;
		if( e["w"]["newValue"] == windowId ) return;
		if( e.hasOwnProperty("cl") ) setLinkListStyle(e["cl"]["newValue"]);
		else if( e.hasOwnProperty("ca") ) setLinkListAction(e["ca"]["newValue"]);
		else if( e.hasOwnProperty("s") ) setlinkListApiService(e["s"]["newValue"]);
		else if( e.hasOwnProperty("co") ) setlinkListApiCutOut(e["co"]["newValue"]);
	}

	function setLinkListStyle(value){
		let node = othersNode.querySelector(".linkListStyle[value=\""+value+"\"]");
		node.checked = true;
		setSampleLinkListStyle(value);
	}

	function setLinkListAction(value){
		let node = othersNode.querySelector(".linkListAction[value=\""+value+"\"]");
		node.checked = true;
		setSampleLinkListAction(value);
	}

	function setlinkListApiService(value){
		linkListApiServiceNode.value = apiService = value;
	}

	function setlinkListApiCutOut(value){
		linkListApiCutOutNode.checked = value;
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
		sampleLinkListNode.classList.remove(CSS_PREFIX+"-dark");
		if( value == LINK_LIST_STYLE_DARK ) sampleLinkListNode.classList.add(CSS_PREFIX+"-dark");
	}

	function setSampleLinkListAction(value){
		sampleLinkListNode.classList.remove(CSS_PREFIX+"-mouseover");
		sampleLinkListNode.classList.remove(CSS_PREFIX+"-mouseclick");
		removeStopper();
		sampleLinkListNode.removeEventListener("click",removeStopper);
		sampleLinkListNode.removeEventListener("mouseenter", removeStopper);
		sampleLinkListNode.removeEventListener("mouseleave", addStopper);
		if( value == LINK_LIST_ACTION_MOUSEOVER ){
			sampleLinkListNode.classList.add(CSS_PREFIX+"-mouseover");
			addStopper();
			sampleLinkListNode.addEventListener("mouseenter", removeStopper);
			sampleLinkListNode.addEventListener("mouseleave", addStopper);
		}
		else if( value == LINK_LIST_ACTION_MOUSECLICK ){
			sampleLinkListNode.classList.add(CSS_PREFIX+"-mouseclick");
			addStopper();
			sampleLinkListNode.addEventListener("click",removeStopper);
		}
	}

	function addStopper(e){
		sampleLinkListNode.classList.add(CSS_PREFIX+"-stopper");
	}

	function removeStopper(e){
		sampleLinkListNode.classList.remove(CSS_PREFIX+"-stopper");
	}

	function savelinkListStyle(value){
		let data = { "cl": value };
		return saveW(data).catch(onSaveError);
	}

	function savelinkListAction(value){
		let data = { "ca": value };
		return saveW(data).catch(onSaveError);
	}

	function apiServiceBehavior(e){
		let apiService = e.target.value;
		setlinkListApiService(apiService);
		linkListApiLangNode.value="";
		savelinkListApiService(apiService); /* Async */
		if(apiService=="") return;
		apiLangMakeOption(apiService); /* Async */
	}

	function savelinkListApiService(value){
		let data = {
			"s": value,
			"l": ""
		};
		return saveW(data).catch(onSaveError);
	}

	function apiLangMakeOption(apiService){
		if( apiLangCache.hasOwnProperty(apiService) ) return;
		let service = API_SERVICE[apiService];
		let obj = { "service": service };
		let p = Promise.resolve();
		if(!apiLangCache.hasOwnProperty(apiService)){
			p = p.then(
				requestAjaxApiLang.bind(obj)
			).then(
				responseAjaxApiLang.bind(obj)
			);
		}
		return p.then( apiLangAppendOptions );
	}

	function requestAjaxApiLang(){
		let param = [
			{
				"key": "action",
				"value": "query"
			},{
				"key"  :"format",
				"value":"json"
			},{
				"key": "list",
				"value": "categorymembers"
			},{
				"key": "cmtitle",
				"value": API_SERVICE_PROPERTY[this.service].langCat,
			},{
				"key": "cmtype",
				"value": "subcat"
			},{
				"key": "cmlimit",
				"value": "500"
			}
		];
		this.url = makeApiURL(this.service+API_SERVICE_PROPERTY[this.service].path, param, "");
		return promiseAjax("GET", this.url, "json", API_HEADER);
	}

	function responseAjaxApiLang(e){
		console.log(this);
		console.log(e);
	}

	function apiLangAppendOptions(){
	}

	function apiCutOutBehavior(e){
		console.log(e);
		console.log(e.target.checked);
		let data = {
			"co": e.target.checked
		};
		return saveW(data).catch(onSaveError);
	}

})();
