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
	white-space: nowrap; \n\
} \n\
img.lessLaborGoToDictionary-zoomDown, img.lessLaborGoToDictionary-zoomUp { \n\
	height: 16px; \n\
	width: 16px; \n\
	cursor: pointer; \n\
	box-shadow: rgba(0, 0, 0, 0.32) 0px 2px 2px 0px, rgba(0, 0, 0, 0.16) 0px 0px 0px 1px; \n\
	margin-right: 4px; \n\
} \n\
";
	let linkListNode;
	let linkListNodeTop = 0;
	let linkListNodeLeft = 0;
	let linkListNodeHeight = LINK_NODE_DEFAULT_HEIGHT;
	let linkListNodeWidth = LINK_NODE_DEFAULT_WIDTH;
	let optionList = [];
	let linkListFlag = false;
	let shiftKeyFlag = false;
	let ctrlKeyFlag = false;
	let resizeWatcherFlag = false;
	let anchorSize = ANCHOR_DEFAULT_SIZE;
	let menuNode;
	let mousedownFlag = false;
	let selectionChangedFlag = false;

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

	function addCommonLinkListEvents(){
		window.addEventListener("resize", resizeBehavior);
		menuNode.addEventListener("click", menuClickBihavior);
		document.addEventListener("keydown", keydownBehavior);
		document.addEventListener("mousemove", mousemoveBehavior);
		document.addEventListener("mouseup", mouseupCommonBehavior);
	}

	function addAutoLinkListEvents(){
		document.addEventListener("selectionchange", selectionChangeAutoBehavior);
		document.removeEventListener("selectionchange", manualSelectionChangeBehavior);
		document.addEventListener("mouseup", mouseupAutoBehavior);
		document.addEventListener("mousedown", mousedownAutoBehavior);
	}

	function removeAutoLinkListEvents(){
		document.removeEventListener("selectionchange", selectionChangeAutoBehavior);
		document.addEventListener("selectionchange", manualSelectionChangeBehavior);
		document.removeEventListener("mouseup", mouseupAutoBehavior);
		document.removeEventListener("mousedown", mousedownAutoBehavior);
	}

	function manualSelectionChangeBehavior(e){
		closeLinkList();
	}

	function selectionChangeAutoBehavior(e){
		selectionChangedFlag = true;
		if(mousedownFlag) return;
		let selection = window.getSelection();
		if( selection.isCollapsed ){
			closeLinkList();
		}
		else {
			makeLinkList(selection.toString());
			let lastRange = selection.getRangeAt(selection.rangeCount-1);
			let rectList = lastRange.getClientRects();
			let rect = rectList[rectList.length-1];
			showLinkList(rect.bottom+window.scrollY, rect.right+window.scrollX, rect.bottom, rect.right);
		}
	}

	function mousedownAutoBehavior(e){
		mousedownFlag = true;
		if( e.button != 0 ) return;
		if( !isLinkListNodeUnderMouse(e.pageY, e.pageX) ){
			closeLinkList();
		}
	}

	function mouseupCommonBehavior(e){
		let promise;
		if ( resizeWatcherFlag ) {
			resizeWatcherFlag = false;
			promise = saveLinkListSize();
			promise.catch(onError);
		}
	}

	function mouseupAutoBehavior(e){
		mousedownFlag = false;
		if( e.button != 0 ) return;
		if( selectionChangedFlag && !isLinkListNodeUnderMouse(e.pageY,e.pageX) ){
			let selectioin = window.getSelection();
			if( !selectioin.isCollapsed ){
				selectionChangedFlag = false;
				makeLinkList(selectioin.toString());
				showLinkList(e.pageY, e.pageX, e.clientY, e.clientX);
			}
		}
	}

	function resizeBehavior(e){
		closeLinkList();
	}

	function keydownBehavior(e){
		if( e.key == "Escape" || e.key == "Esc"){
			closeLinkList();
		}
		else if((shiftKeyFlag && e.key == "Shift")||(ctrlKeyFlag && e.key == "Control")){
			switchLinkList();
		}
	}

	function switchLinkList(){
		if(isLinkListShown()){
			closeLinkList();
		}
		else {
			let selection = window.getSelection();
			if( !selection.isCollapsed ){
				let lastRange = selection.getRangeAt(selection.rangeCount-1);
				let rectList = lastRange.getClientRects();
				let rect = rectList[rectList.length-1];
				makeLinkList(selection.toString());
				showLinkList(rect.bottom+window.scrollY, rect.right+window.scrollX, rect.bottom, rect.right);
			}
		}
	}

	function mousemoveBehavior(e){
		if ( isLinkListShown() ) resizeWatcher();
	}

	function isLinkListNodeUnderMouse(yy,xx){
		if( linkListNodeTop <= yy && yy < ( linkListNodeTop + linkListNode.offsetHeight )
		&& linkListNodeLeft <= xx && xx < ( linkListNodeLeft + linkListNode.offsetWidth ) ){
			return true;
		}
		return false;
	}

	function resizeWatcher(){
		let height = linkListNode.offsetHeight - ( 2 * LINK_NODE_PADDING );
		if ( height < LINK_NODE_MIN_HEIGHT ) height = LINK_NODE_MIN_HEIGHT;
		let width = linkListNode.offsetWidth - ( 2 * LINK_NODE_PADDING );
		if ( width < LINK_NODE_MIN_WIDTH ) width = LINK_NODE_MIN_WIDTH;
		if ( linkListNodeHeight != height || linkListNodeWidth != width ){
			resizeWatcherFlag = true;
			linkListNodeHeight = height;
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
	}

	function makeLinkList(text){
		let list = linkListNode.querySelectorAll("a.lessLaborGoToDictionary-anchor,br.lessLaborGoToDictionary-braek");
		for(let node of list){
			linkListNode.removeChild(node);
		}
		for(let item of optionList){
			if ( !item["c"] ) continue;
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(text) );
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

	function showLinkList(pageY, pageX, clientY, clientX){
		linkListNode.style.display = "block"; /* if none, clientHeight and clientWidth return undefined. */
		linkListNode.style.height = linkListNodeHeight + "px";
		linkListNode.style.width = linkListNodeWidth + "px";
		let yy = window.innerHeight - clientY - linkListNode.offsetHeight - SCROLL_BAR_WIDTH;
		if ( 0 < yy || window.innerHeight < linkListNode.offsetHeight ) yy = 0;
		let xx = window.innerWidth - clientX - linkListNode.offsetWidth - SCROLL_BAR_WIDTH;
		if ( 0 < xx || window.innerWidth < linkListNode.offsetWidth ) xx = 0;
		linkListNodeTop = pageY + yy + SPACE;
		linkListNodeLeft = pageX + xx + SPACE;
		linkListNode.style.top = linkListNodeTop+"px";
		linkListNode.style.left = linkListNodeLeft+"px";
		linkListNode.scrollTop = 0;
		linkListNode.scrollLeft = 0;
	}

	function isLinkListShown(){
		return linkListNode.style.display == "block";
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
		if( change["ck"] ){
			setCtrlKeyFlag( change["ck"]["newValue"] );
			return ;
		}
		if( change["sk"] ){
			setShiftKeyFlag( change["sk"]["newValue"] );
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
			"bf": true,
			"sk": false,
			"ck": false,
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
		setCtrlKeyFlag( res["ck"] );
		setShiftKeyFlag( res["sk"] );
		resetLinkListEvents();
	}

	function setAnchorSize(res){
		anchorSize = res;
	}

	function setLinkListFlag(res){
		linkListFlag = res;
	}

	function setShiftKeyFlag(res){
		shiftKeyFlag = res;
	}

	function setCtrlKeyFlag(res){
		ctrlKeyFlag = res;
	}

	function resetLinkListEvents(){
		removeAutoLinkListEvents();
		if( linkListFlag && hasLinkList() ) addAutoLinkListEvents();
		addCommonLinkListEvents();
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
