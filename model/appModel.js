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
}
