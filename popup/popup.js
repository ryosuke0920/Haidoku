init();

function init(){
	let list = [
		{ "selector": ".enableText", "property": "innerText", "key": "htmlEnableText" },
		{ "selector": ".disableText", "property": "innerText", "key": "htmlDisable" },
		{ "selector": ".enableAllDomainText", "property": "innerText", "key": "htmlEnableAllDomain" },
		{ "selector": ".enableAllowedDomainText", "property": "innerText", "key": "htmlEnableAllowedDomain" },
		{ "selector": ".allowedDomainText", "property": "innerText", "key": "htmlAllowedDomain" },
		{ "selector": ".allowText", "property": "innerText", "key": "htmlAllowText" },
		{ "selector": ".optionName", "property": "innerText", "key": "htmlOpenOption" }
	];
	setI18n(list);

	document.querySelector("#optionOpener").addEventListener("click", (e)=>{
		ponyfill.runtime.openOptionsPage();
		window.close();
	});

	ponyfill.tabs.getCurrent().then((tab)=>{
		console.log(tab);
	});
}
