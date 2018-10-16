let allowDomainCheckNode = document.querySelector("#allowDomainCheck");
let widgetEnabler = new widgetEnablerModel();

init();

function init(){
	let list = [
		{ "selector": ".enableText", "property": "innerText", "key": "htmlEnableText" },
		{ "selector": ".disableText", "property": "innerText", "key": "htmlDisable" },
		{ "selector": ".enableAllDomainText", "property": "innerText", "key": "htmlEnableAllDomain" },
		{ "selector": ".enableAllowedDomainText", "property": "innerText", "key": "htmlEnableAllowedDomain" },
		{ "selector": ".allowedDomainText", "property": "innerText", "key": "htmlAllowedDomain" },
		{ "selector": ".allowText", "property": "innerText", "key": "htmlAllowText" },
		{ "selector": ".disableDomainText", "property": "innerText", "key": "htmlDisableDomainText" },
		{ "selector": ".optionName", "property": "innerText", "key": "htmlOpenOption" }
	];
	setI18n(list);
	document.querySelector("body").addEventListener("click", onClickEvent );
	Promise.resolve().then(hostnameProsess).then(configProsess).then(showBody).catch((e)=>console.error(e));
}

function onClickEvent(e){
	if(e.target.id == "optionOpener"){
		ponyfill.runtime.openOptionsPage();
		window.close();
		return;
	}
	else if(e.target.id == "allowDomainCheck"){
		let domain = e.target.value;
		console.log("domain=" + domain);
		if(e.target.checked){
			e.preventDefault();
			addDomainList(domain,e.target).catch(onSaveError);
		}
		else{
			removeDomainList(domain).catch(onSaveError);
		}
		return;
	}
	else if(e.target.name == "enable"){
		widgetEnabler.save(e.target.value).catch(onSaveError);
		return;
	}
}

function addDomainList(domain,checkNode){
	if(!checkByte(domain,DOMAIN_MAX_LENGTH)){
		notice(ponyfill.i18n.getMessage("notificationCheckDomainByteLengthError", [DOMAIN_MAX_LENGTH] ));
		return;
	}
	return Promise.resolve().then( checkDomainListSize ).then((result)=>{
		console.log(result);
		if(!result){
			notice(ponyfill.i18n.getMessage("notificationCheckDomainListSizeError", [DOMAIN_LIST_MAX_SIZE] ));
			return;
		}
		checkNode.checked = true;
		return saveDomainList(domain);
	});
}

function checkDomainListSize(){
	let p = ponyfill.storage.sync.get({
		"dl": DEFAULT_DOMAIN_LIST
	});
	return p.then((data)=>{
		console.log(data);
		return data.dl.length<DOMAIN_LIST_MAX_SIZE;
	});
}

function saveDomainList(domain){
	let p = ponyfill.storage.sync.get({
		"dl": DEFAULT_DOMAIN_LIST
	});
	return p.then((data)=>{
		console.log(data);
		if(data.dl.includes(domain)) return;
		data.dl.push(domain);
		data.dl.sort();
		return save({"dl": data.dl});
	});
}

function removeDomainList(domain){
	return Promise.resolve().then( getDomainList ).then( (domainList)=>{
		domainList = makeRemoveDomainList(domainList, domain)
		return save({"dl": domainList});
	});
}

function showBody(){
	show(document.body);
}

function configProsess(){
	let p1 = widgetEnabler.getValue().then((value)=>{
		document.querySelector("[name=\"enable\"][value=\""+value+"\"]").checked = true;
	});
	let p2 = ponyfill.storage.sync.get({
		"dl": DEFAULT_DOMAIN_LIST
	}).then( onGotConfig );
	return Promise.all([p1,p2]);
}

function onGotConfig(data){
	console.log(data);
	if(data.dl.includes(allowDomainCheckNode.value)){
		allowDomainCheckNode.checked = true;
	}
}

function hostnameProsess(){
	return Promise.resolve().then( getActiveTab ).then( getCrrentURL ).then( applyHostname );
}

function getActiveTab(){
	return browser.tabs.query({
		"active": true,
		"windowId": browser.windows.WINDOW_ID_CURRENT
	});
}

function getCrrentURL(tabs){
	return new Promise((resolve, reject)=>{
		if(!tabs || tabs.length != 1){
			console.error("Tabs not found.");
			reject(new Error("Tabs not found."));
			return;
		}
		let url;
		try{
			url = new URL(tabs[0].url);
		}
		catch(e){
			console.error(e);
			reject(e);
			return;
		}
		resolve(url);
	});
}

function applyHostname(url){
	console.log(url);
	let allowedDominBox = document.querySelector("#allowedDominBox");
	let disableDominBox = document.querySelector("#disableDominBox");
	if(!isURL(url.href)){
		hide(allowedDominBox);
		show(disableDominBox);
		return;
	}
	document.querySelector("#domainText").innerText = url.hostname;
	allowDomainCheckNode.value = url.hostname;
	show(allowedDominBox);
	hide(disableDominBox);
}
