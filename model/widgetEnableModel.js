class widgetEnableModel extends appModel {
	constructor() {
		super();
	}
	writeValue(value){
		return save({"e": value});
	}
	readValue(){
		return ponyfill.storage.sync.get({
			"e": DEFAULT_ENABLE_VALUE
		}).then((data)=>{
			return data.e;
		});
	}
	storageChangeEvent(e){
		if( e.hasOwnProperty("w") && e.w.newValue == windowId ) return;
		if( e.hasOwnProperty("e") ){
			this.getMethodOnStorageChange()(e.e.newValue);
		}
	}
}
