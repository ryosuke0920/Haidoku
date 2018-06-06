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
			this.storage = new storage(definition);
		}
	}

	class runtime extends base {
		constructor( definition ){
			super(definition);
		}

		getBackgroundPage(){
			let promise = new Promise((resolve, reject)=>{
				try {
					chrome.runtime.getBackgroundPage((e)=>{
						resolve(e);
					});
				}
				catch(e){
					reject(e);
				}
			});
			return promise;
		}

		sendMessage(message){
			let promise = new Promise((resolve, reject)=>{
				try {
					chrome.runtime.sendMessage(message, (e)=>{
						resolve(e);
					});
				}
				catch(e){
					reject(e);
				}
			});
			return promise;
		}
	}

	class tabs extends base {
		constructor( definition ){
			super(definition);
		}

		create(data){
			let promise = new Promise((resolve, reject)=>{
				try {
					chrome.tabs.create(data, (e)=>{
						resolve(e);
					});
				}
				catch(e){
					reject(e);
				}
			});
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
			let promise = new Promise((resolve, reject)=>{
				try {
					chrome.storage.sync.set(data, (e)=>{
						resolve(e);
					});
				}
				catch(e){
					reject(e);
				}
			});
			return promise;
		}

		get( data ){
			let promise = new Promise((resolve, reject)=>{
				try {
					chrome.storage.sync.get(data, (e)=>{
						resolve(e);
					});
				}
				catch(e){
					reject(e);
				}
			});
			return promise;
		}
	}

	return new ponyfill();
})();
