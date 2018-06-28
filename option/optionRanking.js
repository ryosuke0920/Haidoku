( () => {
	const FLAT_REGEX = new RegExp(/(?:\r?\n+|[,|.|"|'])/, "g");
	const WHITESPACE_REGEX = new RegExp(/\s+/, "g");
	const MAX_LENGHT = 31 /* Archaiomelesidonophrunicherata */
	let rankingNode = document.querySelector("#ranking");
	let rankingContainerNode = rankingNode.querySelector("#rankingContainer");
	let rankingPrototypeNode = rankingNode.querySelector("#rankingRowPrototype");

	Promise.resolve().then(initranking).catch(unexpectedError);

	function initranking(){
		initI18n();
		rankingNode.addEventListener("click", rankingBehavior);
	}

	function initI18n(){
		let list = [
			{ "selector": ".rankingDescription", "property": "innerText", "key": "htmlRankingDescription" },
			{ "selector": ".rankingAggregateButton", "property": "innerText", "key": "htmlRankingAggregateButton" },
			{ "selector": ".headRankingText", "property": "innerText", "key": "htmlRankingText" },
			{ "selector": ".headRankingCount", "property": "innerText", "key": "htmlRankingCount" },
			{ "selector": ".headRankingGraph", "property": "innerText", "key": "htmlRankingGraph" }
		];
		setI18n(list);
	}

	function rankingBehavior(e){
		let cassList = e.target.classList;
		if(cassList.contains("rankingAggregateButton")){
			rankingAggregate();
		}
	}

	function rankingAggregate(){
		resetRankingContainer();
		let data = {"counter":{}};
		return Promise.resolve()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(rankingFetchText.bind(data))
		.then(rankingMakeRow.bind(data))
		.catch(unexpectedError);
	}

	function rankingFetchText(e){
		return new Promise((resolve,reject)=>{
			let db = e.target.result;
			let transaction = db.transaction([HISTORYS], READ);
			let objectStore = transaction.objectStore(HISTORYS);
			let index = objectStore.index("textIndex");
			let req = index.openCursor();
			req.onsuccess = (e)=>{
				let cursor = e.target.result;
				if( !cursor ) {
					resolve();
					return;
				}
				let text = convert(cursor.key);
				if( this.counter.hasOwnProperty(text) ) {
					this.counter[text]["count"] += 1;
				}
				else {
					this.counter[text] = { "count": 1 };
				}
				cursor.continue();
			};
			req.onerror = (e)=>{ reject(e); };
		});
	}

	function convert(text) {
		return text
			.replace(FLAT_REGEX, " ")
			.replace(WHITESPACE_REGEX, " ")
			.trim()
			.toLocaleLowerCase();
	}

	function rankingMakeRow(e){
		let list = sortList(toList(this.counter));
		if( list.length <= 0 ) {
			onNoDataInfo();
			return;
		}
		let max = list[0].count;
		for(let i=0; i<list.length; i++){
			let obj = list[i];
			let node = rankingPrototypeNode.cloneNode(true);
			node.removeAttribute("id");
			let rankingText = node.querySelector(".rankingText");
			rankingText.title = obj.text;
			rankingText.innerText = shortText(obj.text);
			let rankingCount = node.querySelector(".rankingCount");
			rankingCount.innerText = obj.count;
			let percentage = Math.trunc( obj.count / max * 100 ) + "%";
			let rankingGraph = node.querySelector(".rankingGraph");
			rankingGraph.title = percentage;
			let rankingGraphLine = node.querySelector(".rankingGraphLine");
			rankingGraphLine.setAttribute("width", percentage );
			rankingContainerNode.append(node);
		}
	}

	function shortText(text) {
		if( text.length <= MAX_LENGHT ) return text;
		return text.slice(0,MAX_LENGHT) + "...";
	}

	function resetRankingContainer(){
		while(rankingContainerNode.lastChild){
			rankingContainerNode.removeChild(rankingContainerNode.lastChild);
		}
	}

	function toList(hash) {
		let list = [];
		let keys = Object.keys(hash);
		for(let i=0; i<keys.length; i++){
			let key = keys[i];
			list.push({
				"text": key,
				"count": hash[key]["count"]
			});
		}
		return list;
	}

	function sortList(list) {
		list = list.sort((a,b)=>{
			return a["count"] < b["count"];
		});
		return list;
	}

})();
