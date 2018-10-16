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
				this.setMessage(ponyfill.i18n.getMessage("notificationCheckDomainByteLengthError", [DOMAIN_MAX_LENGTH]));
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
				this.setMessage(ponyfill.i18n.getMessage("notificationCheckDomainListSizeError", [DOMAIN_LIST_MAX_SIZE]));
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
}
