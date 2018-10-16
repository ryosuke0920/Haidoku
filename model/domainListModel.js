class domainListModel extends model {
	constructor(){
		super();
		this.domain = "";
		this.domainList = [];
	}
	setDomain(domain){
		this.domain = domain;
	}
	getDomain(){
		return this.domain;
	}
	setDomainList(domainList){
		this.domainList = domainList;
	}
	getDomainList(){
		return this.domainList;
	}
	setMethodOnStorageChange(method){
		this.method = method;
	}
	getMethodOnStorageChange(){
		return this.method;
	}
	writeList(list){
		return saveW({"dl": list});
	}
	readList(){
		return ponyfill.storage.sync.get({
			"dl": DEFAULT_DOMAIN_LIST
		}).then((data)=>{
			this.setDomainList(data.dl);
			return data.dl;
		});
	}
	checkProcess(){
		return this.checkDomainProcess().then((result)=>{
			if(result) return this.checkDomainListProcess();
			return false;
		});
	}
	checkDomainProcess(){
		return Promise.resolve().then(()=>{
			if(!this.checkDomain()){
				this.setMessage(ponyfill.i18n.getMessage("notificationDomainLengthError", [DOMAIN_MAX_LENGTH]));
				return false;
			}
			return true;
		});
	}
	checkDomain(){
		return checkByte(this.getDomain(), DOMAIN_MAX_LENGTH);
	}
	checkDomainListProcess(){
		return this.readList().then( this.checkDomainList.bind(this) ).then((result)=>{
			if(!result){
				this.setMessage(ponyfill.i18n.getMessage("notificationDomainListSizeError", [DOMAIN_LIST_MAX_SIZE]));
				return false;
			}
			return true;
		});
	}
	checkDomainList(list){
		return list.length < DOMAIN_LIST_MAX_SIZE;
	}
	saveDomainList(domain){
		return this.readList().then((list)=>{
			if(list.includes(domain)) return;
			list.push(domain);
			list.sort();
			return this.writeList(list);
		});
	}
	removeDomainList(domain){
		return this.readList().then((list)=>{
			list = list.filter((e)=>{return e != domain});
			return this.writeList(list);
		});
	}
	addStorageChangeListener(method){
		this.setMethodOnStorageChange(method);
		ponyfill.storage.onChanged.addListener(this.storageChangeEvent.bind(this));
	}
	storageChangeEvent(e){
		if( e.hasOwnProperty("w") && e.w.newValue == windowId ) return;
		if( e.hasOwnProperty("dl") ){
			this.setDomainList(e.dl.newValue);
			this.getMethodOnStorageChange()(e.dl.newValue);
		}
	}
}
