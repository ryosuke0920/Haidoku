class widgetEnableModel extends model {
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
}
