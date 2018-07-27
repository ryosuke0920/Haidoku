const MAX_FAVICON_CONNECTION = 5;
const DATA_URI_REGEX = new RegExp(/^data:.*,/);
let optionList = [];
let autoViewFlag = true;
let shiftKey = false;
let ctrlKey = false;
let options = {};
let faviconCache = {};
let serviceCode = "";
let languageList = [];

ponyfill.runtime.onInstalled.addListener( install ); /* call as soon as possible　*/

Promise.resolve()
.then(initContextMenu)
.then(initListener)
.catch(unexpectedError)
.then(updateFaviconCache)
.then(resetMenu)
.then(broadcastFaviconCache)
.catch((e)=>console.error(e));

function install(e){
	if(e.reason == "install"){
		let data = {
			"ol": getDefaultOptionList()
		};
		return save(data)
		.then(initContextMenu)
		.catch(onSaveError)
		.then(updateFaviconCache)
		.then(resetMenu)
		.then(broadcastFaviconCache)
		.catch( (e)=>{console.error(e)} );
	}
}

function initContextMenu(){
	return getSetting().then(resetMenu, onReadError);
}

function getSetting() {
	let serviceCode = getUiLang();
	if( !API_SERVICE.hasOwnProperty(serviceCode) ) serviceCode = DEFAULT_LOCALE;
	let service = API_SERVICE[serviceCode];
	let languageList = API_SERVICE_PROPERTY[service].defaultLanguage;
	return ponyfill.storage.sync.get({
		"ol": [],
		"bf": true,
		"sk": false,
		"ck": false,
		"s": serviceCode,
		"ll": languageList
	}).then(onGotSetting);
}

function onGotSetting(json){
	optionList = json["ol"];
	autoViewFlag = json["bf"];
	shiftKey = json["sk"];
	ctrlKey = json["ck"];
	serviceCode = json["s"];
	languageList = json["ll"];
}

function initListener(){
	ponyfill.storage.onChanged.addListener( onStorageChanged );
	ponyfill.contextMenus.onClicked.addListener( contextMenuBehavior );
	ponyfill.runtime.onMessage.addListener(notify);
	ponyfill.browserAction.onClicked.addListener((e)=>{
		ponyfill.runtime.openOptionsPage();
	});
}

function openWindow( url, text){
	let promise = ponyfill.tabs.create({"url": makeURL(url,text)});
	return promise.catch(onOpenWindowError);
}

function notify(message, sender, sendResponse){
	let method = message.method;
	let data = message.data;
	if( method == "notice" ){
		let p = notice(data);
		sendResponse(p);
		return p;
	}
	else if( method == "saveHistory" ){
		let p = saveHistory(data);
		sendResponse(p);
		return p;
	}
	else if( method == "openOptions" ){
		let p = ponyfill.runtime.openOptionsPage();
		sendResponse(p);
		return p;
	}
	else if( method == "getFavicon" ){
		sendResponse( faviconCache );
		return Promise.resolve( faviconCache );
	}
	else if( method == "apiRequest" ){
		let p = apiRequest(data).catch( (e)=>{console.error(e)} );
		sendResponse( p );
		return p;
	}
	else {
		let p = save(data);
		sendResponse(p);
		return p;
	}
}

function saveAutoViewFlag(flag=true){
	return save({"bf":flag}).catch(onSaveError);
}

function saveManualViewShiftKey(flag=false){
	return save({"sk":flag}).catch(onSaveError);
}

function saveManualViewCtrlKey(flag=false){
	return save({"ck":flag}).catch(onSaveError);
}

function addHistory(e){
	let db = e.target.result;
	let transaction = db.transaction(["historys"], WRITE);
	let promise = new Promise((resolve,reject)=>{
		let historys = transaction.objectStore(HISTORYS);
		let req = historys.add(this.data);
		req.onsuccess = (e)=>{
			resolve(e);
		};
		req.onerror = (e)=>{
			reject(e);
		};
	});
	return promise;
}

function saveHistory(data){
	data.date = new Date();
	let obj = {"data": data};
	return Promise.resolve()
		.then(indexeddb.open.bind(indexeddb))
		.then(indexeddb.prepareRequest.bind(indexeddb))
		.then(addHistory.bind(obj));
}

function onStorageChanged(change, area){
	if(change["ol"] || change["bf"] || change["sk"] || change["ck"]) {
		if(change["ol"]) optionList = change["ol"]["newValue"];
		if(change["bf"]) autoViewFlag = change["bf"]["newValue"];
		if(change["sk"]) shiftKey = change["sk"]["newValue"];
		if(change["ck"]) ctrlKey = change["ck"]["newValue"];
		resetMenu();
	}
	if(change["ol"]) {
		updateFaviconCache().then(resetMenu).then(broadcastFaviconCache).catch((e)=>{console.error(e)});
	};
	if(change["s"]) {
		serviceCode = change["s"]["newValue"];
	}
	if(change["ll"]) {
		languageList = change["ll"]["newValue"];
	}
}

