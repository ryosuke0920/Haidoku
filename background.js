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
		"bf": true
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
}

function contextMenuBehavior(info, tab){
	if ( info.menuItemId == "option" ){
		browser.runtime.openOptionsPage();
	}
	else if ( info.menuItemId == "box" ){
		saveBoxViewr(info.checked).catch(onSaveError);
	}
	else if ( options.hasOwnProperty( info.menuItemId ) ){
		openWindow(options[info.menuItemId],info.selectionText );
	}
}

function openWindow( url, text){
	text  = encodeURIComponent(text);
	url = url.replace("$1", text);
	let promise = browser.tabs.create({"url": url});
	return promise.catch(onOpenWindowError);
}

function saveBoxViewr(boxFlag){
	let data = {
		"m": makeMetadata(),
		"bf": boxFlag
	};
	let setter = browser.storage.sync.set(data);
	return setter;
}

function saveInit(){
	let setter = browser.storage.sync.set({
		"m": makeMetadata(),
		"ol": getDefaultOptionList(),
		"w": "",
		"bf": true
	});
	return setter;
}

function saveOption( optionList, windowId="" ){
	let setter = browser.storage.sync.set({
		"m": makeMetadata(),
		"ol": optionList,
		"w": windowId
	});
	return setter;
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
		"bf": true
	});
	return getter.then( resetMenu, onError);
}

function resetDefaultMenu(){
	resetMenu( {"ol": getDefaultOptionList(), "bf": true} );
}

function resetMenu(json){
	let optionList = json["ol"];
	let boxFlag = json["bf"];
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
		"id": "box",
		"title": browser.i18n.getMessage("extensionOptionBox"),
		"checked": boxFlag,
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

function getDefaultOptionList(){
	let lang = browser.i18n.getUILanguage();
	if ( !lang ) lang = browser.runtime.getManifest()["default_locale"];
	if ( !DEFAULT_OPTION_LIST[lang] ) return [];
	return DEFAULT_OPTION_LIST[lang];
}

function onOpenWindowError(e){
	console.error(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"iconUrl": browser.extension.getURL("image/icon.svg"),
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationOpenWindowError") + "\n" + e
	});
	return noticer;
}

function onReadError(e){
	console.error(e);
	let noticer = browser.notifications.create({
		"type": "basic",
		"iconUrl": browser.extension.getURL("image/icon.svg"),
		"title": browser.i18n.getMessage("extensionName"),
		"message": browser.i18n.getMessage("notificationReadWindowError") + "\n" + e
	});
	return noticer;
}

function onSaveError(e){
	console.error(e);
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
