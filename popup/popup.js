let allowDomainCheckNode = document.querySelector("#allowDomainCheck");
let weModel = new widgetEnableModel();
let dlModel = new domainListModel();

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
		if(e.target.checked){
			e.preventDefault();
			addDomainListProcess(domain, e.target).catch(onSaveError);
		}
		else{
			dlModel.removeDomainList(domain).catch(onSaveError);
		}
		return;
	}
	else if(e.target.name == "enable"){
		weModel.writeValue(e.target.value).catch(onSaveError);
		return;
	}
}

function addDomainListProcess(domain,checkNode){
	dlModel.setDomain(domain);
	return Promise.resolve().then( dlModel.checkProcess.bind(dlModel) ).then((result)=>{
		if(!result){
			notice(dlModel.getMessage());
			return;
		}
		checkNode.checked = true;
		return dlModel.saveDomainList(domain);
	});
}

function showBody(){
	show(document.body);
}

function configProsess(){
	let p1 = weModel.readValue().then((value)=>{
		document.querySelector("[name=\"enable\"][value=\""+value+"\"]").checked = true;
	});
	let p2 = dlModel.readList().then((list)=>{
		if(list.includes(allowDomainCheckNode.value)){
			allowDomainCheckNode.checked = true;
		}
	});
	return Promise.all([p1,p2]);
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
