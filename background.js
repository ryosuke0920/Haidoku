let options = {};
init();

function init(){
	let promise = initContextMenu();
	promise.then( initListener, onError);
};

function getPresetOptionList(){
	return PRESET_OPTION_LIST;
}

function initContextMenu(){
	let getter = browser.storage.sync.get({
		"ol": null,
		"bf": true,
		"sk": false,
		"ck": false
	});

	function installOrNot(res){
		if ( res["ol"] ){
			resetMenu(res);
			return ;
		}
		let promise = saveInit();
		return promise.then( resetDefaultMenu, onSaveError );
	}

	return getter.then( installOrNot, onReadError );
}

function initListener(){
	browser.storage.onChanged.addListener( resetMenuFromStorage );
	browser.contextMenus.onClicked.addListener( contextMenuBehavior );
	browser.runtime.onMessage.addListener(notify);
}

function openWindow( url, text){
	text  = encodeURIComponent(text);
	url = url.replace("$1", text);
	let promise = browser.tabs.create({"url": url});
	return promise.catch(onOpenWindowError);
}

function save(data){
	data["m"] = makeMetadata();
	let setter = browser.storage.sync.set(data);
	return setter;
}

function saveInit(){
	let data = {
		"ol": getDefaultOptionList(),
		"w": "",
		"bf": true
	};
	return save(data);
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
	return save(data);
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
	let manifest = browser.runtime.getManifest();
	let now = new Date();
	let data = {
		"v": manifest.version,
		"d": now.toString(),
	};
	return data;
}

function resetMenuFromStorage(){
	browser.contextMenus.removeAll();
	let getter = browser.storage.sync.get({
		"ol": [],
		"bf": true,
		"sk": false,
		"ck": false
	});
	return getter.then( resetMenu, onError);
}

function resetDefaultMenu(){
	resetMenu( {"ol": getDefaultOptionList(), "bf": true} );
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
			let id = "" + (i+1);
			let label = data["l"];
			let url = data["u"];
			let args = {
				"id": id,
				"title": label || "(" + id + ") undefined label",
				"contexts": ["selection"]
			};
			options[id] = url;
			let ret = browser.contextMenus.create(args);
		}
	}
	if( 0 < optionList.length ) {
		browser.contextMenus.create({
			"type": "separator"
		});
	}
	browser.contextMenus.create({
		"id": "autoView",
		"title": browser.i18n.getMessage("extensionOptionAutoView"),
		"checked": autoViewFlag,
		"type": "checkbox"
	});
	browser.contextMenus.create({
		"id": "manualView",
		"title": browser.i18n.getMessage("extensionOptionManualView"),
	});
	browser.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewShiftKey",
		"title": browser.i18n.getMessage("extensionOptionManualViewByShiftKey"),
		"checked": shiftKey,
		"type": "checkbox"
	});
	browser.contextMenus.create({
		"parentId": "manualView",
		"id": "manualViewCtrlKey",
		"title": browser.i18n.getMessage("extensionOptionManualViewByCtrlKey"),
		"checked": ctrlKey,
		"type": "checkbox"
	});
	browser.contextMenus.create({
		"id": "option",
		"title": browser.i18n.getMessage("extensionOptionName"),
		"icons": {
			"32":"image/icon.svg"
		}
	});
}

function contextMenuBehavior(info, tab){
	if ( info.menuItemId == "option" ){
		browser.runtime.openOptionsPage();
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
	let lang = browser.i18n.getUILanguage();
	if ( !lang ) lang = browser.runtime.getManifest()["default_locale"];
	if ( !DEFAULT_OPTION_LIST[lang] ) return [];
	return DEFAULT_OPTION_LIST[lang];
}

function onOpenWindowError(e){
	onError(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"iconUrl": browser.extension.getURL("image/icon.svg"),
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationOpenWindowError") + "\n" + e
	});
	return noticer;
}

function onReadError(e){
	onError(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"iconUrl": browser.extension.getURL("image/icon.svg"),
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationReadWindowError") + "\n" + e
	});
	return noticer;
}

function onSaveError(e){
	onError(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"iconUrl": browser.extension.getURL("image/icon.svg"),
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationSaveOptionError") + "\n" + e
	});
	return noticer;
}

function onError(e){
	console.error(e);
}
