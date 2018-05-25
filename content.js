(()=>{
	let px;
	let py;
	let cx;
	let cy;
	let linkNode;
	let dist = 5;
	let linkNodeHeight = 100;
	let linkNodeWidth = 200;
	let scrollbarWidth = 17;
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
		linkNode.style["max-height"] = linkNodeHeight + "px";
		linkNode.style.width = linkNodeWidth + "px";
		document.querySelector("body").appendChild(linkNode);

		document.onmouseup = (e)=>{
			if( e.button == "0" ) {
				linkBehavior(e);
			}
		}

		window.onresize = (e)=>{
			closeLink();
		}

		function linkBehavior(){
			let selection = window.getSelection();
			let select = selection.toString();
			if( boxFlag && select && select.length > 0 ) {
				if( retrieveLink(select) ) {
					let yy = window.innerHeight - scrollbarWidth - ( cy + linkNodeHeight );
					if ( 0 < yy || window.innerHeight < linkNodeHeight ) yy = 0;
					let xx = window.innerWidth - scrollbarWidth - ( cx + linkNodeWidth );
					if ( 0 < xx || window.innerWidth < linkNodeWidth ) xx = 0;
					linkNode.style.top = ( py + yy + dist )+"px";
					linkNode.style.left = ( px + xx + dist ) +"px";
					linkNode.style.display = "block";
				}
			}
			else {
				closeLink();
			}
		}


		document.addEventListener('mousemove', function(e) {
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
		style.innerHTML = "\n\
* { \n\
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
}\n\
";
		head.appendChild(style);
		let body = document.createElement("body");
		html.appendChild(body);
		let div = document.createElement("div");
		div.style.height = (linkNodeHeight-20)+"px";
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
