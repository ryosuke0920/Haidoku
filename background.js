let options = {};
chrome.runtime.onInstalled.addListener( install );
starter().then(initContextMenu).then(initListener);

function starter(){
	return new Promise((resolve)=>{resolve()});
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
		"ol": [],
		"bf": true,
		"sk": false,
		"ck": false
	});
	return getter.then(resetMenu, onReadError);
}

function initListener(){
	chrome.storage.onChanged.addListener( onStorageChanged );
	chrome.contextMenus.onClicked.addListener( contextMenuBehavior );
	chrome.runtime.onMessage.addListener(notify);
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

function notify(message){
	//let method = message.method;
	let data = message.data;
	return save(data).catch(onSaveError);
}

function saveOption( optionList, windowId="" ){
	let data = {
		"ol": optionList,
		"w": windowId
	};
	return save(data).catch(onSaveError);
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

function makeMetadata(){
	let manifest = chrome.runtime.getManifest();
	let now = new Date();
	let data = {
		"v": manifest.version,
		"d": now.toString(),
	};
	return data;
}

function onStorageChanged(change, area){
	if(change["ol"] || change["bf"] || change["sk"] || change["ck"]) {
		chrome.contextMenus.removeAll();
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"bf": true,
			"sk": false,
			"ck": false
		});
		return getter.then(resetMenu, onError);
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
			options[id] = url;
			let ret = ponyfill.contextMenus.create(args);
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
		"title": chrome.i18n.getMessage("extensionOptionAutoView"),
		"checked": autoViewFlag,
		"type": "checkbox",
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"id": "manualView",
		"title": chrome.i18n.getMessage("extensionOptionManualView"),
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewShiftKey",
		"title": chrome.i18n.getMessage("extensionOptionManualViewByShiftKey"),
		"checked": shiftKey,
		"type": "checkbox",
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewCtrlKey",
		"title": chrome.i18n.getMessage("extensionOptionManualViewByCtrlKey"),
		"checked": ctrlKey,
		"type": "checkbox",
		"contexts": ["page","selection"]
	});
	ponyfill.contextMenus.create({
		"id": "option",
		"title": chrome.i18n.getMessage("extensionOptionName"),
		"icons": {
			"32":"image/icon.svg"
		},
		"contexts": ["page","selection"]
	});
}

function contextMenuBehavior(info, tab){
	if ( info.menuItemId == "option" ){
		chrome.runtime.openOptionsPage();
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
		openWindow(options[info.menuItemId],info.selectionText );
	}
}

function getDefaultOptionList(){
	let lang = chrome.i18n.getUILanguage();
	if ( !lang ) lang = chrome.runtime.getManifest()["default_locale"];
	if ( !DEFAULT_OPTION_LIST[lang] ) return [];
	return DEFAULT_OPTION_LIST[lang];
}

function onOpenWindowError(e){
	onError(e);
	let noticer = chrome.notifications.create({
		"type": "basic",
		"iconUrl": chrome.extension.getURL("image/icon.svg"),
		"title": chrome.i18n.getMessage("extensionName"),
		"message": chrome.i18n.getMessage("notificationOpenWindowError") + "\n" + e
	});
	return noticer;
}

function onReadError(e){
	onError(e);
	let noticer = chrome.notifications.create({
		"type": "basic",
		"iconUrl": chrome.extension.getURL("image/icon.svg"),
		"title": chrome.i18n.getMessage("extensionName"),
		"message": chrome.i18n.getMessage("notificationReadWindowError") + "\n" + e
	});
	return noticer;
}

function onSaveError(e){
	onError(e);
	let noticer = chrome.notifications.create({
		"type": "basic",
		"iconUrl": chrome.extension.getURL("image/icon.svg"),
		"title": chrome.i18n.getMessage("extensionName"),
		"message": chrome.i18n.getMessage("notificationSaveOptionError") + "\n" + e
	});
	return noticer;
}

function onError(e){
	console.error(e);
}
