(()=>{
	const LINK_NODE_DEFAULT_HEIGHT = 100;
	const LINK_NODE_DEFAULT_WIDTH = 200;
	const LINK_NODE_MIN_HEIGHT = 50;
	const LINK_NODE_MIN_WIDTH = 50;
	const LINK_NODE_PADDING = 3;
	const SPACE = 5;
	const SCROLL_BAR_WIDTH = 17;
	const ANCHOR_DEFAULT_SIZE = 0.8;
	const ANCHOR_MAX_SIZE = 2;
	const ANCHOR_RESIO = 0.1;
	const STYLE = "\n\
.lessLaborGoToDictionary-common { \n\
	all: initial; \n\
	font-family: sans-serif; \n\
	user-select: none; \n\
	-moz-user-select: none; \n\
} \n\
div.lessLaborGoToDictionary-viewer { \n\
	display: none; \n\
	position: absolute; \n\
	z-index: 2147483646; \n\
	background-color: white; \n\
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px; \n\
	overflow: scroll; \n\
	resize: both; \n\
} \n\
a.lessLaborGoToDictionary-anchor { \n\
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
} \n\
nav.lessLaborGoToDictionary-menu { \n\
	display: block; \n\
	height: 22px; \n\
	width: 100%; \n\
	line-height: 0; \n\
} \n\
img.lessLaborGoToDictionary-zoomDown, img.lessLaborGoToDictionary-zoomUp { \n\
	height: 16px; \n\
	width: 16px; \n\
	cursor: pointer; \n\
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px; \n\
	margin-right: 4px; \n\
} \n\
";
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
	let anchorSize = ANCHOR_DEFAULT_SIZE;
	let menuNode;

	let promise = init();
	promise.catch(onError);

	function init(){
		let style = document.createElement("style");
		style.innerText = STYLE;
		document.querySelector("head").appendChild(style);
		linkListNode = document.createElement("div");
		linkListNode.classList.add("lessLaborGoToDictionary-common");
		linkListNode.classList.add("lessLaborGoToDictionary-viewer");
		linkListNode.style.padding = LINK_NODE_PADDING + "px";
		linkListNode.style.height = linkListNodeHeight + "px";
		linkListNode.style.width = linkListNodeWidth + "px";
		document.querySelector("body").appendChild( linkListNode );
		browser.storage.onChanged.addListener( onStorageChanged );
		menuNode = document.createElement("nav");
		menuNode.classList.add("lessLaborGoToDictionary-common");
		menuNode.classList.add("lessLaborGoToDictionary-menu");
		linkListNode.appendChild(menuNode);
		let zoomDownNode = document.createElement("img");
		zoomDownNode.src = browser.extension.getURL("image/minus.svg");
		zoomDownNode.classList.add("lessLaborGoToDictionary-common");
		zoomDownNode.classList.add("lessLaborGoToDictionary-zoomDown");
		zoomDownNode.title = browser.i18n.getMessage("htmlZoomDown");
		menuNode.appendChild(zoomDownNode);
		let zoomUpNode = document.createElement("img");
		zoomUpNode.src = browser.extension.getURL("image/plus.svg");
		zoomUpNode.classList.add("lessLaborGoToDictionary-common");
		zoomUpNode.classList.add("lessLaborGoToDictionary-zoomUp");
		zoomUpNode.title = browser.i18n.getMessage("htmlZoomUp");
		menuNode.appendChild(zoomUpNode);
		return reload();
	}

	function addLinkListEvents(){
		document.addEventListener("selectstart", selectStartBehavior);
		document.addEventListener("selectionchange", selectionChangeBehavior);
		document.addEventListener("mouseup", mouseupBehavior);
		window.addEventListener("resize", resizeBehavior);
		document.addEventListener("keydown", keydownBehavior);
		document.addEventListener("mousemove", mousemoveBehavior);
		menuNode.addEventListener("click", menuClickBihavior);
	}

	function removeLinkListEvents(){
		document.removeEventListener("selectstart", selectStartBehavior);
		document.removeEventListener("selectionchange", selectionChangeBehavior);
		document.removeEventListener("mouseup", mouseupBehavior);
		window.removeEventListener("resize", resizeBehavior);
		document.removeEventListener("keydown", keydownBehavior);
		document.removeEventListener("mousemove", mousemoveBehavior);
		menuNode.removeEventListener("click", menuClickBihavior);
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
		let promise;
		if ( resizeWatcherFlag ) {
			resizeWatcherFlag = false;
			promise = saveLinkListSize();
			promise.catch(onError);
		}
		if( selectedText.length <= 0 && !isLinkListNodeUnderMouse(py,px) ){
			closeLinkList();
			return ;
		}
		if( selectStartFlag ){
			selectStartFlag = false;
			makeLinkList();
			showLinkList();
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
		if( linkListNodeTop <= yy && yy < ( linkListNodeTop + linkListNode.clientHeight )
		&& linkListNodeLeft <= xx && xx < ( linkListNodeLeft + linkListNode.clientWidth ) ){
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
		let res = browser.runtime.sendMessage({
			"method": "saveLinkListSize",
			"data": {
				"lh": linkListNodeHeight,
				"lw": linkListNodeWidth
			}
		});
		return res;
	}

	function closeLinkList(){
		linkListNode.style.display = "none";
		isLinkListShown = false;
	}

	function makeLinkList(){
		let list = linkListNode.querySelectorAll("a.lessLaborGoToDictionary-anchor,br.lessLaborGoToDictionary-braek");
		for(let node of list){
			linkListNode.removeChild(node);
		}
		for(let item of optionList){
			if ( !item["c"] ) continue;
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(selectedText) );
			let a = document.createElement("a");
			a.classList.add("lessLaborGoToDictionary-common");
			a.classList.add("lessLaborGoToDictionary-anchor");
			a.style["font-size"] = anchorSize + "em";
			a.setAttribute( "href", url );
			a.setAttribute( "target", "_blank" );
			a.innerText = item["l"];
			linkListNode.appendChild(a);
			let br = document.createElement("br");
			br.classList.add("lessLaborGoToDictionary-common");
			br.classList.add("lessLaborGoToDictionary-braek");
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
		if( change["as"] ){
			setAnchorSize( change["as"]["newValue"] );
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
			"lw": LINK_NODE_DEFAULT_WIDTH,
			"as": ANCHOR_DEFAULT_SIZE
		});
		return getter.then(setVer);
	}

	function setVer( res ){
		setAnchorSize( res["as"] );
		setLinkListSize( res["lh"], res["lw"] );
		setOptionList( res["ol"] );
		setLinkListFlag( res["bf"] );
		resetLinkListEvents();
	}

	function setAnchorSize(res){
		anchorSize = res;
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
			/* checked == true */
			if ( data["c"] ) optionList.push(data);
		}
	}

	function hasLinkList(){
		if( optionList.length > 0 ) return true;
		return false;
	}

	function menuClickBihavior(e){
		let promise;
		if(e.target.classList.contains("lessLaborGoToDictionary-zoomUp")){
			if( zoomLinkList(1) ){
				promise = saveAnchorSize();
				promise.catch(onError);
			}
		}
		else if(e.target.classList.contains("lessLaborGoToDictionary-zoomDown")){
			if( zoomLinkList(-1) ){
				promise = saveAnchorSize();
				promise.catch(onError);
			}
		}
	}

	function zoomLinkList(direction=1){
		if ( direction < 0 && anchorSize <= ANCHOR_RESIO ) return false;
		if ( 0 < direction && ANCHOR_MAX_SIZE <= anchorSize ) return false;
		anchorSize += direction * ANCHOR_RESIO;
		anchorSize += 0.01;
		anchorSize *= 10 ;
		anchorSize = Math.floor(anchorSize);
		anchorSize /= 10 ;
		let list = linkListNode.querySelectorAll("a.lessLaborGoToDictionary-anchor");
		for(let node of list)　node.style["font-size"] = anchorSize + "em";
		return true;
	}

	function saveAnchorSize(){
		let res = browser.runtime.sendMessage({
			"method": "saveAnchorSize",
			"data": {
				"as": anchorSize
			}
		});
		return res;
	}

	function onError(e){
		console.error(e);
	}
})();
