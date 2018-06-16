const DEFAULT_LOCALE = "en";
const INDEXED_DB_NAME = "SearchDictionaryFaster";
const INDEXED_DB_VERSION = 1; /* don't use 1.1 */
const READ = "readonly";
const WRITE = "readwrite";
const HISTORYS = "historys";

let options = {};
ponyfill.runtime.onInstalled.addListener( install );
starter().then(initContextMenu).then(initListener).catch(unexpectedError);

function starter(){
	return Promise.resolve();
}

function install(e){
	if(e.reason == "install"){
		let data = {
			"ol": getDefaultOptionList()
		};
		return save(data).catch(onSaveError);
	}
}

function getPresetOptionList(){
	return PRESET_OPTION_LIST;
}

function initContextMenu(){
	let getter = ponyfill.storage.sync.get({
		"ol": getDefaultOptionList(),
		"bf": true,
		"sk": false,
		"ck": false
	});
	return getter.then(resetMenu, onReadError);
}

function initListener(){
	ponyfill.storage.onChanged.addListener( onStorageChanged );
	ponyfill.contextMenus.onClicked.addListener( contextMenuBehavior );
	ponyfill.runtime.onMessage.addListener(notify);
}

function openWindow( url, text){
	text  = encodeURIComponent(text);
	url = url.replace("$1", text);
	let promise = ponyfill.tabs.create({"url": url});
	return promise.catch(onOpenWindowError);
}

function save(data){
	data["m"] = makeMetadata();
	let setter = ponyfill.storage.sync.set(data);
	return setter;
}

function notify(message, sender, sendResponse){
	let method = message.method;
	let data = message.data;
	if( method == "notice" ){
		sendResponse( notice(data) );
	}
	else if( method == "saveHistory" ){
		sendResponse( saveHistory(data) );
	}
	else {
		sendResponse( save(data) );
	}
	return true;
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

function upgrade(e){
	console.log("upgrade");
	let db = e.currentTarget.result;
	let historys = db.createObjectStore(HISTORYS, {"keyPath": "id", "autoIncrement": true});
	historys.createIndex("text", "text", {"unique": false});
}

function prepareRequest(){
	let request = window.indexedDB.open( INDEXED_DB_NAME, INDEXED_DB_VERSION );
	return new Promise((resolve,reject)=>{
		request.onupgradeneeded = (e)=>{
			console.log("onupgradeneeded");
			console.log(e);
			upgrade(e);
		};
		request.onsuccess = (e)=>{
			console.log("onsuccess");
			console.log(e);
			resolve(e.target.result);
		};
		request.onblocked = (e)=>{
			console.log("onblocked");
			console.error(e);
			reject(e);
		};
		request.onerror = (e)=>{
			console.log("onerror");
			console.error(e);
			reject(e);
		};
	});
}

function saveHistory(data){
	let text = data["text"].trim();
	let label = data["label"].trim();
	let url = data["url"].trim();
	let location = data["location"].trim();
	let title = data["title"].trim();

	function putHistory(db){
		let transaction = db.transaction(["historys"], WRITE);
		let promise = new Promise((resolve,reject)=>{
			transaction.oncomplete = (e)=>{
				console.log("resolve put ObjectStore");
				resolve(e);
			};
			transaction.onerror = (e)=>{
				console.log("reject put ObjectStore");
				reject(e);
			};
		})
		let historys = transaction.objectStore(HISTORYS);
		historys.put({
			"text": text,
			"label": label,
			"url": url,
			"location": location,
			"title": title
		});
		return promise;
	}

	return prepareRequest().then(putHistory);
}

function makeMetadata(){
	let manifest = ponyfill.runtime.getManifest();
	let now = new Date();
	let data = {
		"v": manifest.version,
		"d": now.toString(),
	};
	return data;
}

function onStorageChanged(change, area){
	if(change["ol"] || change["bf"] || change["sk"] || change["ck"]) {
		ponyfill.contextMenus.removeAll();
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"bf": true,
			"sk": false,
			"ck": false
		});
		return getter.then(resetMenu, onReadError);
	}
}

function resetMenu(json){
	let optionList = json["ol"];
	let autoViewFlag = json["bf"];
	let shiftKey = json["sk"];
	let ctrlKey = json["ck"];
	options = {};
	for(let i=0; i<optionList.length; i++){
		let data = optionList[i];
		let checked = data["c"];
		if ( checked ) {
			let id = (i+1).toString();
			let label = data["l"];
			let url = data["u"];
			let args = {
				"id": id,
				"title": label,
				"contexts": ["selection"]
			};
			options[id] = {
				"url": url,
				"label": label
			}
			ponyfill.contextMenus.create(args);
		}
	}
	if( 0 < optionList.length ) {
		ponyfill.contextMenus.create({
			"type": "separator",
			"contexts": ["selection"]
		});
	}
	ponyfill.contextMenus.create({
		"id": "autoView",
		"title": ponyfill.i18n.getMessage("extensionOptionAutoView"),
		"checked": autoViewFlag,
		"type": "checkbox",
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"id": "manualView",
		"title": ponyfill.i18n.getMessage("extensionOptionManualView"),
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewShiftKey",
		"title": ponyfill.i18n.getMessage("extensionOptionManualViewByShiftKey"),
		"checked": shiftKey,
		"type": "checkbox",
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewCtrlKey",
		"title": ponyfill.i18n.getMessage("extensionOptionManualViewByCtrlKey"),
		"checked": ctrlKey,
		"type": "checkbox",
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"id": "option",
		"title": ponyfill.i18n.getMessage("extensionOptionName"),
		"contexts": ["page","selection"]
	});
}

function contextMenuBehavior(info, tab){
	let promise;
	if ( info.menuItemId == "option" ){
		promise = ponyfill.runtime.openOptionsPage();
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
		openWindow(options[info.menuItemId]["url"], info.selectionText );
		saveHistory({
			"text": info.selectionText,
			"label": options[info.menuItemId]["label"],
			"url": options[info.menuItemId]["url"],
			"location": tab.url,
			"title": tab.title
		}).catch( onSaveError );
	}
}

function getDefaultOptionList(){
	let lang = ponyfill.i18n.getUILanguage();
	let matcher = lang.match(/^([a-zA-Z0-9]+)\-[a-zA-Z0-9]+$/);
	if( matcher ){
		lang = matcher[1];
	}
	if ( lang && DEFAULT_OPTION_LIST[lang] ) {
		return DEFAULT_OPTION_LIST[lang];
	}
	lang = ponyfill.runtime.getManifest()["default_locale"];
	if ( lang && DEFAULT_OPTION_LIST[lang] ) {
		return DEFAULT_OPTION_LIST[lang];
	}
	return DEFAULT_OPTION_LIST[DEFAULT_LOCALE];
}

function onOpenWindowError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationOpenWindowError", [e.message]));
}

function onReadError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationReadOptionError", [e.message]));
}

function onSaveError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationSaveOptionError", [e.message]));
}

function unexpectedError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationUnexpectedError", [e.message]));
}

function notice(message){
	let noticer = ponyfill.notifications.create({
		"type": "basic",
		"iconUrl": ponyfill.extension.getURL("/image/icon.svg"),
		"title": ponyfill.i18n.getMessage("extensionName"),
		"message": message
	});
	return noticer;
}
