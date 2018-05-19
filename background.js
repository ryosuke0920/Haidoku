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
	let getter = browser.storage.local.get({
		"optionList": null,
		"boxFlag": true
	});

	function installOrNot(res){
		if ( res["optionList"] ){
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
}

function contextMenuBehavior(info, tab){
	if ( info.menuItemId == "option" ){
		browser.runtime.openOptionsPage();
	}
	else if ( info.menuItemId == "box" ){
		saveBoxViewr(info.checked);
	}
	else if ( this.options.hasOwnProperty( info.menuItemId ) ){
		openWindow(this.options[info.menuItemId],info.selectionText );
	}
}

function openWindow( url, text){
	text  = encodeURIComponent(text);
	url = url.replace("$1", text);
	let promise = browser.tabs.create({"url": url});
	return promise.then( null, onOpenWindowError);
}

function saveBoxViewr(boxFlag){
	let data = {
		"metadata": makeMetadata(),
		"boxFlag": boxFlag
	};
	let setter = browser.storage.local.set(data);
	return setter;
}

function saveInit(){
	let setter = browser.storage.local.set({
		"metadata": makeMetadata(),
		"optionList": DEFAULT_OPTION_LIST,
		"windowId": "",
		"boxFlag": true
	});
	return setter;
}

function saveOption( optionList, windowId="" ){
	let setter = browser.storage.local.set({
		"metadata": makeMetadata(),
		"optionList": optionList,
		"windowId": windowId
	});
	return setter;
}

function makeMetadata(){
	let manifest = browser.runtime.getManifest();
	let now = new Date();
	let data = {
		"version": manifest.version,
		"updateDate": now.toString(),
	};
	return data;
}

function resetMenuFromStorage(){
	browser.contextMenus.removeAll();
	let getter = browser.storage.local.get({
		"optionList": [],
		"boxFlag": true
	});
	return getter.then( resetMenu, onError);
}

function resetDefaultMenu(){
	resetMenu( {"optionList": DEFAULT_OPTION_LIST, "boxFlag": true} );
}

function resetMenu(json){
	let optionList = json["optionList"];
	let boxFlag = json["boxFlag"];
	this.options = {};
	for(let i=0; i<optionList.length; i++){
		let data = optionList[i];
		let checked = data["checked"];
		if ( checked ) {
			let id = "" + (i+1);
			let label = data["label"];
			let url = data["url"];
			let args = {
				"id": id,
				"title": label || "(" + id + ") undefined label",
				"contexts": ["selection"]
			};
			this.options[id] = url;
			let ret = browser.contextMenus.create(args);
		}
	}
	if( 0 < optionList.length ) {
		browser.contextMenus.create({
			"type": "separator"
		});
	}
	browser.contextMenus.create({
		"id": "box",
		"title": browser.i18n.getMessage("extensionOptionBox"),
		"checked": boxFlag,
		"type": "checkbox"
	});
	browser.contextMenus.create({
		"id": "option",
		"title": browser.i18n.getMessage("extensionOptionName")
	});
}

function onOpenWindowError(e){
	console.error(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationOpenWindowError")
	});
	return noticer;
}

function onReadError(e){
	console.log(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationReadWindowError")
	});
	return noticer;
}

function onSaveError(e){
	console.error(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationSaveOptionError")
	});
	return noticer;
}

function onError(e){
	console.error(e);
}
