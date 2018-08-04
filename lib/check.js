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
