var ponyfill = (()=>{

	class base {
		constructor(){
			this.depName = "browser";
			if(this.isChrome()){
				this.depName = "chrome";
			}
		}
		/*
		console.log(navigator.userAgent);
		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134
		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36
		Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0"
		*/
		isEdge(){
			if( navigator.userAgent.match("Edge") ) return true;
			return false;
		}

		isFirefox(){
			if( navigator.userAgent.match("Firefox") ) return true;
			return false;
		}

		isChrome(){
			if( !this.isEdge() && !this.isFirefox() ) return true;
			return false;
		}
	}

	class ponyfill extends base {
		constructor(){
			super();
			this.contextMenus = new contextMenus();
			this.extension = new extension();
			this.i18n = new i18n();
			this.runtime = new runtime();
			this.tabs = new tabs();
			this.storage = new storage();
			this.notifications = new notifications();
		}
	}

	class contextMenus extends base {
		constructor(){
			super();
		}

		create(json){
			console.log(json.title);
			return window[this.depName].contextMenus.create(json);
		}
	}

	class extension extends base {
		constructor(){
			super();
		}
		
		getURL(path){
			return window[this.depName].extension.getURL(path);
		}
	}

	class i18n extends base {
		constructor(){
			super();
		}

		getMessage(key,list=[]){
			return window[this.depName].i18n.getMessage(key,list);
		}

		getUILanguage(){
			return window[this.depName].i18n.getUILanguage();
		}
	}

	class runtime extends base {
		constructor(){
			super();
			this.onInstalled = new runtimeOnInstalled();
		}

		getBackgroundPage(){
			if(this.isChrome()) {
				let promise = new Promise((resolve)=>{
					chrome.runtime.getBackgroundPage((page)=>{
						resolve(page);
					});
				});
				return promise;
			}
			return browser.runtime.getBackgroundPage();
		}

		getManifest(){
			return window[this.depName].runtime.getManifest();
		}

		sendMessage(message){
			if(this.isChrome()) {
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
			return browser.runtime.sendMessage(message);
		}
		
	}

	class runtimeOnInstalled extends base {
		constructor(){
			super();
		}

		addListener(listener){
			if(this.isChrome()){
				chrome.runtime.onInstalled.addListener(listener);
			}
			else {
				browser.runtime.onInstalled.addListener(listener);
			}
		}
	}

	class tabs extends base {
		constructor(){
			super();
		}

		create(data){
			if(this.isChrome()){
				let promise = new Promise((resolve)=>{
					chrome.tabs.create(data, (tab)=>{
						resolve(tab);
					});
				});
				return promise;
			}
			return browser.tabs.create(data);
		}
	}

	class storage extends base {
		constructor(){
			super();
			this.sync = new storageSync();
		}
	}

	class storageSync extends base {
		constructor(){
			super();
		}

		set(data){
			if(!this.isFirefox()){
				let promise = new Promise((resolve, reject)=>{
					window[this.depName].storage.sync.set(data, (res)=>{
						if(window[this.depName].runtime.lastError){
							reject(window[this.depName].runtime.lastError);
						}
						else {
							resolve(res);
						}
					});
				});
				return promise;
			}
			return browser.storage.sync.set(data);
		}

		get( data ){
			if(!this.isFirefox()){
				let promise = new Promise((resolve, reject)=>{
					window[this.depName].storage.sync.get(data, (res)=>{
						if(window[this.depName].runtime.lastError){
							reject(window[this.depName].runtime.lastError);
						}
						else {
							resolve(res);
						}
					});
				});
				return promise;
			}
			return browser.storage.sync.get(data);
		}
	}

	class notifications extends base {
		constructor(){
			super();
		}

		create(options){
			if(this.isChrome()){
				let promise = new Promise((resolve)=>{
					chrome.notifications.create(options, (notificationId)=>{
						resolve(notificationId);
					});
				});
				return promise;
			}
			return browser.notifications.create(options);
		}
	}
	return new ponyfill();
})();
