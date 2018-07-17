const INDEXED_DB_NAME = "SearchDictionaryFaster";
const INDEXED_DB_VERSION = 3; /* don't use 1.1 */
const READ = "readonly";
const WRITE = "readwrite";
const HISTORYS = "historys";
const RANKING = "ranking";
const FAVICONS = "favicons";

var indexeddb = (()=>{
	class indexeddb {
		constructor(){}

		open(){
			return this.request = window.indexedDB.open( INDEXED_DB_NAME, INDEXED_DB_VERSION );
		}

		version1(e){
			let db = e.target.result;
			let historys = db.createObjectStore( HISTORYS, {"keyPath": "id", "autoIncrement": true});
			/* 1.2.7 or less */
			//historys.createIndex("textIndex", "text", {"unique": false});
		}

		version2(e){
			let requet = e.target;
			let db = requet.result;
			let transaction = requet.transaction;
			let rankings = db.createObjectStore( RANKING, {"keyPath": "text", "autoIncrement": false});
			rankings.createIndex("countIndex", "count", {"unique": false});
			let historys = transaction.objectStore(HISTORYS);
			historys.createIndex("dateIndex", "date", {"unique": false});
			/* 1.2.7 or less */
			if( historys.indexNames.contains("textIndex")){
				historys.deleteIndex("textIndex");
			}
		}

		version3(e){
			let db = e.target.result;
			let favicons = db.createObjectStore( FAVICONS, {"keyPath": "url", "autoIncrement": false});
		}

		prepareRequest(request){
			return new Promise((resolve,reject)=>{
				request.onupgradeneeded = (e)=>{
					if( e.oldVersion < 1 ) this.version1(e);
					if( e.oldVersion < 2 ) this.version2(e);
					if( e.oldVersion < 3 ) this.version3(e);
				};
				request.onsuccess = (e)=>{
					resolve(e);
				};
				request.onerror = (e)=>{
					reject(e);
				};
			});
		}
	}

	return new indexeddb();
})();
