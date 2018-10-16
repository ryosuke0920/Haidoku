class widgetEnablerModel extends model {
	constructor() {
		super();
	}
	save(value){
		return save({"e": value}).catch(onSaveError);
	}
	getValue(){
		return ponyfill.storage.sync.get({
			"e": DEFAULT_ENABLE_VALUE
		}).then((data)=>{
			return data.e;
		});
	}
}