function resetMenu(json){
	ponyfill.contextMenus.removeAll();
	options = {};
	for(let i=0; i<optionList.length; i++){
		let data = optionList[i];
		let checked = data["c"];
		let hist = data["h"];
		if ( checked ) {
			let id = (i+1).toString();
			let label = data["l"];
			let url = data["u"];
			let args = {
				"id": id,
				"title": label,
				"contexts": ["image","selection"]
			};
			if( ponyfill.isFirefox() && faviconCache.hasOwnProperty(url) &&  faviconCache[url] != FAVICON_NODATA){
				args["icons"] = { "16": faviconCache[url] };
			}
			options[id] = {
				"hist": hist,
				"url": url,
				"label": label
			}
			ponyfill.contextMenus.create(args);
		}
	}
	if( 0 < optionList.length ) {
		ponyfill.contextMenus.create({
			"type": "separator",
			"contexts": ["image","selection"]
		});
	}
	ponyfill.contextMenus.create({
		"id": "autoView",
		"title": ponyfill.i18n.getMessage("extensionOptionAutoView"),
		"checked": autoViewFlag,
		"type": "checkbox",
		"contexts": ["page","image","selection"]
	});
	ponyfill.contextMenus.create({
		"id": "manualView",
		"title": ponyfill.i18n.getMessage("extensionOptionManualView"),
		"contexts": ["page","image","selection"]
	});
	ponyfill.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewShiftKey",
		"title": ponyfill.i18n.getMessage("extensionOptionManualViewByShiftKey"),
		"checked": shiftKey,
		"type": "checkbox",
		"contexts": ["page","image","selection"]
	});
	ponyfill.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewCtrlKey",
		"title": ponyfill.i18n.getMessage("extensionOptionManualViewByCtrlKey"),
		"checked": ctrlKey,
		"type": "checkbox",
		"contexts": ["page","image","selection"]
	});
	ponyfill.contextMenus.create({
		"id": "option",
		"title": ponyfill.i18n.getMessage("extensionOptionName"),
		"contexts": ["page","image","selection"]
	});
}

function contextMenuBehavior(info, tab){
	if ( info.menuItemId == "option" ){
		ponyfill.runtime.openOptionsPage();
	}
	else if ( info.menuItemId == "autoView" ){
		saveAutoViewFlag(info.checked);
	}
	else if ( info.menuItemId == "manualViewShiftKey" ){
		saveManualViewShiftKey(info.checked);
	}
	else if ( info.menuItemId == "manualViewCtrlKey" ){
		saveManualViewCtrlKey(info.checked);
	}
	else if ( options.hasOwnProperty( info.menuItemId ) ){
		let text;
		if( info.hasOwnProperty("mediaType") && info.mediaType == "image" && info.hasOwnProperty("srcUrl") ){
			text = info.srcUrl;
			if( text.match(DATA_URI_REGEX) ){
				onDataUriNotification();
				return;
			}
		}
		else {
			text = info.selectionText;
		}
		openWindow(options[info.menuItemId]["url"], text );
		if( options[info.menuItemId]["hist"] ){
			saveHistory({
				"text": text,
				"fromURL": tab.url.toString(),
				"fromTitle": tab.title.toString(),
				"toURL": options[info.menuItemId]["url"],
				"toTitle": options[info.menuItemId]["label"]
			}).catch( onSaveError );
		}
	}
}

function onDataUriNotification(){
	return notice(ponyfill.i18n.getMessage("notificationDataUriError"));
}

function getDefaultOptionList(){
	let lang = getUiLang();
	if ( lang && DEFAULT_OPTION_LIST[lang] ) {
		return DEFAULT_OPTION_LIST[lang];
	}
	return DEFAULT_OPTION_LIST[DEFAULT_LOCALE];
}

function makeFaviconURL(url){
	return remainDomainURL(url) + "favicon.ico";
}

function remainDomainURL(url){
	let newURL = "";
	let count = 0;
	for(let i=0; i<url.length; i++){
		let str = url.substr(i,1);
		newURL += str;
		if(str == "/") count++;
		if(3 <= count) break;
	}
	if(count < 3) newURL += "/";
	return newURL;
}

