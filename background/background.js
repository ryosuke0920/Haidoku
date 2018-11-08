const MAX_FAVICON_CONNECTION = 5;
const DATA_URI_REGEX = new RegExp(/^data:.*,/);
const MAX_API_CACHE = 30;
let optionList = [];
let autoViewFlag = true;
let shiftKey = false;
let ctrlKey = false;
let options = {};
let faviconCache = {};
let apiDocumentCache = {};
let audioList = [];
let audioId = (()=>{ let i=0; return ()=>{ return ++i;}})();

ponyfill.runtime.onInstalled.addListener( install ); /* call as soon as possible */

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
	return getSetting().then(getFaviconCache).then(resetMenu).catch( onReadError );
}

function getSetting() {
	return ponyfill.storage.sync.get({
		"ol": DEFAULT_OPTION_LIST_ON_GET,
		"bf": DEFAULT_AUTO_VIEW_FLAG,
		"sk": DEFAULT_SHIFT_KEY_VIEW_FLAG,
		"ck": DEFAULT_CTRL_KEY_VIEW_FLAG
	}).then(onGotSetting);
}

function onGotSetting(json){
	optionList = json["ol"];
	autoViewFlag = json["bf"];
	shiftKey = json["sk"];
	ctrlKey = json["ck"];
}

function initListener(){
	ponyfill.storage.onChanged.addListener( onStorageChanged );
	ponyfill.contextMenus.onClicked.addListener( contextMenuBehavior );
	ponyfill.runtime.onMessage.addListener(notify);
	ponyfill.tabs.onRemoved.addListener(tabsOnRemovedBehavior);
}

function openWindow( url ){
	let promise = ponyfill.tabs.create({"url": url});
	return promise.catch(onOpenWindowError);
}

function notify(message, sender, sendResponse){
	let method = message.method;
	let data = message.data;
	if( method == "notice" ){
		return notice(data).catch((e)=>{
			console.error(e);
			return Promise.reject(e);
		});
	}
	else if( method == "saveHistory" ){
		return saveHistory(data).catch((e)=>{
			console.error(e);
			return Promise.reject(e);
		});
	}
	else if( method == "openOptions" ){
		return ponyfill.runtime.openOptionsPage().catch((e)=>{
			console.error(e);
			return Promise.reject(e);
		});
	}
	else if( method == "getFavicon" ){
		return Promise.resolve(faviconCache);
	}
	else if( method == "apiRequest" ){
		return apiRequest(data).catch((e)=>{
			console.error(e);
			return Promise.reject(e);
		});
	}
	else if( method == "audioStop" ){
		return audioStop(data.audioId).catch((e)=>{
			console.error(e);
			return Promise.reject(e);
		});
	}
	else if( method == "audioStart" ){
		return audioStart(data.url, sender).catch((e)=>{
			console.error(e);
			return Promise.reject(e);
		});
	}
	else {
		return save(data).catch((e)=>{
			console.error(e);
			return Promise.reject(e);
		});
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
	let transaction = db.transaction([HISTORYS], WRITE);
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
		updateFaviconCache(false).then(resetMenu).then(broadcastFaviconCache).catch((e)=>{console.error(e)});
	};
}

