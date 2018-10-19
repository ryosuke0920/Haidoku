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
	isDisable(value){
		return value == "0";
	}
	isEnable(value){
		return value == "1";
	}
	isEnableWithDomain(value){
		return value == "2";
	}
}
