(()=>{
	let px;
	let py;
	let cx;
	let cy;
	let linkNode;
	let linkNodeHeight = 100;
	let linkNodeWidth = 200;
	let scrollbarWidth = 17;
	let select;
	let optionList = [];
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
			linkBehavior();
		}

		window.onresize = (e)=>{
			closeLink();
		}

		function linkBehavior(e){
			let select = window.getSelection().toString();
			if( select && select.length > 0 ) {
				if( retrieveLink() ) {
					let yy = window.innerHeight - scrollbarWidth - ( cy + linkNodeHeight );
					if ( 0 < yy || window.innerHeight < linkNodeHeight ) yy = 0;
					let xx = window.innerWidth - scrollbarWidth - ( cx + linkNodeWidth );
					if ( 0 < xx || window.innerWidth < linkNodeWidth ) xx = 0;
					linkNode.style.top = ( py + yy )+"px";
					linkNode.style.left = ( px + xx ) +"px";
					linkNode.style.display = "block";
				}
			}
			else {
				closeLink();
			}
		}

		function closeLink(){
			select = null;
			linkNode.style.display = "none";
		}

		document.addEventListener('mousemove', function(e) {
			py = e.pageY;
			px = e.pageX;
			cy = e.clientY;
			cx = e.clientX;
		})

		browser.storage.onChanged.addListener(reload);

		return reload();
	}

	function reload(){
		let getter = browser.storage.local.get({
			"optionList": []
		});

		function onGot(res){
			optionList = [];
			for( let data of res["optionList"] ){
				if ( data["checked"] ) optionList.push(data);
			}
		}

		return getter.then(onGot);
	}

	function retrieveLink(){
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
	font-size: 0.8em;\n\
	font-family: sans-serif;\n\
	margin-top: 1em;\n\
}\n\
div {\n\
	height: 80px;\n\
	background-color: white;\n\
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px;\n\
	margin: 2px;\n\
	padding: 0.2em;\n\
	overflow: scroll;\n\
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
		body.appendChild(div);
		div.innerText = browser.i18n.getMessage("extensionName");
		div.innerHTML += "<br>";
		for(let item of optionList){
			if ( !item["checked"]) continue;
			let url = item["url"];
			url = url.replace( "$1", encodeURIComponent(select) );
			let a = document.createElement("a");
			a.setAttribute( "href", url );
			a.setAttribute( "target", "_blank" );
			a.innerText = item["label"];
			div.appendChild(a);
			let br = document.createElement("br");
			div.appendChild(br);
		}
		linkNode.srcdoc = html.outerHTML;
		return true;
	}
})();
