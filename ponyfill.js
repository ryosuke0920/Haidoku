var ponyfill = (()=>{

	class base {
		constructor(definition={}){
			for( let key in definition ) this[key] = definition[key];
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
			this.notifications = new notifications(definition);
		}
	}

	class runtime extends base {
		constructor( definition ){
			super(definition);
		}

		getBackgroundPage(){
			let promise = new Promise((resolve)=>{
				chrome.runtime.getBackgroundPage((page)=>{
					resolve(page);
				});
			});
			return promise;
		}

		sendMessage(message){
			let promise = new Promise((resolve,reject)=>{
				chrome.runtime.sendMessage(message, (res)=>{
					if(chrome.runtime.lastError){
						reject(chrome.runtime.lastError);
					}
					else {
						resolve(res);
					}
				});
			});
			return promise;
		}
	}

	class tabs extends base {
		constructor( definition ){
			super(definition);
		}

		create(data){
			let promise = new Promise((resolve)=>{
				chrome.tabs.create(data, (tab)=>{
					resolve(tab);
				});
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
				chrome.storage.sync.set(data, (res)=>{
					if(chrome.runtime.lastError){
						reject(chrome.runtime.lastError);
					}
					else {
						resolve(res);
					}
				});
			});
			return promise;
		}

		get( data ){
			let promise = new Promise((resolve, reject)=>{
				chrome.storage.sync.get(data, (res)=>{
					if(chrome.runtime.lastError){
						reject(chrome.runtime.lastError);
					}
					else {
						resolve(res);
					}
				});
			});
			return promise;
		}
	}

	class notifications extends base {
		constructor( definition ){
			super(definition);
		}

		create(options){
			let promise = new Promise((resolve)=>{
				chrome.notifications.create(options, (notificationId)=>{
					resolve(notificationId);
				});
			});
			return promise;
		}
	}
	return new ponyfill();
})();
