let options = {
	"www.google.co.jp": {
		id: "www.google.co.jp",
		title: "goto www.google.co.jp",
		contexts: ["selection"],
		url: "https://www.google.com/search?q=$1"
	},
	"www.yahoo.co.jp": {
		id: "www.yahoo.co.jp",
		title: "goto www.yahoo.co.jp",
		contexts: ["selection"],
		url: "https://search.yahoo.co.jp/?p=$1"
	},
	"dictionary.cambridge.org": {
		id: "dictionary.cambridge.org",
		title: "goto dictionary.cambridge.org",
		contexts: ["selection"],
		url: "https://dictionary.cambridge.org/search/english/direct/?q=$1"
	}
};


browser.storage.onChanged.addListener(resetting);

function resetting(){
	browser.contextMenus.removeAll();
	let getter = browser.storage.local.get({
		"registors": []
	});
	getter.then(onGot, onError);

	function onGot(res){
		let registors = res["registors"];
		for(let i=0; i<registors.length; i++){
			let value = registors[i];
			let item = options[value];
			if ( item != null ) {
				browser.contextMenus.create({
					id: item["id"],
					title: item["title"],
					contexts: item["contexts"]
				});
			}
		}
	}
}

browser.contextMenus.onClicked.addListener( (info, tab) => {
	if ( options[info.menuItemId] ){
		gotoSite( options[info.menuItemId]["url"], info.selectionText );
	}
});

function gotoSite(url,text){
	url = url.replace("$1", text);
	browser.tabs.create({url: url});
}

resetting();

function saveOptions(metadata, optionList){
	let setter = browser.storage.local.set({
		"metadata": metadata,
		"optionList": optionList
	});

	function onSet(){
		//console.log("onSet");
	}

	return setter.then(onSet, onError);
}

function onError(e){
	console.error(e);
}
