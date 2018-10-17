class appModel extends model {
	constructor(){
		super();
	}
	setMethodOnStorageChange(method){
		this.method = method;
	}
	getMethodOnStorageChange(){
		return this.method;
	}
	addStorageChangeListener(method){
		this.setMethodOnStorageChange(method);
		ponyfill.storage.onChanged.addListener(this.storageChangeEvent.bind(this));
	}
	storageChangeEvent(e){
	}
}
