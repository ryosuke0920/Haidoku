const DEFAULT_LOCALE = "en";
let options = {};
ponyfill.runtime.onInstalled.addListener( install );
starter().then(initContextMenu).then(initListener).catch(unexpectedError);

function starter(){
	return Promise.resolve();
}

function install(e){
	if(e.reason === "install"){
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
	else {
		sendResponse( save(data) );
	}
	return true;
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
			options[id] = url;
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
		openWindow(options[info.menuItemId],info.selectionText );
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
		"iconUrl": ponyfill.extension.getURL("image/icon.svg"),
		"title": ponyfill.i18n.getMessage("extensionName"),
		"message": message
	});
	return noticer;
}
