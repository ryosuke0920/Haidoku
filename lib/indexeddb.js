const INDEXED_DB_NAME = "SearchDictionaryFaster";
const INDEXED_DB_VERSION = 1; /* don't use 1.1 */
const READ = "readonly";
const WRITE = "readwrite";
const HISTORYS = "historys";

var indexeddb = (()=>{
	class indexeddb {
		constructor(){}

		open(){
			return window.indexedDB.open( INDEXED_DB_NAME, INDEXED_DB_VERSION );
		}

		prepareRequest(request){
			let promise = new Promise((resolve,reject)=>{
				request.onupgradeneeded = (e)=>{
					let db = e.target.result
					let historys = db.createObjectStore( HISTORYS, {"keyPath": "id", "autoIncrement": true});
					historys.createIndex("textIndex", "text", {"unique": false});
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