function updateFaviconCache(){
	return new Promise((resolve)=>{
		let queue = [];
		for(let i=0; i<optionList.length; i++){
			let obj = optionList[i];
			if(!obj.c) continue;
			if(faviconCache.hasOwnProperty(obj.u)) continue;
			faviconCache[obj.u] = FAVICON_NODATA;
			let faviconURL = makeFaviconURL(obj.u);
			let data = {
				"url": obj.u,
				"faviconURL": [faviconURL],
				"requestIndex": 0,
				"blob": null,
				"base64": null,
				"doc": null
			};
			queue.push(data);
		}
		let queue_length = queue.length;
		let count = (()=>{
			let i=0;
			return ()=>{
				return ++i;
			}
		})();
		for(let i=0; i<MAX_FAVICON_CONNECTION; i++){
			let data = queue.shift();
			if(!data) break;
			let obj = {
				"connection_id": i,
				"queue_id": queue.length+1,
				"queue_length": queue_length,
				"count": count,
				"callback": resolve,
				"queue": queue,
				"promise": Promise.resolve(),
				"data": data
			};
			faviconChain.bind(obj)();
		}
	});
}

function faviconChain(){
	this.promise = this.promise
	.then( requestAjaxSearchURL.bind(this) )
	.then( responseAjaxSearchURL.bind(this) )
	.catch( (e)=>{console.error(e)} )
	.then( decideFaviconURL.bind(this) )
	.then( requestAjaxFavicon.bind(this) )
	.then( responseAjaxFavicon.bind(this) )
	.then( convertFavicon.bind(this) )
	.then( setFaviconCache.bind(this) )
	.catch( (e)=>{console.error(e)} )
	.finally( endOfFaviconChain.bind(this) );
	return this.promise;
}

function requestAjaxSearchURL(){
	return promiseAjax("GET", this.data.url, "document");
}

function responseAjaxSearchURL(e){
	if( e.target.response ) { // if it's not document, it's null.
		this.data.doc = e.target.response;
		return;
	}
	console.log("not found:"+e.target.responseURL);
}

function decideFaviconURL(e){
	if(!this.data.doc) return;
	let node = this.data.doc.querySelector("link[rel~=icon]");
	if(!node) return;
	let url = node.href;
	if(!url) return;
	this.data.faviconURL.unshift(url);
}

function requestAjaxFavicon(){
	return promiseAjax("GET", this.data.faviconURL[this.data.requestIndex], "blob");
}

function responseAjaxFavicon(e){
	if(e.target.status == "200"){
		this.data.blob = e.target.response;
		return;
	}
	console.log("not found:"+e.target.responseURL);
	if( ++this.data.requestIndex >= this.data.faviconURL.length ) return;
	return Promise.resolve()
	.then( requestAjaxFavicon.bind(this) )
	.then( responseAjaxFavicon.bind(this) )
}

function convertFavicon(){
	return new Promise((resolve,reject)=>{
		if(!this.data.blob){
			resolve();
			return;
		}
		let reader = new FileReader();
		reader.readAsDataURL(this.data.blob);
		reader.onloadend = (e)=>{
			this.data.base64 = reader.result;
			resolve();
		}
		reader.onerror = (e)=>{
			console.error(e);
			reject(e);
		}
		reader.onabort = (e)=>{
			console.error(e);
			reject(e);
		}
	});
}

function setFaviconCache(){
	if(this.data.base64) faviconCache[this.data.url] = this.data.base64;
}

function endOfFaviconChain(){
	let count = this.count();
	this.data = this.queue.shift();
	if(!this.data) {
		if( count >= this.queue_length ) this.callback();
		return;
	}
	this.queue_id = this.queue.length + 1;
	faviconChain.bind(this)();
}

function broadcastFaviconCache(){
	broadcast({
		"method": "updateFaviconCache",
		"data": faviconCache
	});
}

function broadcast(data){
	let obj = {"data": data};
	ponyfill.windows.getAll({"populate":true}).then(broadcastWindows.bind(obj));
}

function broadcastWindows(windows){
	for(let i=0; i<windows.length; i++){
		let w = windows[i];
		let tabs = w.tabs;
		for(let j=0; j<tabs.length; j++){
			let t = w.tabs[j];
			ponyfill.tabs.sendMessage(t.id, this.data)
			//.catch((e)=>{ console.log(e); });
		}
	}
}

