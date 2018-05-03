let options = {};
browser.storage.onChanged.addListener(resetting);
resetting();

function resetting(){
	browser.contextMenus.removeAll();
	let getter = browser.storage.local.get({
		"optionList": []
	});
	getter.then(onGot, onError);

	function onGot(res){
		let optionList = res["optionList"];
		this.options = {};
		for(let i=0; i<optionList.length; i++){
			let data = optionList[i];
			let checked = data["checked"];
			if ( checked ) {
				let id = data["id"];
				let label = data["label"];
				let url = data["url"];
				let args = {
					"id": id,
					"title": label || "(" + id + ") undefined label",
					"contexts": ["selection"]
				};
				this.options[id] = url;
				browser.contextMenus.create(args);
			}
		}
	}
}

browser.contextMenus.onClicked.addListener( (info, tab) => {
	if ( this.options[info.menuItemId] ){
		let url = this.options[info.menuItemId].replace("$1", info.selectionText);
		browser.tabs.create({"url": url});
	}
});

function onError(e){
	console.error(e);
}
