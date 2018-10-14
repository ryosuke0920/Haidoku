(()=>{
	initControl();

	function initControl(){
		console.log("initControl");
		let list = [
			{ "selector": ".displayFunctionTitle", "property": "innerText", "key": "htmlDisplayFunctionTitle" },
			{ "selector": ".domainListTitle", "property": "innerText", "key": "htmlDomainListTitle" }
		];
		setI18n(list);
	}
})();