function apiRequest(data){
	if(!API_SERVICE.hasOwnProperty(serviceCode)) throw( new Error("service not found. serviceCode="+serviceCode) );
	let service = API_SERVICE[serviceCode];
	let obj = {
		"service": service,
		"path": API_SERVICE_PROPERTY[service].path
	};
	let param = [
		{
			"key"  :"action",
			"value":"query"
		},{
			"key"  :"format",
			"value":"json"
		},{
			"key"  :"list",
			"value":"prefixsearch"
		},{
			"key"  :"pslimit",
			"value":"1"
		},{
			"key"  :"pssearch",
			"value":"$1"
		}
	];
	obj.searchURL = makeApiURL(obj.service+obj.path, param, data.text);
	return Promise.resolve()
	.then( requestAjaxApiSearch.bind(obj) )
	.then( responseAjaxApiSearch.bind(obj) )
	.then( requestAjaxApiInfo.bind(obj) )
	.then( responseAjaxApiInfo.bind(obj) )
	.then( requestAjaxApiSection.bind(obj) )
	.then( responseAjaxApiSection.bind(obj) )
	.then( decideSection.bind(obj) )
	.then( requestAjaxApiParse.bind(obj) )
	.then( responseAjaxApiParse.bind(obj) )
	.then( fetchHTML.bind(obj) )
	.catch( (e)=>{console.error(e)} )//TODO errorを教える
}

function requestAjaxApiSearch(){
	return promiseAjax("GET", this.searchURL, "json", API_HEADER);
}

function responseAjaxApiSearch(e){
	return new Promise((resolve, reject)=>{
		this.status = e.target.status;
		if( this.status == "200" ){
			let res = e.target.response;
			if (res.hasOwnProperty("error")){
				reject(res.error);
				return;
			}
			if(res.query.prefixsearch.length){
				this.pageid = res.query.prefixsearch[0].pageid;
				this.title = res.query.prefixsearch[0].title;
				resolve();
				return;
			}
		}
		reject(e.target);
	});
}

function requestAjaxApiInfo(){
	let param = [
		{
			"key"  :"action",
			"value":"query"
		},{
			"key"  :"format",
			"value":"json"
		},{
			"key"  :"pageids",
			"value":this.pageid
		},{
			"key"  :"prop",
			"value":"info"
		},{
			"key"  :"inprop",
			"value":"url"
		}
	];
	this.infoURL = makeApiURL(this.service+this.path, param);
	return promiseAjax("GET", this.infoURL, "json", API_HEADER);
}

function responseAjaxApiInfo(e){
	return new Promise((resolve, reject)=>{
		this.status = e.target.status;
		if( this.status == "200" ){
			let res = e.target.response
			if (res.hasOwnProperty("error")){
				reject(res.error);
				return;
			}
			this.url = res.query.pages[this.pageid].fullurl;
			resolve();
			return;
		}
		reject(e.target);
	});
}

function requestAjaxApiSection(){
	let param = [
		{
			"key"  :"action",
			"value":"parse"
		},{
			"key"  :"format",
			"value":"json"
		},{
			"key"  :"pageid",
			"value":this.pageid
		},{
			"key"  :"prop",
			"value":"sections"
		}
	];
	this.sectionURL = makeApiURL(this.service+this.path, param);
	return promiseAjax("GET", this.sectionURL, "json", API_HEADER);
}

function responseAjaxApiSection(e){
	return new Promise((resolve,reject)=>{
		this.status = e.target.status;
		if( this.status == "200" ){
			let res = e.target.response
			if (res.hasOwnProperty("error")){
				reject(res.error);
				return;
			}
			this.sections = res.parse.sections;
			resolve();
			return;
		}
		reject(e.target);
	});
}

function decideSection(){
	let comparisons = [];
	for(let i=0; i<languageList.length; i++){
		let str = languageList[i];
		str = str.replace(/\s+language$/);
		comparisons.push(str);
	}
	console.log(comparisons);
	for(let i=0; i<this.sections.length; i++){
		let section = this.sections[i];
		if( comparisons.includes(section.line) ) {
			this.sectionIndex = section.index;
			break;
		}
	}
}

function requestAjaxApiParse(){
	let param = [
		{
			"key"  :"action",
			"value":"parse"
		},{
			"key"  :"format",
			"value":"json"
		},{
			"key"  :"pageid",
			"value":this.pageid
		},{
			"key"  :"prop",
			"value":"text"
		},{
			"key"  :"mobileformat",
			"value":""
		},{
			"key"  :"disableeditsection",
			"value":""
		}
	];
	if( this.sectionIndex )　param.push({"key":"section", "value":this.sectionIndex});
	this.pageURL = makeApiURL(this.service+this.path, param);
	return promiseAjax("GET", this.pageURL, "json", API_HEADER);
}

function responseAjaxApiParse(e){
	return new Promise((resolve,reject)=>{
		this.status = e.target.status;
		if( this.status == "200" ){
			let res = e.target.response
			if (res.hasOwnProperty("error")){
				reject(res.error);
				return;
			}
			this.html = res.parse.text["*"];
			resolve();
			return;
		}
		reject(e.target);
	});
}

function fetchHTML(){
	return this;
}
