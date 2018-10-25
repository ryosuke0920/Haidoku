class appModel extends model {
	constructor(){
		super();
		this.message = "";
	}
	setMessage(message=""){
		this.message = message
	}
	getMessage(){
		return this.message;
	}
	each(list,method){
		for(let i=0; i<list.length; i++){
			if(method( list[i], i, list ) === false) break;
		}
	}
}
