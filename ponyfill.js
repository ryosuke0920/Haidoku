var ponyfill = (()=>{

	class base {
		constructor(definition={}){
			for( let key in definition ) this[key] = definition[key];
		}

		error(e){
			throw(e);
		}
	}

	class ponyfill extends base {
		constructor(){
			let browser = "firefox";
			if( navigator.userAgent.match("Chrome")) browser = "chrome";
			let definition = {
				"_browser": browser,
				"_firefox": "firefox",
				"_chrome": "chrome"
			};
			super(definition);
			this.runtime = new runtime(definition);
			this.tabs = new tabs(definition);
			this.contextMenus = new contextMenus(definition);
			this.storage = new storage(definition);
		}
	}

	class runtime extends base {
		constructor( definition ){
			super(definition);
		}

		getBackgroundPage(){
			let promise;
			if( this._browser == this._firefox ) {
				promise = browser.runtime.getBackgroundPage();
			}
			else {
				/* chrome */
				promise = new Promise((resolve, reject)=>{
					try {
						chrome.runtime.getBackgroundPage(function(e){
							resolve(e);
						});
					}
					catch(e){
						reject(e);
					}
				});
			}
			return promise;
		}
	}

	class tabs extends base {
		constructor( definition ){
			super(definition);
		}

		create(data){
			let promise;
			if( this._browser == this._firefox ) {
				promise = browser.tabs.create(data);
			}
			else {
				/* chrome */
				promise = new Promise((resolve, reject)=>{
					try {
						chrome.tabs.create(data, function(e){
							resolve(e);
						});
					}
					catch(e){
						reject(e);
					}
				});
			}
			return promise;
		}
	}

	class storage extends base {
		constructor( definition ){
			super(definition);
			this.sync = new sync(definition);
		}
	}

	class sync extends base {
		constructor( definition ){
			super(definition);
		}

		set(data){
			if( this._browser == this._firefox ) {
				let promise = browser.storage.sync.set(data);
				return promise;
			}
			else if( this._browser == this._chrome ) {
				let promise = new Promise((resolve, reject)=>{
					try {
						chrome.storage.sync.set(data, function(e){
							resolve(e);
						});
					}
					catch(e){
						reject(e);
					}
				});
				return promise;
			}
			this.error("error");
		}

		get( data ){
			let promise;
			if( this._browser == this._firefox ) {
				promise = browser.storage.sync.get(data);
			}
			else {
				/* chrome */
				promise = new Promise((resolve, reject)=>{
					try {
						chrome.storage.sync.get(data, function(e){
							resolve(e);
						});
					}
					catch(e){
						reject(e);
					}
				});
			}
			return promise;
		}
	}

	class contextMenus extends base {
		constructor( definition ){
			super(definition);
		}

		create( data, callback=null ){
			if( this._browser == this._chrome ) {
				delete data["icons"];
			}
			return chrome.contextMenus.create(data, callback);
		}
	}

	return new ponyfill();
})();