function resetMenu(json){
	ponyfill.contextMenus.removeAll();
	options = {};
	for(let i=0; i<optionList.length; i++){
		let data = optionList[i];
		let checked = data["c"];
		let hist = data["h"];
		if ( !checked ) continue;
		let id = (i+1).toString();
		let label = data["l"];
		let url = data["u"];
		let args = {
			"id": id,
			"title": label,
			"contexts": ["image","selection"]
		};
		if( ponyfill.isFirefox() && faviconCache.hasOwnProperty(url) ){
			args["icons"] = { "16": faviconCache[url] };
		}
		ponyfill.contextMenus.create(args);
		options[id] = {
			"hist": hist,
			"url": url,
			"label": label,
			"origin": false
		}
	}
	if( 0 < optionList.length ) {
		ponyfill.contextMenus.create({
			"id": "origin",
			"title": "Origin",
			"contexts": ["page","image","selection"]
		});
		for( let i=0; i<optionList.length; i++){
			let data = optionList[i];
			let checked = data["c"];
			let hist = data["h"];
			if ( !checked ) continue;
			let id = (i+1+optionList.length).toString();
			let label = data["l"];
			let url = data["u"];
			let origin = new URL(url).origin;
			let args = {
				"parentId": "origin",
				"id": id,
				"title": origin,
				"contexts": ["page","image","selection"]
			};
			if( ponyfill.isFirefox() && faviconCache.hasOwnProperty(url) ){
				args["icons"] = { "16": faviconCache[url] };
			}
			ponyfill.contextMenus.create(args);
			options[id] = {
				"url": origin,
				"label": label,
				"origin": true
			}
		}
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
		if(options[info.menuItemId].origin) {
			openWindow( options[info.menuItemId]["url"] );
			return;
		}
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
		openWindow( makeURL(options[info.menuItemId]["url"], text ) );
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

function updateFaviconCache(updateAll=true){
	return new Promise((resolve)=>{
		let queue = [];
		for(let i=0; i<optionList.length; i++){
			let obj = optionList[i];
			if(!obj.c) continue;
			if(!updateAll && faviconCache.hasOwnProperty(obj.u)) continue;
			let faviconURL = new URL(obj.u).origin + "/favicon.ico";
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
	.catch( (e)=>{ console.error(e) } )
	.then( decideFaviconURL.bind(this) )
	.then( requestAjaxFavicon.bind(this) )
	.then( responseAjaxFavicon.bind(this) )
	.then( convertFavicon.bind(this) )
	.then( setFaviconCache.bind(this) )
	.then( saveFaviconProcess.bind(this) )
	.catch( (e)=>{console.error(e)} )
	.finally( endOfFaviconChain.bind(this) );
	return this.promise;
}

function requestAjaxSearchURL(){
	return promiseAjax("GET", new URL(this.data.url).origin, "document");
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
	if(e.target.status == HTTP_200_OK){
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
	if(!this.data.blob) return;
	return blob2Base64(this.data.blob).then( (base64)=>{
		this.data.base64 = base64;
	});
}

function setFaviconCache(){
	if(this.data.base64) faviconCache[this.data.url] = this.data.base64;
}

function getFaviconCache(){
	return Promise.resolve()
	.then( indexeddb.open.bind(indexeddb) )
	.then( indexeddb.prepareRequest.bind(indexeddb) )
	.then( getFaviconLoop.bind(this) );
}

function getFaviconLoop(e){
	let p = Promise.resolve();
	for(let i=0; i<optionList.length; i++) {
		if(!optionList[i].c) continue;
		let url = optionList[i].u;
		p = p.then( ()=>{ return getFaviconBlob(e.target.result, url) })
		.then( convertFaviconBlob )
		.then( (base64)=>{initSetFaviconCache(url, base64)} );
	}
	return p;
}

function getFaviconBlob(db, url){
	return new Promise((resolve, reject)=>{
		let transaction = db.transaction([FAVICONS], READ);
		let objectStore = transaction.objectStore(FAVICONS);
		let req = objectStore.get(url);
		req.onsuccess = (e)=>{
			if( e.target.result ){
				resolve( e.target.result.blob );
			}
			else {
				resolve();
			}
		}
		req.onerror = (e)=>{
			reject(e);
		}
	});
}

function convertFaviconBlob(blob){
	if(!blob) return;
	return blob2Base64(blob);
}

function blob2Base64(blob){
	return new Promise((resolve,reject)=>{
		if(!blob){
			reject(new Error("Blob not found."));
			return;
		}
		let reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = (e)=>{
			resolve(reader.result);
		}
		reader.onerror = (e)=>{
			reject(e);
		}
		reader.onabort = (e)=>{
			reject(e);
		}
	});
}

function initSetFaviconCache(url, base64) {
	if(!base64) return;
	faviconCache[url] = base64;
}

function saveFaviconProcess() {
	if(!this.data.blob) return;
	return Promise.resolve()
	.then( indexeddb.open.bind(indexeddb) )
	.then( indexeddb.prepareRequest.bind(indexeddb) )
	.then( saveFavicon.bind(this) );
}

function saveFavicon(e) {
	return new Promise((resolve, reject)=>{
		let db = e.target.result;
		let transaction = db.transaction([FAVICONS], WRITE);
		let favicons = transaction.objectStore(FAVICONS);
		let data = {
			"url": this.data.url,
			"favicon": this.data.faviconURL[this.data.requestIndex],
			"blob": this.data.blob,
			"date": new Date()
		};
		let req = favicons.put(data);
		req.onsuccess = (e)=>{
			resolve(e);
		};
		req.onerror = (e)=>{
			reject(e);
		};
	});
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
		for(let j=0; j<w.tabs.length; j++){
			ponyfill.tabs.sendMessage(w.tabs[j].id, this.data).catch((e)=>{console.log(e)});
		}
	}
}

function apiRequest(data){
	let obj = {"text": data.text};
	if(!API_SERVICE.hasOwnProperty(data.serviceCode)){
		obj.error = APPLICATION_ERROR;
		obj.code = data.serviceCode;
		obj.message = "service not found.";
		return Promise.resolve(obj);
	}
	let service = API_SERVICE[data.serviceCode];
	obj.service = service;
	obj.path = API_SERVICE_PROPERTY[service].path;
	obj.url = [];
	obj.html = [];
	let cache = fetchApiDocumentCache(obj);
	if(cache) return Promise.resolve(cache);
	return Promise.resolve().then( requestAjaxApiInfo.bind(obj) ).then( responseAjaxApiInfo.bind(obj) ).catch( detectAjaxApiConnectError.bind(obj) );
}

function detectAjaxApiConnectError(e){
	console.error(e);
	try{
		if( e.target.status == HTTP_NG ){
			this.error = CONNECTION_ERROR;
			this.code = e.target.status;
			this.message = e.target.statusText;
			return this;
		}
	}
	catch(e){};
	return Promise.reject(e);
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
			"key"  :"titles",
			"value":this.text
		},{
			"key"  :"prop",
			"value":"info"
		},{
			"key"  :"inprop",
			"value":"url"
		},{
			"key"  :"redirects",
			"value":""
		}
	];
	this.url.push( makeApiURL(this.service+this.path, param) );
	return promiseAjax("GET", this.url[this.url.length-1], "json", API_HEADER);
}

function responseAjaxApiInfo(e){
	if( e.target.status != HTTP_200_OK ){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.status;
		this.message = e.target.statusText;
		return this;
	}
	if ( e.target.response.hasOwnProperty("error")){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.response.error.code;
		this.message = e.target.response.error.info;
		return this;
	}
	if (e.target.response.query.pages.hasOwnProperty("-1")){
		return Promise.resolve().then( requestAjaxApiPrefixSearch.bind(this) ).then( responseAjaxApiPrefixSearch.bind(this) );
	}
	let page = Object.values(e.target.response.query.pages);
	this.title = page[0].title;
	this.pageid = page[0].pageid;
	this.fullurl = page[0].fullurl;
	return Promise.resolve().then( requestAjaxApiParse.bind(this) ).then( responseAjaxApiParse.bind(this) );
}

function requestAjaxApiPrefixSearch(){
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
	this.url.push( makeApiURL(this.service+this.path, param, this.text));
	return promiseAjax("GET", this.url[this.url.length-1], "json", API_HEADER);
}

function responseAjaxApiPrefixSearch(e){
	if( e.target.status != HTTP_200_OK ){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.status;
		this.message = e.target.statusText;
		return this;
	}
	if (e.target.response.hasOwnProperty("error")){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.response.error.code;
		this.message = e.target.response.error.info;
		return this;
	}
	if(e.target.response.query.prefixsearch.length==0){
		return Promise.resolve().then( requestAjaxApiSearch.bind(this) ).then( responseAjaxApiSearch.bind(this) );
	}
	let title = e.target.response.query.prefixsearch[0].title;
	if(title.toLowerCase() != this.text.toLowerCase()){
		return Promise.resolve().then( requestAjaxApiSearch.bind(this) ).then( responseAjaxApiSearch.bind(this) );
	}
	this.title = title;
	this.pageid = e.target.response.query.prefixsearch[0].pageid;
	return Promise.resolve().then( requestAjaxApiInfo2.bind(this) ).then( responseAjaxApiInfo2.bind(this) );
}

function requestAjaxApiInfo2(){
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
	this.url.push( makeApiURL(this.service+this.path, param) );
	return promiseAjax("GET", this.url[this.url.length-1], "json", API_HEADER);
}

function responseAjaxApiInfo2(e){
	if( e.target.status != HTTP_200_OK ){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.status;
		this.message = e.target.statusText;
		return this;
	}
	if (e.target.response.hasOwnProperty("error")){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.response.error.code;
		this.message = e.target.response.error.info;
		return this;
	}
	if (e.target.response.query.pages.hasOwnProperty("0")){
		this.error = PAGE_NOT_FOUND_ERROR;
		addApiDocumentCache(this);
		return this;
	}
	let page = Object.values(e.target.response.query.pages);
	this.title = page[0].title;
	this.pageid = page[0].pageid;
	this.fullurl = page[0].fullurl;
	return Promise.resolve().then( requestAjaxApiParse.bind(this) ).then( responseAjaxApiParse.bind(this) );
}

function requestAjaxApiSearch(){
	let param = [
		{
			"key"  :"action",
			"value":"query"
		},{
			"key"  :"format",
			"value":"json"
		},{
			"key"  :"list",
			"value":"search"
		},{
			"key"  :"srlimit",
			"value":"1"
		},{
			"key"  :"srsearch",
			"value":"$1"
		}
	];
	this.url.push( makeApiURL(this.service+this.path, param, this.text));
	return promiseAjax("GET", this.url[this.url.length-1], "json", API_HEADER);
}

function responseAjaxApiSearch(e){
	if( e.target.status != HTTP_200_OK ){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.status;
		this.message = e.target.statusText;
		return this;
	}
	if (e.target.response.hasOwnProperty("error")){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.response.error.code;
		this.message = e.target.response.error.info;
		return this;
	}
	if(e.target.response.query.search.length==0){
		this.error = PAGE_NOT_FOUND_ERROR;
		addApiDocumentCache(this);
		return this;
	}
	this.title = e.target.response.query.search[0].title;
	this.pageid = e.target.response.query.search[0].pageid;
	return Promise.resolve().then( requestAjaxApiInfo2.bind(this) ).then( responseAjaxApiInfo2.bind(this) );
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
	this.url.push(makeApiURL(this.service+this.path, param))
	return promiseAjax("GET", this.url[this.url.length-1], "json", API_HEADER);
}

function responseAjaxApiParse(e){
	if( e.target.status != HTTP_200_OK ){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.status;
		this.message = e.target.statusText;
		return this;
	}
	if (e.target.response.hasOwnProperty("error")){
		console.error(e);
		this.error = SERVER_ERROR;
		this.code = e.target.response.error.code;
		this.message = e.target.response.error.info;
		return this;
	}
	this.html.push( e.target.response.parse.text["*"] );
	return Promise.resolve().then( returnContent.bind(this) );
}

function returnContent(){
	addApiDocumentCache(this);
	return this;
}

function addApiDocumentCache(obj){
	if(!apiDocumentCache.hasOwnProperty(obj.service)){
		apiDocumentCache[obj.service] = [];
	}
	else {
		if(fetchApiDocumentCache(obj)!==false) return;
	}
	apiDocumentCache[obj.service].push(obj);
	if(apiDocumentCache[obj.service].length > MAX_API_CACHE) apiDocumentCache[obj.service].shift();
}

function fetchApiDocumentCache(obj){
	if(!apiDocumentCache.hasOwnProperty(obj.service)) return false;
	for(let i=0; i<apiDocumentCache[obj.service].length; i++){
		if( obj.text == apiDocumentCache[obj.service][i].title || obj.text == apiDocumentCache[obj.service][i].text){
			let temp = apiDocumentCache[obj.service].splice(i,1);
			apiDocumentCache[obj.service].push(temp[0]);
			return temp[0];
		}
	}
	return false;
}

function audioStart(url, sender){
	let obj = {"sender": sender};
	return promiseAjax("GET", url, "blob").then( onDownloadAsBase64.bind(obj) );
}

function onDownloadAsBase64(e){
	if(e.target.status == HTTP_206_PARTIAL || e.target.status == HTTP_200_OK){
		return blob2Base64(e.target.response).then( audioPlay.bind(this) );
	}
	return Promise.reject( new Error(e.target.status) );
}

function audioPlay(base64){
	let id = CSS_PREFIX + "-audio-" + audioId();
	let audio = document.createElement("audio");
	audio.setAttribute("id", id);
	audioList.push({
		"id": id,
		"audio": audio,
		"tabId": this.sender.tab.id
	});
	let source = document.createElement("source");
	source.src = base64;
	audio.appendChild(source);
	audio.addEventListener("ended",(e)=>{
		let id = audio.getAttribute("id");
		audioList = audioList.filter( obj => obj.id != id );
		ponyfill.tabs.sendMessage(this.sender.tab.id, {"method":"audioStop","audioId":id});
	});
	return audio.play().then(()=>{
		return {"audioId": id};
	}).catch((e)=>{
		let id = audio.getAttribute("id");
		audioList = audioList.filter( obj => obj.id != id );
		return Promise.reject(e);
	});
}

function audioStop(audioId){
	let list = audioList.filter( obj => obj.id == audioId );
	if( list.length == 0 ) return;
	let audio = list[0].audio;
	audio.pause();
	audioList = audioList.filter( obj => obj.id != audioId );
}

function tabsOnRemovedBehavior(tabId, removeInfo){
	let list = audioList.filter( obj => obj.tabId == tabId );
	if( list.length == 0 ) return;
	for(let i=0; i<list.length; i++){
		let audio = list[i].audio;
		audio.pause();
	}
	audioList = audioList.filter( obj => obj.tabId != tabId );
}
