class requestStatusModel extends appModel {
	constructor(){
		super();
		this.fetchId = (()=>{ let id = 0; return ()=>{return ++id} })();
		this.hash = {};
	}
	abort(){
		this.hash = {};
	}
	add(id){
		this.hash[id] = true;
	}
	start(){
		let id = this.fetchId();
		this.add(id);
		return id;
	}
	done(id){
		delete this.hash[id];
	}
	isActive(id){
		return this.hash.hasOwnProperty(id);
	}
	hasAnother(){
		let keyList = Object.keys(this.hash);
		return 0 < keyList.length;
	}
}