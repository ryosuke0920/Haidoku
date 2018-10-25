class domainListModel extends appModel {
	constructor(){
		super();
		this.domain = "";
		this.domainList = [];
	}
	writeList(list=[]){
		return saveW({"dl": list});
	}
	readList(){
		return ponyfill.storage.sync.get({
			"dl": DEFAULT_DOMAIN_LIST
		}).then((data)=>{
			return data.dl;
		});
	}
	checkProcess(domain){
		return this.checkDomainProcess(domain).then((result)=>{
			if(!result) return false;
			return this.checkDomainListProcess();
		});
	}
	checkDomainProcess(domain){
		return Promise.resolve().then(()=>{
			if(!checkBlank(domain)){
				this.setMessage(ponyfill.i18n.getMessage("htmlCheckBlankError"));
				return false;
			}
			else if(!this.isSafeDomainLength(domain)){
				this.setMessage(ponyfill.i18n.getMessage("notificationDomainLengthError", [DOMAIN_MAX_LENGTH]));
				return false;
			}
			return true;
		});
	}
	isSafeDomainLength(domain){
		return checkByte(domain, DOMAIN_MAX_LENGTH);
	}
	checkDomainListProcess(){
		return this.readList().then( this.isCapableDomainList.bind(this) ).then((result)=>{
			if(!result){
				this.setMessage(ponyfill.i18n.getMessage("notificationDomainListSizeError", [DOMAIN_LIST_MAX_SIZE]));
				return false;
			}
			return true;
		});
	}
	isCapableDomainList(list){
		return list.length < DOMAIN_LIST_MAX_SIZE;
	}
	saveDomainList(domain){
		return this.readList().then((list)=>{
			if(this.isAllowedDomain(list, domain)) return;
			list.push({"d":domain});
			list.sort();
			return this.writeList(list);
		});
	}
	removeDomainList(domain){
		return this.readList().then((list)=>{
			list = list.filter((e)=>{return e.d != domain});
			return this.writeList(list);
		});
	}
	isAllowedCurrentDomain(list){
		let domain = new URL( window.location.toString() ).hostname;
		return this.isAllowedDomain(list, domain);
	}
	isAllowedDomain(list, domain){
		let flag = false;
		this.each(list,(item)=>{
			if(item.d == domain) {
				flag = true;
				return false;
			}
		});
		return flag;
	}
}
