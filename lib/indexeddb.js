const INDEXED_DB_NAME = "SearchDictionaryFaster";
const INDEXED_DB_VERSION = 2; /* don't use 1.1 */
const READ = "readonly";
const WRITE = "readwrite";
const HISTORYS = "historys";
const RANKING = "ranking";

var indexeddb = (()=>{
	class indexeddb {
		constructor(){}

		open(){
			return this.db = window.indexedDB.open( INDEXED_DB_NAME, INDEXED_DB_VERSION );
		}

		version1(e){
			let db = e.target.result;
			let historys = db.createObjectStore( HISTORYS, {"keyPath": "id", "autoIncrement": true});
			historys.createIndex("textIndex", "text", {"unique": false});
		}

		version2(e){
			let db = e.target.result;
			let rankings = db.createObjectStore( RANKING, {"keyPath": "text", "autoIncrement": false});
			rankings.createIndex("countIndex", "count", {"unique": false});
			let historys = this.db.transaction.objectStore(HISTORYS);
			historys.createIndex("dateIndex", "date", {"unique": false});
		}

		prepareRequest(request){
			let promise = new Promise((resolve,reject)=>{
				request.onupgradeneeded = (e)=>{
					if( e.oldVersion < 1 ) this.version1(e);
					if( e.oldVersion < 2 ) this.version2(e);
				};
				request.onsuccess = (e)=>{
					resolve(e);
				};
				request.onerror = (e)=>{
					reject(e);
				};
			});
			return promise;
		}
	}

	return new indexeddb();
})();
