(()=>{
	const LINK_NODE_MIN_HEIGHT = 100;
	const LINK_NODE_MIN_WIDTH = 200;
	const LINK_NODE_PADDING = 3;
	const SPACE = 5;
	const SCROLL_BAR_WIDTH = 17;
	let px;
	let py;
	let cx;
	let cy;
	let linkNode;
	let linkNodeHeight = LINK_NODE_MIN_HEIGHT;
	let linkNodeWidth = LINK_NODE_MIN_WIDTH;
	let optionList = [];
	let linkListFlag = false;
	let selectStartFlag = false;
	let resizeFlag = false;
	let selectedText = "";

	let promise = init();

	function init(){
		linkNode = document.createElement("div");
		linkNode.style.all = "initial";
		linkNode.style.margin = "0";
		linkNode.style.padding = LINK_NODE_PADDING + "px";
		linkNode.style.display = "none";
		linkNode.style.position = "absolute";
		linkNode.style.height = linkNodeHeight + "px";
		linkNode.style.width = linkNodeWidth + "px";
		linkNode.style["z-index"] = "2147483646";
		linkNode.style["background-color"] = "white";
		linkNode.style["box-shadow"] = "rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px";
		linkNode.style["overflow"] = "auto";
		linkNode.style["resize"] = "both";
		document.querySelector("body").appendChild( linkNode );
		browser.storage.onChanged.addListener( onStorageChanged );
		let style = document.createElement("style");
		style.innerText = "\n\
a.lessLaborGoToDictionary-anchor { \n\
	all: initial; \n\
	font-family: sans-serif; \n\
	font-size: 13px; \n\
	color: rgb(0, 0, 238); \n\
	cursor: pointer; \n\
	white-space: nowrap; \n\
} \n\
a.lessLaborGoToDictionary-anchor:visited { \n\
	color: #551a8b; \n\
} \n\
a.lessLaborGoToDictionary-anchor:hover { \n\
	text-decoration: underline; \n\
} \n\
a.lessLaborGoToDictionary-anchor:active { \n\
	color: #ee0000; \n\
}";
		document.querySelector("head").appendChild(style);

		return reload();
	}

	function addLinkListEvents(){
		document.addEventListener("selectstart", selectStartBehavior);
		document.addEventListener("selectionchange", selectionChangeBehavior);
		document.addEventListener("mouseup", mouseupBehavior);
		window.addEventListener("resize", resizeBehavior);
		document.addEventListener("keydown", keydownBehavior);
		document.addEventListener("mousemove", mousemoveBehavior);
	}

	function removeLinkListEvents(){
		document.removeEventListener("selectstart", selectStartBehavior);
		document.removeEventListener("selectionchange", selectionChangeBehavior);
		document.removeEventListener("mouseup", mouseupBehavior);
		window.removeEventListener("resize", resizeBehavior);
		document.removeEventListener("keydown", keydownBehavior);
		document.removeEventListener("mousemove", mousemoveBehavior);
	}

	function selectStartBehavior(e) {
		selectStartFlag = true;
	}

	function selectionChangeBehavior(e){
		let selection = window.getSelection();
		selectedText = selection.toString();
	}

	function mouseupBehavior(e){
		if( selectedText.length <= 0 ){
			closeLinkList();
			return ;
		}
		if( selectStartFlag ){
			selectStartFlag = false;
			makeLinkList();
			showLinkList();
			return ;
		}
	}

	function resizeBehavior(e){
		closeLinkList();
	}

	function keydownBehavior(e){
		if( e.key == "Escape" || e.key == "Esc") closeLinkList();
	}

	function mousemoveBehavior(e){
		py = e.pageY;
		px = e.pageX;
		cy = e.clientY;
		cx = e.clientX;
	}

	function closeLinkList(){
		linkNode.style.display = "none";
	}

	function makeLinkList(){
		while(linkNode.firstChild) linkNode.removeChild(linkNode.firstChild);
		for(let item of optionList){
			if ( !item["c"] ) continue;
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(selectedText) );
			let a = document.createElement("a");
			a.classList.add("lessLaborGoToDictionary-anchor");
			a.setAttribute( "href", url );
			a.setAttribute( "target", "_blank" );
			a.innerText = item["l"];
			linkNode.appendChild(a);
			let br = document.createElement("br");
			br.style.all = "initial";
			linkNode.appendChild(br);
		}
	}

	function showLinkList(){
		linkNode.style.display = "block"; /* if none, clientHeight and clientWidth return undefined. */
		let yy = window.innerHeight - cy - linkNode.clientHeight - SCROLL_BAR_WIDTH;
		if ( 0 < yy || window.innerHeight < linkNode.clientHeight ) yy = 0;
		let xx = window.innerWidth - cx - linkNode.clientWidth - SCROLL_BAR_WIDTH;
		if ( 0 < xx || window.innerWidth < linkNode.clientWidth ) xx = 0;
		let linkNodeTop = py + yy + SPACE;
		let linkNodeLeft = px + xx + SPACE;
		linkNode.style.top = linkNodeTop+"px";
		linkNode.style.left = linkNodeLeft+"px";
	}

	function onStorageChanged(change, area){
		closeLinkList();
		if( change["ol"] ) setOptionList( change["ol"]["newValue"] );
		if( change["bf"] ) setLinkListFlag( change["bf"]["newValue"] );
		resetLinkListEvents();
	}

	function reload(){
		let getter = browser.storage.sync.get({
			"ol": [],
			"bf": false
		});

		return getter.then(setVer);
	}

	function setVer( res ){
		setOptionList( res["ol"] );
		setLinkListFlag( res["bf"] );
		resetLinkListEvents();
	}

	function setLinkListFlag(res){
		linkListFlag = res;
	}

	function resetLinkListEvents(){
		removeLinkListEvents();
		if( linkListFlag && hasLinkList() ) addLinkListEvents();
	}

	function setOptionList(res){
		optionList = [];
		for( let data of res ){
			if ( data["c"] ) { /* checked == true */
				optionList.push(data);
			}
		}
	}

	function hasLinkList(){
		if( optionList.length > 0 ) return true;
		return false;
	}
})();
