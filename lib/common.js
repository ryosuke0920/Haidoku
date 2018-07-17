const XHR_TIMEOUT = 5000;

function show(node){
	node.classList.remove("hide");
}

function hide(node){
	node.classList.add("hide");
}

function onOpenWindowError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationOpenWindowError", [e.message]));
}

function onReadError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationReadOptionError", [e.message]));
}

function onSaveError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationSaveOptionError", [e.message]));
}

function unexpectedError(e){
	console.error(e);
	return notice(ponyfill.i18n.getMessage("notificationUnexpectedError", [e.message]));
}

function notice(message){
	let noticer = ponyfill.notifications.create({
		"type": "basic",
		"iconUrl": ponyfill.extension.getURL("/image/icon48.png"),
		"title": ponyfill.i18n.getMessage("extensionName"),
		"message": message
	});
	return noticer;
}

function makeMetadata(){
	let manifest = ponyfill.runtime.getManifest();
	let now = new Date();
	let data = {
		"v": manifest.version,
		"d": now.toString(),
	};
	return data;
}

let windowId = Math.random();

function saveW(data){
	data["w"] = windowId = Math.random();
	return save(data);
}

function save(data){
	data["m"] = makeMetadata();
	let setter = ponyfill.storage.sync.set(data);
	return setter;
}

function makeURL(url,text){
	text  = encodeURIComponent(text);
	url = url.replace("$1", text);
	return url;
}

function setI18n(replaceList){
	for(let i=0; i<replaceList.length; i++){
		let json = replaceList[i];
		let list = document.querySelectorAll(json["selector"]);
		for(let i=0; i<list.length; i++){
			let node = list[i];
			node[json["property"]] = ponyfill.i18n.getMessage( json["key"] );
		}
	}
}

function shortText(text, max) {
	if( text.length <= max ) return text;
	return text.slice(0,max) + "...";
}

function getFormalDateString(d=new Date()){
	let month = d.getMonth()+1;
	if( month < 10 ) month = "0" + month;
	let day = d.getDate();
	if( day < 10 ) day = "0" + day;
	return d.getFullYear() + "-" + month + "-" + day;
}

function promiseAjax(method="GET", url, responseType){
	return new Promise((resolve, reject)=>{
		let xhr = new XMLHttpRequest();
		xhr.addEventListener("load", (e)=>{
			resolve(e);
		});
		xhr.addEventListener("error", (e)=>{
			console.error(e);
			reject(e);
		});
		xhr.addEventListener("abort", (e)=>{
			console.error(e);
			reject(e);
		});
		xhr.open(method, url);
		xhr.timeout = XHR_TIMEOUT;
		if(responseType) xhr.responseType = responseType;
		xhr.send();
	});
}
