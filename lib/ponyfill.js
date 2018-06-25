var ponyfill = (()=>{

	class base {
		constructor(){
			if(this.isChrome()){
				this.depObj = chrome;
			}
			else {
				this.depObj = browser;
			}
			/*
			Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134
			Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36
			Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0"
			*/
		}
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
		getDepObj(){
			return this.depObj;
		}
	}

	class ponyfill extends base {
		constructor(){
			super();
			this.browserAction = new browserAction();
			this.contextMenus = new contextMenus();
			this.extension = new extension();
			this.i18n = new i18n();
			this.runtime = new runtime();
			this.tabs = new tabs();
			this.storage = new storage();
			this.notifications = new notifications();
		}
	}

	class browserAction extends base {
		constructor(){
			super();
			this.onClicked = new browserActionOnClicked();
		}
	}

	class browserActionOnClicked extends base {
		constructor(){
			super();
		}

		addListener(callback){
			this.getDepObj().browserAction.onClicked.addListener(callback);
		}
	}

	class contextMenus extends base {
		constructor(){
			super();
			this.onClicked = new contextMenusOnClicked();
		}

		create(json){
			return this.getDepObj().contextMenus.create(json);
		}

		removeAll(){
			this.getDepObj().contextMenus.removeAll();
		}
	}

	class contextMenusOnClicked extends base {
		constructor(){
			super();
		}

		addListener(callback){
			this.getDepObj().contextMenus.onClicked.addListener(callback);
		}
	}

	class extension extends base {
		constructor(){
			super();
		}

		getURL(path){
			return this.getDepObj().extension.getURL(path);
		}
	}

	class i18n extends base {
		constructor(){
			super();
		}

		getMessage(key,list=[]){
			return this.getDepObj().i18n.getMessage(key,list);
		}

		getUILanguage(){
			return this.getDepObj().i18n.getUILanguage();
		}
	}

	class runtime extends base {
		constructor(){
			super();
			this.onInstalled = new runtimeOnInstalled();
			this.onMessage = new runtimeOnMessage();
		}

		getBackgroundPage(){
			if(!this.isFirefox()) {
				let promise = new Promise((resolve)=>{
					this.getDepObj().runtime.getBackgroundPage((page)=>{
						resolve(page);
					});
				});
				return promise;
			}
			return browser.runtime.getBackgroundPage();
		}

		getManifest(){
			return this.getDepObj().runtime.getManifest();
		}

		onMessage(callback){
			this.getDepObj().runtime.onMessage(callback);
		}

		openOptionsPage(){
			if(this.isChrome()) {
				let promise = new Promise((resolve,reject)=>{
					chrome.runtime.openOptionsPage((res)=>{
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
			else if(this.isEdge()){
				return browser.tabs.create({
					"active": true,
					"url": browser.extension.getURL("option.html")
				});
			}
			return browser.runtime.openOptionsPage();
		}

		sendMessage(message){
			if(!this.isFirefox()) {
				let promise = new Promise((resolve,reject)=>{
					this.getDepObj().runtime.sendMessage(message, (res)=>{
						if(this.getDepObj().runtime.lastError){
							reject(this.getDepObj().runtime.lastError);
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
			this.getDepObj().runtime.onInstalled.addListener(listener);
		}
	}

	class runtimeOnMessage extends base {
		constructor(){
			super();
		}

		addListener(listener){
			this.getDepObj().runtime.onMessage.addListener(listener);
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
			this.onChanged = new storageOnChanged();
		}
	}

	class storageOnChanged extends base {
		constructor(){
			super();
		}

		addListener(callback){
			this.getDepObj().storage.onChanged.addListener(callback);
		}
	}

	class storageSync extends base {
		constructor(){
			super();
		}

		set(data){
			if(!this.isFirefox()){
				let promise = new Promise((resolve, reject)=>{
					this.getDepObj().storage.sync.set(data, (res)=>{
						if(this.getDepObj().runtime.lastError){
							reject(this.getDepObj().runtime.lastError);
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
					this.getDepObj().storage.sync.get(data, (res)=>{
						if(this.getDepObj().runtime.lastError){
							reject(this.getDepObj().runtime.lastError);
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
