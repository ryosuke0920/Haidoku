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

function err(e){
	console.error(e);
}

function notice(message){
	return ponyfill.notifications.create({
		"type": "basic",
		"iconUrl": ponyfill.extension.getURL("/image/icon48.png"),
		"title": ponyfill.i18n.getMessage("extensionName"),
		"message": message
	});
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
	return ponyfill.storage.sync.set(data);
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
