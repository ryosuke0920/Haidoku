function checkByte(text,length){
	let count = byteLength(text);
	if( length < count ) return false;
	return true;
}

function byteLength(text){
	text = encodeURIComponent(text);
	let count = 0;
	let i = 0;
	while( i < text.length ){
		count++;
		if( text.substr(i,1) == "%" ){
			i += 3;
		}
		else {
			i += 1;
		}
	}
	return count;
}

const BLANK_REGEX = new RegExp(/^\s*$/);

function checkBlank(text) {
	if( text == null || text == undefined || text.length <= 0 ) return false;
	if( text.match(BLANK_REGEX) ) return false;
	return true;
}

function getUiLang(){
	let lang = ponyfill.i18n.getUILanguage();
	let matcher = lang.match(/^([a-zA-Z0-9]+)\-[a-zA-Z0-9]+$/);
	if( matcher ) lang = matcher[1];
	return lang;
}

function getDefaultServiceCode(){
	let serviceCode = getUiLang();
	if( !API_SERVICE.hasOwnProperty(serviceCode) ) serviceCode = DEFAULT_LOCALE;
	return serviceCode;
}

function getDefaultLanguageFilter(serviceCode=getDefaultServiceCode()){
	let service = API_SERVICE[serviceCode];
	return API_SERVICE_PROPERTY[service].defaultLanguage;
}
