(()=>{
	const DIST = 5;
	const LINK_NODE_HEIGHT = 100;
	const LINK_NODE_WIDTH = 200;
	const SCROLL_BAR_WIDTH = 17;
	const STYLE = "\n\
* {\n\
	margin: 0;\n\
	padding: 0;\n\
	border: none;\n\
}\n\
body {\n\
	font-size: small;\n\
	font-family: sans-serif;\n\
}\n\
div {\n\
	background-color: white;\n\
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;\n\
	margin: 2px;\n\
	padding: 0.2em;\n\
	overflow: scroll;\n\
	white-space: nowrap;\n\
}\n\
a {\n\
	text-decoration: none;\n\
}\n\
a:hover {\n\
	text-decoration: underline;\n\
}";
	let px;
	let py;
	let cx;
	let cy;
	let linkNode;
	let optionList = [];
	let boxFlag = false;
	let promise = init();

	function init(){
		linkNode = document.createElement("iframe");
		linkNode.scrolling = "no";
		linkNode.style.position = "absolute";
		linkNode.style.top = "0px";
		linkNode.style.left = "0px";
		linkNode.style.display = "none";
		linkNode.style["z-index"] = "2147483646";
		linkNode.style.border = "none";
		linkNode.style.height = LINK_NODE_HEIGHT + "px";
		linkNode.style.width = LINK_NODE_WIDTH + "px";
		document.querySelector("body").appendChild(linkNode);
		document.onmouseup = (e)=>{
			if( e.button == "0" ) {
				linkBehavior(e);
			}
		}
		window.onresize = (e)=>{
			closeLink();
		}
		document.onkeypress = (e)=>{
			if( e.key == "Escape" || e.key == "Esc") {
				closeLink();
			}
		}
		document.addEventListener('mousemove', (e)=>{
			py = e.pageY;
			px = e.pageX;
			cy = e.clientY;
			cx = e.clientX;
		})
		browser.storage.onChanged.addListener( onStorageChanged );

		return reload();
	}

	function closeLink(){
		linkNode.style.display = "none";
		linkNode.srcdoc = "";
	}

	function linkBehavior(){
		let selection = window.getSelection();
		let select = selection.toString();
		if( boxFlag && select && select.length > 0 ) {
			if( retrieveLink(select) ) {
				let yy = window.innerHeight - SCROLL_BAR_WIDTH - ( cy + LINK_NODE_HEIGHT );
				if ( 0 < yy || window.innerHeight < LINK_NODE_HEIGHT ) yy = 0;
				let xx = window.innerWidth - SCROLL_BAR_WIDTH - ( cx + LINK_NODE_WIDTH );
				if ( 0 < xx || window.innerWidth < LINK_NODE_WIDTH ) xx = 0;
				linkNode.style.top = ( py + yy + DIST )+"px";
				linkNode.style.left = ( px + xx + DIST ) +"px";
				linkNode.style.display = "block";
			}
		}
		else {
			closeLink();
		}
	}

	function onStorageChanged(change, area){
		closeLink();
		let data = {};
		if( change["ol"] ) resetOptionList( change["ol"]["newValue"] );
		if( change["bf"] ) resetBoxFlag( change["bf"]["newValue"] );
	}

	function reload(){
		let getter = browser.storage.sync.get({
			"ol": [],
			"bf": false
		});

		return getter.then(resetVer);
	}

	function resetVer( res ){
		resetOptionList( res["ol"] );
		resetBoxFlag( res["bf"] );
	}

	function resetBoxFlag(res){
		boxFlag = res;
	}

	function resetOptionList(res){
		optionList = [];
		for( let data of res ){
			if ( data["c"] ) optionList.push(data);
		}
	}

	function retrieveLink(select){
		if ( optionList.length <= 0 ) return false;
		let html = document.createElement("html");
		let head = document.createElement("head");
		html.appendChild(head);
		let style = document.createElement("style");
		style.innerHTML = STYLE;
		head.appendChild(style);
		let body = document.createElement("body");
		html.appendChild(body);
		let div = document.createElement("div");
		div.style.height = ( LINK_NODE_HEIGHT - SCROLL_BAR_WIDTH ) +"px";
		body.appendChild(div);
		for(let item of optionList){
			if ( !item["c"]) continue;
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(select) );
			let a = document.createElement("a");
			a.setAttribute( "href", url );
			a.setAttribute( "target", "_blank" );
			a.innerText = item["l"];
			div.appendChild(a);
			let br = document.createElement("br");
			div.appendChild(br);
		}
		linkNode.srcdoc = html.outerHTML;
		return true;
	}
})();
