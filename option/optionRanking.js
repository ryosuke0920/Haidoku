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
		return Promise.resolve()
		.then(indexeddb.open.bind(indexeddb))
		.then(indexeddb.prepareRequest.bind(indexeddb))
		.then(rankingClear)
		.then(rankingFetchText)
		.then(rankingFetchCount)
		.catch(unexpectedError);
	}

	function rankingClear(e) {
		let db = e.target.result;
		return new Promise((resolve,reject)=>{
			let transaction = db.transaction([HISTORYS,RANKING], WRITE);
			let rankingObjectStore = transaction.objectStore(RANKING);
			let req = rankingObjectStore.clear();
			req.onsuccess = (e)=>{ resolve(transaction); };
			req.onerror = (e)=>{ reject(e); };
		});
	}

	function rankingFetchText(transaction){
		return new Promise((resolve,reject)=>{
			let historyObjectStore = transaction.objectStore(HISTORYS);
			let rankingObjectStore = transaction.objectStore(RANKING);
			let index = historyObjectStore.index("textIndex");
			let req = index.openCursor();
			let chain = Promise.resolve();
			req.onsuccess = (e)=>{
				let cursor = e.target.result;
				if( !cursor ) {
					chain.then( (e)=>{ resolve(transaction) } );
					return;
				}
				let text = convert(cursor.key);
				chain = chain.then(()=>{
					return new Promise((resolve,reject)=>{
						let req = rankingObjectStore.get(text);
						req.onsuccess = (e)=>{
							let req;
							if( !e.target.result ){
								let data = { "text": text, "count": 1 };
								req = rankingObjectStore.add(data);
							}
							else {
								e.target.result.count++;
								req = rankingObjectStore.put(e.target.result);
							}
							req.onsuccess = (e)=>{ resolve(e); }
							req.onerror = (e)=>{ reject(e); }
						}
						req.onerror = (e)=>{ reject(e); }
					});
				});
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

	function rankingFetchCount(transaction){
		return new Promise((resolve,reject)=>{
			let rankingObjectStore = transaction.objectStore(RANKING);
			let index = rankingObjectStore.index("countIndex");
			let req = index.openCursor(null,"prev");
			req.onsuccess = (e)=>{
				let cursor = e.target.result;
				if( !cursor ) {
					onNoDataInfo();
					resolve(transaction);
					return;
				}
				let max = cursor.value.count;
				let req = index.openCursor(null,"prev");
				req.onsuccess = (e)=>{
					let cursor = e.target.result;
					if( !cursor ) {
						resolve(transaction);
						return;
					}
					rankingMakeRow( cursor.value.text, cursor.value.count, max );
					cursor.continue();
				}
				req.onerror = (e)=>{ reject(e); };
			};
			req.onerror = (e)=>{ reject(e); };
		});
	}

	function rankingMakeRow(text, count, max){
		let node = rankingPrototypeNode.cloneNode(true);
		node.removeAttribute("id");
		let rankingText = node.querySelector(".rankingText");
		rankingText.title = text;
		rankingText.innerText = shortText(text);
		let rankingCount = node.querySelector(".rankingCount");
		rankingCount.innerText = count;
		let percentage = Math.trunc( count / max * 100 ) + "%";
		let rankingGraph = node.querySelector(".rankingGraph");
		rankingGraph.title = percentage;
		let rankingGraphLine = node.querySelector(".rankingGraphLine");
		rankingGraphLine.setAttribute("width", percentage );
		rankingContainerNode.append(node);
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
