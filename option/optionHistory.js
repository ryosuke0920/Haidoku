( () => {
	let historyNode = document.querySelector("#history");
	let historyContainerNode = historyNode.querySelector("#historyContainer");
	let rowlPrototypeNode = historyNode.querySelector("#rowPrototype");
	Promise.resolve().then(initHistory).catch( unexpectedError );

	function initHistory(){
		initI18n();
		historyUpdateTable();
		historyNode.addEventListener("click", historyBehavior);
	}

	function initI18n(){
		let list = [
			{ "selector": ".historyUpdateButton", "property": "innerText", "key": "htmlHistoryUpdateButton" },
			{ "selector": ".historyPageText", "property": "innerText", "key": "htmlHistoryPageText" },
			{ "selector": ".historyRowSizeText", "property": "innerText", "key": "htmlHistoryRowSizeText" },
			{ "selector": ".historyRowSizeAllText", "property": "innerText", "key": "htmlHistoryRowSizeAllText" },
			{ "selector": ".historyOrderAsc", "property": "innerText", "key": "htmlHistoryOrderAsc" },
			{ "selector": ".historyOrderDesc", "property": "innerText", "key": "htmlHistoryOrderDesc" },
			{ "selector": ".historyDeleteButton", "property": "innerText", "key": "htmlHistoryCheckDelete" },
			{ "selector": ".historyDeleteAllButton", "property": "innerText", "key": "htmlHistoryAllDelete" },
			{ "selector": ".historyDescription", "property": "innerText", "key": "htmlHistoryDescription" },
			{ "selector": ".headHistoryDate", "property": "innerText", "key": "htmlHistoryDate" },
			{ "selector": ".headHistoryText", "property": "innerText", "key": "htmlHistoryText" },
			{ "selector": ".headHistoryFromSite", "property": "innerText", "key": "htmlHistoryFromSite" },
			{ "selector": ".headHistoryToSite", "property": "innerText", "key": "htmlHistoryToSite" },
			{ "selector": ".historyPageFirst", "property": "innerText", "key": "htmlPageFirst" },
			{ "selector": ".historyPagePrev", "property": "innerText", "key": "htmlPagePrev" },
			{ "selector": ".historyPageNext", "property": "innerText", "key": "htmlPageNext" },
			{ "selector": ".historyPageLast", "property": "innerText", "key": "htmlPageLast" }
		];
		setI18n(list);
	}

	function historyBehavior(e){
		let cassList = e.target.classList;
		if(cassList.contains("historyUpdateButton")){
			removeHistoryRows();
			historyUpdateButton();
		}
		else if(cassList.contains("historyPageFirst")){
			removeHistoryRows();
			historyUpdateTableFirst();
		}
		else if(cassList.contains("historyPagePrev")){
			removeHistoryRows();
			historyUpdateTablePrev();
		}
		else if(cassList.contains("historyPageNext")){
			removeHistoryRows();
			historyUpdateTableNext();
		}
		else if(cassList.contains("historyPageLast")){
			removeHistoryRows();
			historyUpdateTableEnd();
		}
		else if(cassList.contains("historyCheckAllRows")){
			historyCheckAllRows(e.target.checked);
		}
		else if(cassList.contains("historyDeleteButton")){
			historyDelete();
		}
		else if(cassList.contains("historyDeleteAllButton")){
			historyDeleteAll();
		}
	}

	function historyDeleteAll(){
		if( !window.confirm(ponyfill.i18n.getMessage("alertHistoryAllDelete")) )return;
		return Promise.resolve()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyDeleteAllRows)
		.then(historyDeleteAllClose);
	}

	function historyDeleteAllRows(e){
		let db = e.target.result;
		let promise = new Promise((resolve,reject)=>{
			let transaction = db.transaction(["historys"], WRITE);
			let objectStore = transaction.objectStore(HISTORYS);
			let req = objectStore.clear();
			req.onsuccess = (e)=>{ resolve(e); };
			req.onerror = (e)=>{ reject(e); };
		});
		return promise;
	}

	function thisToZero(){
		this.page = 0;
		this.start = this.end = -1;
	}

	function historyDeleteAllClose() {
		removeHistoryRows();
		let data = {};
		thisToZero.bind(data)();
		historyClose.bind(data)();
	}

	function historyDelete() {
		let list = historyContainerNode.querySelectorAll(".historyCheckbox:checked");
		if( list.length <= 0 ) return;
		let ids = [];
		for(let i=0; i<list.length; i++){
			ids.push( parseInt(list[i].value) );
		}
		let data = {"ids": ids};
		return Promise.resolve()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyDeleteTransaction)
		.then(historyDeleteRow.bind(data))
		.then(historyDeleteClose);
	}

	function historyDeleteTransaction(e){
		let db = e.target.result;
		let transaction = db.transaction(["historys"], WRITE);
		let objectStore = transaction.objectStore(HISTORYS);
		return objectStore;
	}

	function historyDeleteRow(objectStore){
		if( this.ids.length <= 0 ) return ;
		let id = this.ids.pop();
		let promise = new Promise((resolve,reject)=>{
			let req = objectStore.delete(id);
			req.onsuccess = (e)=>{ resolve(objectStore); };
			req.onerror = (e)=>{ reject(e); };
		});
		return promise.then(historyDeleteRow.bind(this));
	}

	function historyDeleteClose(){
		removeHistoryRows();
		historyUpdateButton();
	}

	function removeHistoryRows(){
		historyNode.querySelector(".historyCheckAllRows").checked = false;
		while( historyContainerNode.lastChild ){
			historyContainerNode.removeChild( historyContainerNode.lastChild );
		}
	}

	function getHistoryRowSize(){
		let select = historyNode.querySelector(".historyRowSize");
		return parseInt(select.value);
	}

	function getHistoryPage(num=-1){
		let pageNode = historyNode.querySelector(".historyPage");
		let page = parseInt(pageNode.value) + num;
		if (page < 0) page = 0;
		return page;
	}

	function historyUpdateButton(){
		if( isAllSize() ) return historyUpdateTableAll();
		let page = getHistoryPage(-1);
		return historyUpdateTable(page);
	}

	function historyUpdateTableFirst(){
		if( isAllSize() ) return historyUpdateTableAll();
		return historyUpdateTable(0);
	}

	function historyUpdateTablePrev(){
		if( isAllSize() ) return historyUpdateTableAll();
		let page = getHistoryPage(-2);
		return historyUpdateTable(page);
	}

	function historyUpdateTableNext(){
		if( isAllSize() ) return historyUpdateTableAll();
		let page = getHistoryPage(0);
		return historyUpdateTable(page);
	}

	function getHistoryOrder(){
		let node = historyNode.querySelector(".historyOrder");
		return node.value;
	}

	function historyUpdateTableEnd(){
		if( isAllSize() ) return historyUpdateTableAll();
		let size = getHistoryRowSize();
		let data = {
			"order": getHistoryOrder(),
			"affectedRow": 0,
			"size": size
		};
		return Promise.resolve()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyCount.bind(data))
		.then(historyDecideRangeEnd.bind(data))
		.then(historyCursor.bind(data))
		.then(historyClose.bind(data));
	}

	function isAllSize(){
		let checkbox = historyNode.querySelector(".historyRowSizeAll");
		return checkbox.checked;
	}

	function historyUpdateTableAll(){
		let data = {
			"all":true,
			"order": getHistoryOrder(),
			"affectedRow":0
		};
		return Promise.resolve()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyCount.bind(data))
		.then(historyAllRange.bind(data))
		.then(historyCursor.bind(data))
		.then(historyClose.bind(data));
	}

	function historyUpdateTable(page=0){
		let size = getHistoryRowSize();
		let data = {
			"order": getHistoryOrder(),
			"affectedRow": 0,
			"size": size,
			"page": page
		};
		return Promise.resolve()
		.then(indexeddb.open)
		.then(indexeddb.prepareRequest)
		.then(historyCount.bind(data))
		.then(historyDecideRange.bind(data))
		.then(historyCursor.bind(data))
		.then(historyClose.bind(data));
	}

	function historyCount(e){
		let db = e.target.result;
		let promise = new Promise((resolve,reject)=>{
			let transaction = db.transaction(["historys"], READ);
			let objectStore = transaction.objectStore(HISTORYS);
			let req = objectStore.count();
			req.onsuccess = (e)=>{ resolve(e); };
			req.onerror = (e)=>{ reject(e); };
		});
		return promise;
	}

	function historyAllRange(e){
		let db = e.target.result;
		this.count = e.target.result;
		if( !this.count ){
			thisToZero.bind(this)();
			return e;
		}
		this.page = 0;
		this.start = 0;
		this.end = this.count - 1;
		return e;
	}

	function historyDecideRange(e){
		let db = e.target.result;
		this.count = e.target.result;
		if( !this.count ){
			thisToZero.bind(this)();
			return e;
		}
		this.start = this.page * this.size;
		this.end = this.start + this.size - 1;
		if ( this.count - 1 < this.end ) historyDecideRangeEnd.bind(this)(e);
		return e;
	}

	function historyDecideRangeEnd(e){
		let db = e.target.result;
		this.count = e.target.result;
		if( !this.count ){
			thisToZero.bind(this)();
			return e;
		}
		this.page = Math.ceil( this.count / this.size )-1;
		this.start = this.page * this.size;
		this.end = this.count - 1;
		return e;
	}

	function historyCursor(e){
		if( !this.count ) return Promise.resolve();
		let promise = new Promise((resolve,reject)=>{
			let transaction = e.target.transaction;
			let objectStore = transaction.objectStore(HISTORYS);
			let req = objectStore.openCursor(null,this.order);
			let i=0;
			req.onsuccess = (e)=>{
				let cursor = e.target.result;
				if( ! cursor ) {
					resolve(e);
					return;
				}
				if( this.start <= i && i <= this.end ){
					++this.affectedRow;
					historyMakeRow(
						cursor.key,
						cursor.value.date,
						cursor.value.text,
						cursor.value.fromURL,
						cursor.value.fromTitle,
						cursor.value.toURL,
						cursor.value.toTitle
					);
				}
				i++;
				cursor.continue();
			};
			req.onerror = (e)=>{ reject(e); };
		});
		return promise;
	}

	function historyMakeRow(id,date,text,fromURL,fromTitle,toURL,toTitle){
		let node = rowlPrototypeNode.cloneNode(true);
		node.removeAttribute("id");
		let historyCheckbox = node.querySelector(".historyCheckbox");
		historyCheckbox.value = id;
		let historyDate = node.querySelector(".historyDate");
		historyDate.innerText = date.toLocaleDateString();
		historyDate.title = date.toLocaleString();
		let historyText = node.querySelector(".historyText");
		historyText.innerText = text;
		historyText.title = text;
		let historyFromSite = node.querySelector(".historyFromSite");
		historyFromSite.title = fromURL;
		let historyFromSiteAnchor = historyFromSite.querySelector("a");
		historyFromSiteAnchor.href = fromURL;
		historyFromSiteAnchor.innerText = fromTitle;
		let historyToSite = node.querySelector(".historyToSite");
		let url = makeURL(toURL,text);
		historyToSite.title = url
		let historyToSiteAnchor = historyToSite.querySelector("a");
		historyToSiteAnchor.href = url;
		historyToSiteAnchor.innerText = toTitle;
		historyContainerNode.appendChild(node);
	}

	function historyClose(){
		let pageNode = historyNode.querySelector(".historyPage");
		pageNode.value = this.page + 1;
		let startRowNode = historyNode.querySelector(".historyStartRow");
		startRowNode.innerText = this.start + 1;
		let endRowNode = historyNode.querySelector(".historyEndRow");
		endRowNode.innerText = this.end + 1;
		let countRowNode = historyNode.querySelector(".historyCountRow");
		countRowNode.innerText = this.count || 0;
	}

	function historyCheckAllRows(checked){
		let list = historyContainerNode.querySelectorAll(".historyCheckbox");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			node.checked = checked;
		}
	}
})();
