const DEFAULT_OPTION_LIST = [
	{
		"checked": true,
		"label": "Google",
		"url": "https://www.google.co.jp/search?q=$1",
		"ico": "image/www.google.co.jp.ico"
	},
	{
		"checked": true,
		"label": "Google Translate en->ja",
		"url": "https://translate.google.co.jp/?hl=ja&tab=TT#en/ja/$1",
		"ico": "image/translate.google.co.jp.ico"
	},
	{
		"checked": true,
		"label": "Google Translate ja->en",
		"url": "https://translate.google.co.jp/?hl=ja&tab=TT#ja/en/$1",
		"ico": "image/translate.google.co.jp.ico"
	},
	{
		"checked": true,
		"label": "Yahoo!",
		"url": "https://search.yahoo.co.jp/q=$1",
		"ico": "image/dummy.svg"
	},
	{
		"checked": true,
		"label": "Cambridge",
		"url": "https://dictionary.cambridge.org/search/english/direct/?q=$1",
		"ico": "image/dictionary.cambridge.org.ico"
	}
];
let options = {};
init();

function init(){
	let getter = browser.storage.local.get({
		"optionList": null
	});
	let installPromise = getter.then( installOrNot, onError );
	let afterPromise = installPromise.then( after, onError);
	afterPromise.catch(onError);

	function installOrNot(res){
		if ( res["optionList"] ){
			resetMenu(res["optionList"]);
			return ;
		}
		let setter = saveOption( makeMetadata(), DEFAULT_OPTION_LIST );
		return setter.then( resetDefaultMenu, onSaveError );
	}

	function after(){
		browser.storage.onChanged.addListener(resetMenuFromStorage);
		browser.contextMenus.onClicked.addListener( (info, tab) => {
			if ( info.menuItemId == "option" ){
				browser.runtime.openOptionsPage();
			}
			else if ( this.options[info.menuItemId] ){
				let url = this.options[info.menuItemId].replace("$1", info.selectionText);
				browser.tabs.create({"url": url});
			}
		});
	}
};

function saveOption( metadata, optionList ){
	let setter = browser.storage.local.set({
		"metadata": metadata,
		"optionList": optionList
	});
	return setter;
}

function makeMetadata(windowId=""){
	let manifest = browser.runtime.getManifest();
	let now = new Date();
	let data = {
		"version": manifest.version,
		"updateDate": now.toString(),
		"windowId": windowId
	};
	return data;
}

function resetMenuFromStorage(){
	browser.contextMenus.removeAll();
	let getter = browser.storage.local.get({
		"optionList": []
	});
	return getter.then( (res)=>{ resetMenu(res["optionList"]) }, onError);
}

function resetDefaultMenu(){
	resetMenu( DEFAULT_OPTION_LIST );
}

function resetMenu(optionList){
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
	browser.contextMenus.create({
		"id": "option",
		"title": browser.i18n.getMessage("extensionOptionName")
	});
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
