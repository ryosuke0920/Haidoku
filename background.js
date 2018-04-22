( () => {
	browser.storage.onChanged.addListener(resetting);

	function resetting(){
		console.log("resetting");
		browser.contextMenus.removeAll();
		let getter = browser.storage.local.get({
			"registors": []
		});
		getter.then(onGot, onError);

		function onGot(res){
			console.log("onGot");
			console.log(res);
			let registors = res["registors"];
			console.log(registors);
			for(let i=0; i<registors.length; i++){
				let value = registors[i];
				console.log("value=" + value);
				let item = options[value];
				if ( item != null ) {
					console.log("context menu create.");
					browser.contextMenus.create({
						id: item["id"],
						title: item["title"],
						contexts: item["contexts"]
					});
				}
			}
		}

		function onError(e){
			console.log("background-onError");
			console.error(e);
		}
	}

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

	browser.contextMenus.onClicked.addListener( (info, tab) => {
		console.log("contextMenus.onClicked.addListener");
		if ( options[info.menuItemId] ){
			gotoSite( options[info.menuItemId]["url"], info.selectionText );
		}
	});

	function gotoSite(url,text){
		url = url.replace("$1", text);
		console.log('url='+url);
		browser.tabs.create({url: url});
	}

	resetting();
})();
