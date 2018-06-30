( () => {
	const FLAT_REGEX = new RegExp(/(?:\r?\n+|[,|.|"|'])/, "g");
	const WHITESPACE_REGEX = new RegExp(/\s+/, "g");
	const CELL_TEXT_MAX_LENGTH = 31 /* Archaiomelesidonophrunicherata */
	let rankingNode = document.querySelector("#ranking");
	let rankingContainerNode = rankingNode.querySelector("#rankingContainer");
	let rankingPrototypeNode = rankingNode.querySelector("#rankingRowPrototype");
	let rankingDateRangeNode = rankingNode.querySelector(".rankingDateRange");
	let rankingStartDateWrapperNode = rankingNode.querySelector(".rankingStartDateWrapper");
	let rankingEndDateWrapperNode = rankingNode.querySelector(".rankingEndDateWrapper");
	let rankingStartDateNode = rankingNode.querySelector(".rankingStartDate");
	let rankingEndDateNode = rankingNode.querySelector(".rankingEndDate");
	let rankingStartDateMessageNode = rankingNode.querySelector(".rankingStartDateMessage");
	let rankingEndDateMessageNode = rankingNode.querySelector(".rankingEndDateMessage");

	Promise.resolve().then(initranking).catch(unexpectedError);

	function initranking(){
		initI18n();
		let dateStr = getFormalDateString();
		rankingStartDateNode.value = dateStr;
		rankingEndDateNode.value = dateStr;
		rankingNode.addEventListener("click", rankingBehavior);
		rankingDateRangeNode.addEventListener("change", rankingDateChangeBehavior);
		rankingStartDateNode.addEventListener("input", rankingStartDateInputBehavior);
		rankingEndDateNode.addEventListener("input", rankingEndDateInputBehavior);
		rankingStartDateNode.addEventListener("blur", rankingStartDateBlurBehavior);
		rankingEndDateNode.addEventListener("blur", rankingEndDateBlurBehavior);
	}

	function initI18n(){
		let list = [
			{ "selector": ".rankingDescription", "property": "innerText", "key": "htmlRankingDescription" },
			{ "selector": ".rankingAggregateButton", "property": "innerText", "key": "htmlRankingAggregateButton" },
			{ "selector": ".headRankingText", "property": "innerText", "key": "htmlRankingText" },
			{ "selector": ".headRankingCount", "property": "innerText", "key": "htmlRankingCount" },
			{ "selector": ".headRankingGraph", "property": "innerText", "key": "htmlRankingGraph" },
			{ "selector": ".rankingOneMonth", "property": "innerText", "key": "htmlRankingOneMonth" },
			{ "selector": ".rankingThreeMonth", "property": "innerText", "key": "htmlRankingThreeMonth" },
			{ "selector": ".rankingSixMonth", "property": "innerText", "key": "htmlRankingSixMonth" },
			{ "selector": ".rankingOneYear", "property": "innerText", "key": "htmlRankingOneYear" },
			{ "selector": ".rankingAllRange", "property": "innerText", "key": "htmlRankingAllRange" },
			{ "selector": ".rankingCustomRange", "property": "innerText", "key": "htmlRankingCustomRange" },
			{ "selector": ".rankingStartDateMessage", "property": "innerText", "key": "htmlDateInputError" },
			{ "selector": ".rankingEndDateMessage", "property": "innerText", "key": "htmlDateInputError" }
		];
		setI18n(list);
	}

	function rankingBehavior(e){
		let cassList = e.target.classList;
		if(cassList.contains("rankingAggregateButton")){
			rankingAggregate();
		}
		else if(cassList.contains("rankingText")){
			rankingSwitchText(e.target);
		}
	}

	function rankingDateChangeBehavior(e){
		if(e.target.value == "custom"){
			rankingShowDate();
		}
		else {
			rankingHideDate();
		}
	}

	function rankingStartDateInputBehavior(e){
		hide(rankingStartDateMessageNode);
	}

	function rankingEndDateInputBehavior(e){
		hide(rankingEndDateMessageNode);
	}

	function rankingStartDateBlurBehavior(e){
		if( !checkDate(rankingStartDateNode.value) ) show(rankingStartDateMessageNode);
	}

	function rankingEndDateBlurBehavior(e){
		if( !checkDate(rankingEndDateNode.value) ) show(rankingEndDateMessageNode);
	}

	function rankingSwitchText(node){
		if(node.title != node.innerText) node.innerText = node.title;
	}

	function rankingHideDate() {
		hide(rankingStartDateWrapperNode);
		hide(rankingEndDateWrapperNode);
		hide(rankingStartDateMessageNode)
		hide(rankingEndDateMessageNode)
	}

	function rankingShowDate() {
		show(rankingStartDateWrapperNode);
		show(rankingEndDateWrapperNode);
	}

	function rankingAggregate(){
		resetRankingContainer();
		let range = rankingMakeRange();
		if( range === undefined ) return;
		let data = { "range": range };
		return Promise.resolve()
		.then(indexeddb.open.bind(indexeddb))
		.then(indexeddb.prepareRequest.bind(indexeddb))
		.then(rankingTransaction)
		.then(rankingClear)
		.then(rankingFetchText.bind(data))
		.then(rankingFetchRanking)
		.then(rankingClear)
		.catch(unexpectedError);
	}

	function rankingMakeRange(){
		let value = rankingDateRangeNode.value;
		if( value == "all" )　return null;
		let start;
		let end;
		if( value == "custom" ){
			start = rankingStartDateNode.value;
			end = rankingEndDateNode.value;
			let error = false;
			if( !checkDate(start) ){
				show(rankingStartDateMessageNode);
				error = true;
			}
			if( !checkDate(end) ){
				show(rankingEndDateMessageNode);
				error = true;
			}
			if( error ) return;
			start = new Date(start);
			end = new Date(end);
			if ( start > end ) {
				let temp = end;
				end = start;
				start = temp;
				rankingStartDateNode.value = getFormalDateString(start);
				rankingEndDateNode.value = getFormalDateString(end);
			}
		}
		else {
			start = new Date();
			end = new Date();
			start.setMonth( start.getMonth() - value );
		}
		start.setHours(0,0,0,0);
		end.setHours(23,59,59,999);
		return IDBKeyRange.bound(start, end);
	}

	function checkDate(value){
		let date = new Date(value);
		if( isNaN(date) ) return false;
		return true;
	}

	function rankingTransaction(e){
		let db = e.target.result;
		let transaction = db.transaction([HISTORYS,RANKING], WRITE);
		return transaction;
	}

	function rankingClear(transaction) {
		return new Promise((resolve,reject)=>{
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
			let index = historyObjectStore.index("dateIndex");
			let req = index.openCursor(this.range);
			let chain = Promise.resolve();
			req.onsuccess = (e)=>{
				let cursor = e.target.result;
				if( !cursor ) {
					chain.then( (e)=>{ resolve(transaction) } );
					return;
				}
				let text = convert(cursor.value.text);
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

	function rankingFetchRanking(transaction){
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
		rankingText.innerText = shortText(text,CELL_TEXT_MAX_LENGTH);
		let rankingCount = node.querySelector(".rankingCount");
		rankingCount.innerText = count;
		let percentage = Math.trunc( count / max * 100 ) + "%";
		let rankingGraph = node.querySelector(".rankingGraph");
		rankingGraph.title = percentage;
		let rankingGraphLine = node.querySelector(".rankingGraphLine");
		rankingGraphLine.setAttribute("width", percentage );
		rankingContainerNode.append(node);
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
