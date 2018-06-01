(()=>{
	const LINK_NODE_DEFAULT_HEIGHT = 100;
	const LINK_NODE_DEFAULT_WIDTH = 200;
	const LINK_NODE_MIN_HEIGHT = 50;
	const LINK_NODE_MIN_WIDTH = 50;
	const LINK_NODE_PADDING = 3;
	const SPACE = 5;
	const SCROLL_BAR_WIDTH = 17;
	let px;
	let py;
	let cx;
	let cy;
	let linkListNode;
	let linkListNodeTop = 0;
	let linkListNodeLeft = 0;
	let linkListNodeHeight = LINK_NODE_DEFAULT_HEIGHT;
	let linkListNodeWidth = LINK_NODE_DEFAULT_WIDTH;
	let optionList = [];
	let linkListFlag = false;
	let isLinkListShown = false;
	let selectStartFlag = false;
	let selectedText = "";
	let resizeWatcherFlag = false;

	let promise = init();

	function init(){
		linkListNode = document.createElement("div");
		linkListNode.style.all = "initial";
		linkListNode.style.margin = "0";
		linkListNode.style.padding = LINK_NODE_PADDING + "px";
		linkListNode.style.height = linkListNodeHeight + "px";
		linkListNode.style.width = linkListNodeWidth + "px";
		linkListNode.style.display = "none";
		linkListNode.style.position = "absolute";
		linkListNode.style["z-index"] = "2147483646";
		linkListNode.style["background-color"] = "white";
		linkListNode.style["box-shadow"] = "rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px";
		linkListNode.style["overflow"] = "auto";
		linkListNode.style["resize"] = "both";
		document.querySelector("body").appendChild( linkListNode );
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
		if( selectedText.length <= 0 && !isLinkListNodeUnderMouse(py,px) ){
			closeLinkList();
		}
	}

	function mouseupBehavior(e){
		if ( resizeWatcherFlag ) {
			saveLinkListSize();
		}
		if( selectedText.length <= 0 && !isLinkListNodeUnderMouse(py,px) ){
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
		updatePoints(e);
		if ( isLinkListShown ) resizeWatcher();
	}

	function isLinkListNodeUnderMouse(yy,xx){
		/*
		console.log("isLinkListNodeUnderMouse");
		console.log(e.pageY+":"+e.pageX);
		console.log(linkListNodeTop+":"+linkListNodeLeft);
		console.log(linkListNode.clientHeight+":"+linkListNode.clientWidth);
		*/
		if( linkListNodeTop <= yy && yy < ( linkListNodeTop + linkListNode.clientHeight )
		&& linkListNodeLeft <= xx && xx < ( linkListNodeLeft + linkListNode.clientWidth ) ){
			console.log("hit");
			return true;
		}
		return false;
	}

	function updatePoints(e){
		py = e.pageY;
		px = e.pageX;
		cy = e.clientY;
		cx = e.clientX;
	}

	function resizeWatcher(){
		let height = linkListNode.clientHeight - ( 2 * LINK_NODE_PADDING );
		let width = linkListNode.clientWidth - ( 2 * LINK_NODE_PADDING );
		if ( height < LINK_NODE_MIN_HEIGHT ) height = LINK_NODE_MIN_HEIGHT;
		if ( width < LINK_NODE_MIN_WIDTH ) width = LINK_NODE_MIN_WIDTH;
		if ( linkListNodeHeight != height  ){
			resizeWatcherFlag = true;
			linkListNodeHeight = height;
		}
		if ( linkListNodeWidth != width ){
			resizeWatcherFlag = true;
			linkListNodeWidth = width;
		}
	}

	function saveLinkListSize(){
		resizeWatcherFlag = false;
		let res = browser.runtime.sendMessage({
			"method": "saveLinkListSize",
			"data": {
				"lh": linkListNodeHeight,
				"lw": linkListNodeWidth
			}
		});
		res.catch((e)=>{console.log(e)});
	}

	function closeLinkList(){
		linkListNode.style.display = "none";
		isLinkListShown = false;
	}

	function makeLinkList(){
		while(linkListNode.firstChild) linkListNode.removeChild(linkListNode.firstChild);
		for(let item of optionList){
			if ( !item["c"] ) continue;
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(selectedText) );
			let a = document.createElement("a");
			a.classList.add("lessLaborGoToDictionary-anchor");
			a.setAttribute( "href", url );
			a.setAttribute( "target", "_blank" );
			a.innerText = item["l"];
			linkListNode.appendChild(a);
			let br = document.createElement("br");
			br.style.all = "initial";
			linkListNode.appendChild(br);
		}
	}

	function showLinkList(){
		linkListNode.style.display = "block"; /* if none, clientHeight and clientWidth return undefined. */
		linkListNode.style.height = linkListNodeHeight + "px";
		linkListNode.style.width = linkListNodeWidth + "px";
		let yy = window.innerHeight - cy - linkListNode.clientHeight - SCROLL_BAR_WIDTH;
		if ( 0 < yy || window.innerHeight < linkListNode.clientHeight ) yy = 0;
		let xx = window.innerWidth - cx - linkListNode.clientWidth - SCROLL_BAR_WIDTH;
		if ( 0 < xx || window.innerWidth < linkListNode.clientWidth ) xx = 0;
		linkListNodeTop = py + yy + SPACE;
		linkListNodeLeft = px + xx + SPACE;
		linkListNode.style.top = linkListNodeTop+"px";
		linkListNode.style.left = linkListNodeLeft+"px";
		isLinkListShown = true;
	}

	function onStorageChanged(change, area){
		if( change["lh"] || change["lw"] ){
			setLinkListSize( change["lh"]["newValue"], change["lw"]["newValue"] );
			return ;
		}
		closeLinkList();
		if( change["ol"] ) setOptionList( change["ol"]["newValue"] );
		if( change["bf"] ) setLinkListFlag( change["bf"]["newValue"] );
		resetLinkListEvents();
	}

	function setLinkListSize( height=LINK_NODE_DEFAULT_HEIGHT, width=LINK_NODE_DEFAULT_WIDTH ){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
	}

	function reload(){
		let getter = browser.storage.sync.get({
			"ol": [],
			"bf": false,
			"lh": LINK_NODE_DEFAULT_HEIGHT,
			"lw": LINK_NODE_DEFAULT_WIDTH
		});

		return getter.then(setVer);
	}

	function setVer( res ){
		setLinkListSize( res["lh"], res["lw"] );
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
