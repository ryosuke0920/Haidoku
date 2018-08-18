( () => {
	const API_LANGUAGE_MAX = 10;
	let othersNode = document.querySelector("#others");
	let sampleLinkListNode = othersNode.querySelector("#"+CSS_PREFIX+"-viewer");
	let serviceCodeSelectNode = othersNode.querySelector(".serviceCodeSelect");
	let apiCutOutNode = othersNode.querySelector(".apiCutOut");
	let downloadLanguagePaneNode = othersNode.querySelector("#downloadLanguagePane");
	let languageFilterBoxNodes = othersNode.querySelectorAll(".languageFilterBox");
	let languageFilterSelectPaneNode = document.querySelector("#languageFilterSelectPane");
	let languageFilterContainerNode = languageFilterSelectPaneNode.querySelector("#languageFilterContainer");
	let apiLangPrefixSelectNode = languageFilterSelectPaneNode.querySelector(".apiLangPrefixSelect");
	let languageFilterCache = {};
	let apiPrefixCache = {};
	let languageFilterlist = [];
	let faviconCache = {};
	let optionList = [];

	initOthers();
	Promise.resolve().then(getFavicon).then(gotFavicon).then(initProperties).catch(unexpectedError);

	function initOthers(){
		initI18n();
		initNode();
	}

	function initI18n(){
		let list = [
			{ "selector": ".linkListStyleTitle", "property": "innerText", "key": "htmlLinkListStyleTitle" },
			{ "selector": ".linkListStyleClassic", "property": "innerText", "key": "htmlLinkListStyleClassic" },
			{ "selector": ".linkListStyleDark", "property": "innerText", "key": "htmlLinkListStyleDark" },
			{ "selector": ".linkListActionTitle", "property": "innerText", "key": "htmlLinkListActionTitle" },
			{ "selector": ".linkListActionNormal", "property": "innerText", "key": "htmlLinkListActionNormal" },
			{ "selector": ".linkListActionMouseover", "property": "innerText", "key": "htmlLinkListActionMouseover" },
			{ "selector": ".linkListActionMouseclick", "property": "innerText", "key": "htmlLinkListActionMouseclick" },
			{ "selector": "."+CSS_PREFIX+"-zoomDown", "property": "title", "key": "htmlZoomDown" },
			{ "selector": "."+CSS_PREFIX+"-zoomUp", "property": "title", "key": "htmlZoomUp" },
			{ "selector": "."+CSS_PREFIX+"-copy", "property": "title", "key": "htmlCopy" },
			{ "selector": "."+CSS_PREFIX+"-resize", "property": "title", "key": "htmlResize" },
			{ "selector": "."+CSS_PREFIX+"-option", "property": "title", "key": "htmlOption" },
			{ "selector": ".linkListLayoutTitle", "property": "innerText", "key": "htmlLinkListLayoutTitle" },
			{ "selector": ".linkListLayoutPatternTitle", "property": "innerText", "key": "htmlLinkListLayoutPatternTitle" },
			{ "selector": ".faviconDisplayTitle", "property": "innerText", "key": "htmlFaviconDisplayTitle" },
			{ "selector": ".faviconDisplayNormal", "property": "innerText", "key": "htmlFaviconDisplayNormal" },
			{ "selector": ".faviconDisplayOnly", "property": "innerText", "key": "htmlFaviconDisplayOnly" },
			{ "selector": ".linkListDirectionTitle", "property": "innerText", "key": "htmLinkListDirectionTitle" },
			{ "selector": ".linkListDirectionHorizontal", "property": "innerText", "key": "htmlLinkListDirectionHorizontal" },
			{ "selector": ".linkListDirectionVertical", "property": "innerText", "key": "htmlLinkListDirectionVertical" },
			{ "selector": ".linkListSeparatorTitle", "property": "innerText", "key": "htmlLinkListSeparatorTitle" },
			{ "selector": ".linkListSeparatorHorizontal", "property": "innerText", "key": "htmlLinkListSeparatorHorizontal" },
			{ "selector": ".linkListSeparatorVertical", "property": "innerText", "key": "htmlLinkListSeparatorVertical" },
			{ "selector": ".apiServiceTitle", "property": "innerText", "key": "htmlApiServiceTitle" },
			{ "selector": ".apiServiceDescription", "property": "innerText", "key": "htmlApiServiceDescription" },
			{ "selector": ".serviceCodeTitle", "property": "innerText", "key": "htmlServiceCodeTitle" },
			{ "selector": ".serviceCodeDescription", "property": "innerText", "key": "htmlServiceCodeDescription" },
			{ "selector": ".serviceCodeNone", "property": "innerText", "key": "htmlServiceCodeNone" },
			{ "selector": ".serviceCodeEn", "property": "innerText", "key": "htmlServiceCodeEn" },
			{ "selector": ".serviceCodeJa", "property": "innerText", "key": "htmlServiceCodeJa" },
			{ "selector": ".serviceCodeSelectMessage", "property": "innerText", "key": "htmlServiceCodeSelectMessage" },
			{ "selector": ".languageFilterTitle", "property": "innerText", "key": "htmlLanguageFilterTitle" },
			{ "selector": ".languageFilterDescription", "property": "innerText", "key": "htmlLanguageFilterDescription" },
			{ "selector": ".languageFilterAside", "property": "innerText", "key": "htmlLanguageFilterAside" },
			{ "selector": ".addLanguageFilter", "property": "innerText", "key": "htmlAddLanguageFilter" },
			{ "selector": ".languageFilterSelectedDescription", "property": "innerText", "key": "htmlLanguageFilterSelectedDescription" },
			{ "selector": ".languageFilterDownloadMessage", "property": "innerText", "key": "htmlLanguageFilterDownloadMessage" },
			{ "selector": ".apiCutOutTitle", "property": "innerText", "key": "htmlApiCutOutTitle" },
			{ "selector": ".apiCutOutDescription", "property": "innerText", "key": "htmlApiCutOutDescription" },
			{ "selector": ".apiCutOutLabel", "property": "innerText", "key": "htmlApiCutOutLabel" },
			{ "selector": ".linkListSampleTitle", "property": "innerText", "key": "htmlLinkListSampleTitle" }
		];
		setI18n(list);
	}

	function initNode(){
		window.addEventListener("click", hideInputMessage);
		ponyfill.storage.onChanged.addListener(fileChangeBehavior);
		languageFilterSelectPaneNode.addEventListener("click", apiLangPaneClickBehavior);
		apiLangPrefixSelectNode.addEventListener("change", apiLangPrefixSelectChangeBehavior);
		othersNode.addEventListener("click", otherNodeClickBehavior);
		othersNode.addEventListener("change", otherNodeChangeBehavior);
		ponyfill.runtime.onMessage.addListener( notify );
	}

	function hideInputMessage(e){
		if(e.target.closest(".addLanguageFilter")) return;
		let list = othersNode.querySelectorAll(".inputMessage:not(.hide)");
		for(let i=0; i<list.length; i++){
			hide(list[i]);
		}
	}

	function initProperties(){
		let serviceCode = getDefaultServiceCode();
		let languageFilter = getDefaultLanguageFilter();
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"cl": LINK_LIST_STYLE_DARK,
			"ca": LINK_LIST_ACTION_MOUSECLICK,
			"f": LINK_LIST_FAVICON_ONLY,
			"ld": LINK_LIST_DIRECTION_VERTICAL,
			"ls": LINK_LIST_SEPARATOR_VERTICAL,
			"s": serviceCode,
			"ll": languageFilter,
			"co": true,
		});
		return getter.then(onGot);
	}

	function onGot(res){
		setOptionList(res["ol"]);
		setSampleLinkListAnchor(res["ol"]);
		setLinkListStyle(res["cl"]);
		setSampleLinkListStyle(res["cl"]);
		setLinkListAction(res["ca"]);
		setSampleLinkListAction(res["ca"]);
		setFaviconDisplay(res["f"]);
		setSampleLinkListFaviconDisplay(res["f"]);
		setLinkListDirection(res["ld"]);
		setSampleLinkListDirection(res["ld"]);
		setLinkListSeparator(res["ls"]);
		setSampleLinkListSeparator(res["ls"]);
		setServiceCode(res["s"]);
		setSampleLinkListServiceCode(res["s"]);
		setLanguageFilterList(res["ll"]);
		makeLanguageFilterListNodes();
		setApiCutOut(res["co"]);
	}

	function notify(e){
		if(e.method == "updateFaviconCache") {
			faviconCache = e.data;
			setSampleLinkListAnchor(getOptionList());
		}
	}

	function otherNodeClickBehavior(e){
		if( e.target.classList.contains("linkListLayoutPattern") ){
			changeLayout(e.target.value);
			removeStopper();
		}
		else if( e.target.classList.contains("addLanguageFilter") ){
			addLanguageFilterClickBehavior();
		}
		else if( e.target.classList.contains("removeLanguageButtom") ){
			let node = e.target.closest("[data-language]");
			let language = node.getAttribute("data-language");
			apiRemoveLanguage(language);
			languageFilterCheckboxInactive(language);
		}
	}

	function otherNodeChangeBehavior(e){
		if( e.target.classList.contains("linkListStyle") ){
			setSampleLinkListStyle(e.target.value);
			saveLinkListStyle(e.target.value).catch(onSaveError);
			removeStopper();
		}
		else if( e.target.classList.contains("linkListAction") ){
			setSampleLinkListAction(e.target.value);
			saveLinkListAction(e.target.value).catch(onSaveError);
		}
		else if( e.target.classList.contains("faviconDisplay") ){
			setSampleLinkListFaviconDisplay(e.target.value);
			saveFaviconDisplay(e.target.value).catch(onSaveError);
		}
		else if( e.target.classList.contains("linkListDirection") ){
			setSampleLinkListDirection(e.target.value);
			saveLinkListDirection(e.target.value).catch(onSaveError);
		}
		else if( e.target.classList.contains("linkListSeparator") ){
			setSampleLinkListSeparator(e.target.value);
			saveLinkListSeparator(e.target.value).catch(onSaveError);
		}
		else if( e.target.classList.contains("serviceCodeSelect") ){
			serviceCodeChangeBehavior(e.target.value)
		}
		else if( e.target.classList.contains("apiCutOut") ){
			return saveCutOutFlag(e.target.checked).catch(onSaveError);
		}
	}

	function fileChangeBehavior(e){
		if( e.hasOwnProperty("ol") ){
			setOptionList(e["ol"]["newValue"]);
			setSampleLinkListAnchor(e["ol"]["newValue"]);
		}
		if( !e.hasOwnProperty("w")) return;
		if( e["w"]["newValue"] == windowId ) return;
		if( e.hasOwnProperty("cl") ){
			setLinkListStyle(e["cl"]["newValue"]);
			setSampleLinkListStyle(e["cl"]["newValue"]);
		}
		if( e.hasOwnProperty("ca") ){
			setLinkListAction(e["ca"]["newValue"]);
			setSampleLinkListAction(e["ca"]["newValue"]);
		}
		if( e.hasOwnProperty("ld") ) {
			setLinkListDirection(e["ld"]["newValue"]);
			setSampleLinkListDirection(e["ld"]["newValue"]);
		}
		if( e.hasOwnProperty("ls") ) {
			setLinkListSeparator(e["ls"]["newValue"]);
			setSampleLinkListSeparator(e["ls"]["newValue"]);
		}
		if( e.hasOwnProperty("f") ) {
			setFaviconDisplay(e["f"]["newValue"]);
			setSampleLinkListFaviconDisplay(e["f"]["newValue"]);
		}
		if( e.hasOwnProperty("s") ){
			setServiceCode(e["s"]["newValue"]);
			setSampleLinkListServiceCode(e["s"]["newValue"]);
			makeLanguageFilterListNodes();
		}
		if( e.hasOwnProperty("ll") ){
			setLanguageFilterList(e["ll"]["newValue"]);
			makeLanguageFilterListNodes();
			updateLanguageFilterSelectPane(e["ll"]["newValue"]);
		}
		if( e.hasOwnProperty("co") ){
			setApiCutOut(e["co"]["newValue"]);
		}
	}

	function setOptionList(list){
		optionList = list;
	}

	function getOptionList(){
		return optionList;
	}

	function setLinkListStyle(value){
		let node = othersNode.querySelector(".linkListStyle[value=\""+value+"\"]");
		node.checked = true;
	}

	function setLinkListAction(value){
		let node = othersNode.querySelector(".linkListAction[value=\""+value+"\"]");
		node.checked = true;
	}

	function setLinkListDirection(value){
		let node = othersNode.querySelector(".linkListDirection[value=\""+value+"\"]");
		node.checked = true;
	}

	function setLinkListSeparator(value){
		let node = othersNode.querySelector(".linkListSeparator[value=\""+value+"\"]");
		node.checked = true;
	}

	function setFaviconDisplay(value){
		let node = othersNode.querySelector(".faviconDisplay[value=\""+value+"\"]");
		node.checked = true;
	}

	function setServiceCode(value){
		serviceCodeSelectNode.value = value;
	}

	function getServiceCode(){
		return serviceCodeSelectNode.value;
	}

	function clearLanguageListNodes(){
		for(let i=0; i<languageFilterBoxNodes.length; i++){
			let node = languageFilterBoxNodes[i];
			clearChildren(node);
		}
	}

	function makeLanguageFilterListNodes(languages=getLanguageFilterList()){
		clearLanguageListNodes();
		let languageListPrototype = document.querySelector("#languageListPrototype");
		for(let i=0; i<languageFilterBoxNodes.length; i++){
			let node = languageFilterBoxNodes[i];
			for(let j=0; j<languages.length; j++){
				let language = languages[j];
				let li = languageListPrototype.cloneNode(true);
				li.removeAttribute("id");
				li.setAttribute("data-language", language);
				let label = li.querySelector(".languageLabel");
				label.innerText = language;
				node.appendChild(li);
			}
		}
		let list = [];
		if(languages.length > 0){
			list.push({ "selector": ".languageFilterSelectedDescription", "property": "innerText", "key": "htmlLanguageFilterSelectedDescription" });
		}
		else {
			list.push({ "selector": ".languageFilterSelectedDescription", "property": "innerText", "key": "htmlLanguageFilterNoneSelectedDescription" });
		}
		setI18n(list);
	}

	function setLanguageFilterList(value){
		languageFilterlist = value;
	}

	function getLanguageFilterList(){
		return languageFilterlist;
	}

	function getApiService(code=getServiceCode()){
		if( !API_SERVICE.hasOwnProperty(code) ) return API_SERVICE_NONE;
		return API_SERVICE[code];
	}

	function hasLanguageFilterCache(service){
		if( service == API_SERVICE_NONE ) return false;
		return languageFilterCache.hasOwnProperty( service );
	}

	function getLanguageFilterCache(service){
		if( service == API_SERVICE_NONE ) return API_SERVICE_NONE;
		if(!hasLanguageFilterCache(service)) return API_SERVICE_NONE;
		return languageFilterCache[service];
	}

	function setLanguageFilterCache(service, list){
		languageFilterCache[service] = list;
	}

	function deleteLanguageFilterCache(service){
		delete languageFilterCache[service];
	}

	function setPrefixCache(service, hash){
		apiPrefixCache[service] = hash;
	}

	function getPrefixCache(service){
		if( !apiPrefixCache.hasOwnProperty(service) ) return null;
		return apiPrefixCache[service];
	}

	function setApiCutOut(value){
		apiCutOutNode.checked = value;
	}

	function getApiCutOut(){
		return apiCutOutNode.checked;
	}

	function changeLayout(value) {
		if(value=="1"){
			setFaviconDisplay(LINK_LIST_FAVICON_ONLY);
			setSampleLinkListFaviconDisplay(LINK_LIST_FAVICON_ONLY);
			setLinkListDirection(LINK_LIST_DIRECTION_VERTICAL);
			setSampleLinkListDirection(LINK_LIST_DIRECTION_VERTICAL);
			setLinkListSeparator(LINK_LIST_SEPARATOR_VERTICAL);
			setSampleLinkListSeparator(LINK_LIST_SEPARATOR_VERTICAL);
			saveLinkListLayout(LINK_LIST_FAVICON_ONLY,LINK_LIST_DIRECTION_VERTICAL,LINK_LIST_SEPARATOR_VERTICAL).catch(onSaveError);
		}
		else if(value=="2"){
			setFaviconDisplay(LINK_LIST_FAVICON_ONLY);
			setSampleLinkListFaviconDisplay(LINK_LIST_FAVICON_ONLY);
			setLinkListDirection(LINK_LIST_DIRECTION_HORIZAONTAL);
			setSampleLinkListDirection(LINK_LIST_DIRECTION_HORIZAONTAL);
			setLinkListSeparator(LINK_LIST_SEPARATOR_HORIZONTAL);
			setSampleLinkListSeparator(LINK_LIST_DIRECTION_HORIZAONTAL);
			saveLinkListLayout(LINK_LIST_FAVICON_ONLY,LINK_LIST_DIRECTION_HORIZAONTAL,LINK_LIST_DIRECTION_HORIZAONTAL).catch(onSaveError);
		}
		else if(value=="3"){
			setFaviconDisplay(LINK_LIST_FAVICON_NORMAL);
			setSampleLinkListFaviconDisplay(LINK_LIST_FAVICON_NORMAL);
			setLinkListDirection(LINK_LIST_DIRECTION_VERTICAL);
			setSampleLinkListDirection(LINK_LIST_DIRECTION_VERTICAL);
			setLinkListSeparator(LINK_LIST_SEPARATOR_HORIZONTAL);
			setSampleLinkListSeparator(LINK_LIST_DIRECTION_HORIZAONTAL);
			saveLinkListLayout(LINK_LIST_FAVICON_NORMAL,LINK_LIST_DIRECTION_VERTICAL,LINK_LIST_DIRECTION_HORIZAONTAL).catch(onSaveError);
		}
		else if(value=="4"){
			setFaviconDisplay(LINK_LIST_FAVICON_NORMAL);
			setSampleLinkListFaviconDisplay(LINK_LIST_FAVICON_NORMAL);
			setLinkListDirection(LINK_LIST_DIRECTION_VERTICAL);
			setSampleLinkListDirection(LINK_LIST_DIRECTION_VERTICAL);
			setLinkListSeparator(LINK_LIST_SEPARATOR_VERTICAL);
			setSampleLinkListSeparator(LINK_LIST_SEPARATOR_VERTICAL);
			saveLinkListLayout(LINK_LIST_FAVICON_NORMAL,LINK_LIST_DIRECTION_VERTICAL,LINK_LIST_SEPARATOR_VERTICAL).catch(onSaveError);
		}
	}

	function setSampleLinkListAnchor(list){
		let prototype = document.querySelector("#"+CSS_PREFIX+"-list-prototype");
		let container = othersNode.querySelector("#"+CSS_PREFIX+"-container");
		clearChildren(container);
		for(let i=0; i<list.length; i++){
			let item = list[i];
			if(!item.c) continue;
			let node = prototype.cloneNode(true);
			node.removeAttribute("id");
			node.setAttribute("title",item.l);
			node.querySelector("."+CSS_PREFIX+"-label").innerText = item.l;
			let src;
			if( faviconCache.hasOwnProperty(item.u) ){
				src = faviconCache[item.u];
			}
			else {
				src = ponyfill.extension.getURL("/image/favicon.svg");
			}
			node.querySelector("."+CSS_PREFIX+"-favicon").setAttribute("src", src);
			container.appendChild(node);
		}
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

	function addStopper(){
		sampleLinkListNode.classList.add(CSS_PREFIX+"-stopper");
	}

	function removeStopper(){
		sampleLinkListNode.classList.remove(CSS_PREFIX+"-stopper");
	}

	function setSampleLinkListDirection(value){
		if(value==LINK_LIST_DIRECTION_VERTICAL){
			sampleLinkListNode.classList.remove(CSS_PREFIX+"-inline");
		}
		else {
			sampleLinkListNode.classList.add(CSS_PREFIX+"-inline");
		}
	}

	function setSampleLinkListSeparator(value){
		if(value==LINK_LIST_SEPARATOR_VERTICAL){
			sampleLinkListNode.classList.add(CSS_PREFIX+"-separator");
		}
		else {
			sampleLinkListNode.classList.remove(CSS_PREFIX+"-separator");
		}
	}

	function setSampleLinkListFaviconDisplay(value){
		if(value==LINK_LIST_FAVICON_NORMAL){
			sampleLinkListNode.classList.remove(CSS_PREFIX+"-mini");
		}
		else {
			sampleLinkListNode.classList.add(CSS_PREFIX+"-mini");
		}
	}

	function setSampleLinkListServiceCode(value){
		if(value!=API_SERVICE_CODE_NONE){
			sampleLinkListNode.querySelector("#"+CSS_PREFIX+"-apiContent").classList.remove(CSS_PREFIX+"-hide");
		}
		else {
			sampleLinkListNode.querySelector("#"+CSS_PREFIX+"-apiContent").classList.add(CSS_PREFIX+"-hide");
		}
	}

	function saveLinkListStyle(value){
		let data = { "cl": value };
		return saveW(data);
	}

	function saveLinkListAction(value){
		let data = { "ca": value };
		return saveW(data);
	}

	function saveLinkListDirection(value){
		let data = { "ld": value };
		return saveW(data);
	}

	function saveLinkListSeparator(value){
		let data = { "ls": value };
		return saveW(data);
	}

	function saveFaviconDisplay(value){
		let data = { "f": value };
		return saveW(data);
	}

	function saveLinkListLayout(value1,value2,value3){
		let data = {
			"f": value1,
			"ld": value2,
			"ls": value3
		};
		return saveW(data);
	}

	function serviceCodeChangeBehavior(serviceCode){
		if(serviceCode != API_SERVICE_CODE_NONE){
			saveServiceCode(serviceCode).catch(onSaveError);
		}
		else {
			saveServiceCodeNone(serviceCode).catch(onSaveError);
		}
		setSampleLinkListServiceCode(serviceCode);
	}

	function saveServiceCode(value){
		let data = {
			"s": value
		};
		return saveW(data);
	}

	function saveServiceCodeNone(value){
		let data = {
			"s": value,
			"sw": API_SWITCH_DISABLED
		};
		return saveW(data);
	}

	function downloadLanguageFilter(service){
		let p = Promise.resolve();
		let obj = { "service": service };
		return p.then(
			prepareAjaxApiLang.bind(obj)
		).then(
			requestAjaxApiLang.bind(obj)
		);
	}

	function prepareAjaxApiLang(){
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
				"key": "cmprop",
				"value": "title|sortkeyprefix"
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
		this.param = param;
		this.url = [];
		this.cat = [];
	}

	function requestAjaxApiLang(){
		this.url.push( makeApiURL(this.service+API_SERVICE_PROPERTY[this.service].path, this.param, "") );
		return promiseAjax("GET", this.url[this.url.length-1], "json", API_HEADER).then( responseAjaxApiLang.bind(this) );
	}

	function responseAjaxApiLang(e){
		if( e.target.status == "200" ){
			let res = e.target.response;
			if (res == null){
				console.error(e);
				return Promise.reject(e);
			}
			if (res.hasOwnProperty("error")){
				console.error(e);
				return Promise.reject(e);
			}
			this.cat = this.cat.concat(res.query.categorymembers);
			if( !res.hasOwnProperty("continue")) {
				return Promise.resolve().then( afterAjaxApiLang.bind(this) );
			}
			let keys = Object.keys(res.continue);
			this.param = this.param.filter( obj => !keys.includes(obj.key) );
			for( let i=0; i<keys.length; i++){
				let key = keys[i];
				this.param.push({
					"key": key,
					"value": res.continue[key]
				});
			}
			return Promise.resolve().then( requestAjaxApiLang.bind(this) );
		}
		console.error(e);
		return Promise.reject(e);
	}

	function afterAjaxApiLang(list){
		let removeList = [];
		let prefix = {};
		let namespace = API_SERVICE_PROPERTY[this.service].namespace;
		let namespaceRegex = new RegExp("^" + namespace + ":");
		let followed = API_SERVICE_PROPERTY[this.service].followed;
		let followedRegex = new RegExp(followed + "$", "i");
		for(let i=0; i<this.cat.length; i++){
			let obj = this.cat[i];
			obj.title = obj.title.replace( namespaceRegex, "");
			obj.shortPrefix = obj.sortkeyprefix;
			if(obj.shortPrefix.length <= 0) obj.shortPrefix = obj.title;
			obj.shortPrefix = obj.shortPrefix.substr(0,1);
			if(obj.shortPrefix==" "||obj.shortPrefix=="*"|| (followed && !obj.title.match(followedRegex) ) ) {
				this.cat.splice(i,1);
				i--;
				continue;
			}
			if( prefix.hasOwnProperty(obj.shortPrefix)){
				prefix[obj.shortPrefix]++;
			}
			else {
				prefix[obj.shortPrefix] = 1;
			}
		}
		setLanguageFilterCache(this.service, this.cat);
		setPrefixCache(this.service, prefix);
	}

	function apiLangMakeOption(prefix){
		while(apiLangPrefixSelectNode.lastChild){
			apiLangPrefixSelectNode.removeChild(apiLangPrefixSelectNode.lastChild);
		}
		let prefixList = Object.keys(prefix);
		for(let i=0; i<prefixList.length; i++){
			let option = document.createElement("option");
			option.value = prefixList[i];
			option.innerText = prefixList[i] + " ("+prefix[prefixList[i]]+")";
			apiLangPrefixSelectNode.appendChild(option);
		}
	}

	function apiLangMakeRadio(service, prefixCode){
		clearChildren(languageFilterContainerNode);
		let prototype = document.querySelector("#languageFilterInputPrototype");
		let languages = getLanguageFilterCache(service);
		let languageList = getLanguageFilterList();
		languages = languages.filter( obj => obj.sortkeyprefix.substr(0,1)==prefixCode );
		for(let i=0; i<languages.length; i++){
			let language = languages[i];
			let wrapper = prototype.cloneNode(true);
			wrapper.removeAttribute("id");
			let checkboxNode = wrapper.querySelector(".languageFilterCheckbox");
			checkboxNode.setAttribute("value", language.title);
			if( languageList.includes(language.title) ) checkboxNode.checked = true;
			let labelNode = wrapper.querySelector(".languageFilterLabel");
			labelNode.innerText = language.title;
			languageFilterContainerNode.appendChild(wrapper);
			show(wrapper);
		}
		return;
	}

	function addLanguageFilterClickBehavior(){
		let service = getApiService();
		if(service == API_SERVICE_NONE){
			show(othersNode.querySelector(".serviceCodeSelectMessage"));
			return;
		}
		if(hasLanguageFilterCache(service)) {
			openLanguageFilterSelectPane(service);
			return;
		}
		show(downloadLanguagePaneNode);
		let button = othersNode.querySelector(".addLanguageFilter");
		button.disabled = true;
		downloadLanguageFilter(service).then( ()=>{
			openLanguageFilterSelectPane(service);
		}).catch( (e)=>{
			console.error(e);
			deleteLanguageFilterCache(service);
			notice( ponyfill.i18n.getMessage("notificationDownloadLanguageError"));
			return Promise.reject();
		}).finally( ()=>{
			hide(downloadLanguagePaneNode);
			button.disabled = false;
		});
		return;
	}

	function openLanguageFilterSelectPane(service){
		let prefix = getPrefixCache(service);
		apiLangMakeOption(prefix);
		apiLangMakeRadio( service, Object.keys(prefix)[0] );
		show(languageFilterSelectPaneNode);
	}

	function apiLangPrefixSelectChangeBehavior(e){
		let service = getApiService();
		let prefixCode = e.target.value;
		apiLangMakeRadio(service, prefixCode);
	}

	function apiLangPaneClickBehavior(e){
		let classes = e.target.classList;
		if( classes.contains("removePane") || languageFilterSelectPaneNode.isEqualNode(e.target) ){
			hide(languageFilterSelectPaneNode);
		}
		else if(classes.contains("languageFilterCheckbox")){
			if( e.target.checked ) {
				if(!checkLanguageLimit()){
					e.preventDefault();
					notice( ponyfill.i18n.getMessage("htmlCheckLanguageFilterLengthError", [API_LANGUAGE_MAX]) );
					return;
				}
				apiAddLanguage(e.target.value);
			}
			else{
				apiRemoveLanguage(e.target.value);
			}
		}
		else if(classes.contains("removeLanguageButtom")){
			let node = e.target.closest("[data-language]");
			apiRemoveLanguage(node.getAttribute("data-language"));
		}
	}

	function checkLanguageLimit(){
		let languageList = getLanguageFilterList();
		if(languageList.length >= API_LANGUAGE_MAX) return false;
		return true;
	}

	function apiAddLanguage(language){
		let languageList = getLanguageFilterList();
		languageList.push(language);
		languageList.sort();
		setLanguageFilterList(languageList);
		saveLanguageFilterList(languageList).catch(onSaveError);
		makeLanguageFilterListNodes();
	}

	function apiRemoveLanguage(language){
		let languageList = getLanguageFilterList();
		languageList = languageList.filter(str=>str!=language);
		setLanguageFilterList(languageList);
		saveLanguageFilterList(languageList).catch(onSaveError);
		makeLanguageFilterListNodes();
	}

	function languageFilterCheckboxInactive(language){
		let node = languageFilterContainer.querySelector(".languageFilterCheckbox[value=\""+language+"\"]");
		if(!node) return;
		node.checked = false;
	}

	function updateLanguageFilterSelectPane(list) {
		let checkedList = languageFilterContainerNode.querySelectorAll(".languageFilterCheckbox:checked");
		for(let i=0; i<checkedList.length; i++){
			checkedList[i].checked = false;
		}
		for(let i=0; i<list.length; i++){
			let language = list[i];
			let node = languageFilterContainerNode.querySelector(".languageFilterCheckbox[value=\""+language+"\"]");
			if( node ) node.checked = true;
		}
	}

	function saveLanguageFilterList(list){
		let data = {
			"ll": list
		};
		return saveW(data);
	}

	function saveCutOutFlag(value){
		let data = {
			"co": value
		};
		return saveW(data);
	}

	function getFavicon(){
		return ponyfill.runtime.sendMessage({
			"method": "getFavicon",
		});
	}

	function gotFavicon(e){
		faviconCache = e;
	}

})();
