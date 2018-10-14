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
	hostnameProsess().catch((e)=>console.error(e));
}

function onClickEvent(e){
	if(e.target.id == "optionOpener"){
		ponyfill.runtime.openOptionsPage();
		window.close();
		return;
	}
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
	show(allowedDominBox);
	hide(disableDominBox);
}

function hostnameProsess(){
	let p = browser.tabs.query({
		"active": true,
		"windowId": browser.windows.WINDOW_ID_CURRENT
	});
	return p.then( getCrrentURL ).then( applyHostname );
}
