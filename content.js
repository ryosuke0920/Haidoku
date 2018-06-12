(()=>{
	const LINK_NODE_DEFAULT_HEIGHT = 100;
	const LINK_NODE_DEFAULT_WIDTH = 200;
	const LINK_NODE_MIN_HEIGHT = 50;
	const LINK_NODE_MIN_WIDTH = 50;
	const LINK_NODE_PADDING = 3;
	const SPACE = 5;
	const SCROLL_BAR_WIDTH = 22;
	const ANCHOR_DEFAULT_SIZE = 0.8;
	const ANCHOR_MAX_SIZE = 2;
	const ANCHOR_MIN_SIZE = 0.6;
	const ANCHOR_RESIO = 0.1;
	const SILENT_ERROR_PREFIX = "[silent]";
	const SILENT_ERROR_REGEX = new RegExp( /^\[silent\]/ );
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

	starter()
		.then(init)
		.then(
			()=>{ starter().then(reload).then(addCommonLinkListEvents); },
			silentError
		).catch(unexpectedError);

	function starter(){
		return Promise.resolve();
	}

	function init(){
		let body = document.querySelector("body");
		if( !body ){
			/* break promise chain, but not need notification. */
			throw( new Error( SILENT_ERROR_PREFIX + " not found body") );
		}
		linkListNode = document.createElement("div");
		linkListNode.classList.add("lessLaborGoToDictionary-viewer");
		linkListNode.classList.add("lessLaborGoToDictionary-hide");
		linkListNode.style.padding = LINK_NODE_PADDING + "px";
		linkListNode.style.height = linkListNodeHeight + "px";
		linkListNode.style.width = linkListNodeWidth + "px";
		body.appendChild( linkListNode );
		menuNode = document.createElement("nav");
		menuNode.classList.add("lessLaborGoToDictionary-menu");
		linkListNode.appendChild(menuNode);
		let zoomDownNode = document.createElement("img");
		zoomDownNode.src = ponyfill.extension.getURL("image/minus.svg");
		zoomDownNode.classList.add("lessLaborGoToDictionary-zoomDown");
		zoomDownNode.title = ponyfill.i18n.getMessage("htmlZoomDown");
		menuNode.appendChild(zoomDownNode);
		let zoomUpNode = document.createElement("img");
		zoomUpNode.src = ponyfill.extension.getURL("image/plus.svg");
		zoomUpNode.classList.add("lessLaborGoToDictionary-zoomUp");
		zoomUpNode.title = ponyfill.i18n.getMessage("htmlZoomUp");
		menuNode.appendChild(zoomUpNode);
	}

	function addCommonLinkListEvents(){
		ponyfill.storage.onChanged.addListener( onStorageChanged );
		window.addEventListener("resize", resizeBehavior);
		menuNode.addEventListener("click", menuClickBihavior);
		document.addEventListener("keydown", keydownBehavior);
		document.addEventListener("mousemove", mousemoveBehavior);
		document.addEventListener("mouseup", mouseupCommonBehavior);
		document.addEventListener("mousedown", mousedownCommonBehavior);
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

	function mousedownCommonBehavior(e){
		mousedownFlag = true;
	}

	function mousedownAutoBehavior(e){
		if( e.button != 0 ) return;
		if( !isLinkListNodeUnderMouse(e.pageY, e.pageX) ){
			closeLinkList();
		}
	}

	function mouseupCommonBehavior(e){
		mousedownFlag = false;
		let promise;
		if ( resizeWatcherFlag ) {
			resizeWatcherFlag = false;
			promise = saveLinkListSize();
			promise.catch(onSaveError);
		}
	}

	function mouseupAutoBehavior(e){
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
		if ( isLinkListShown() && mousedownFlag ) resizeWatcher();
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
		let res = ponyfill.runtime.sendMessage({
			"method": "saveLinkListSize",
			"data": {
				"lh": linkListNodeHeight,
				"lw": linkListNodeWidth
			}
		});
		return res;
	}

	function closeLinkList(){
		linkListNode.classList.add("lessLaborGoToDictionary-hide");
	}

	function makeLinkList(text){
		let list = linkListNode.querySelectorAll("a.lessLaborGoToDictionary-anchor,br.lessLaborGoToDictionary-braek");
		for(let i=0; i<list.lenght; i++){
			let node = list[i];
			linkListNode.removeChild(node);
		}
		for(let i=0; i<optionList.lenght; i++){
			let item = optionList[i];
			if ( !item["c"] ) continue;
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(text) );
			let a = document.createElement("a");
			a.classList.add("lessLaborGoToDictionary-anchor");
			a.style["font-size"] = anchorSize + "em";
			a.setAttribute( "href", url );
			a.setAttribute( "rel", "noreferrer" );
			a.setAttribute( "target", "_blank" );
			a.setAttribute( "rel", "noreferrer" );
			a.innerText = item["l"];
			linkListNode.appendChild(a);
			let br = document.createElement("br");
			br.classList.add("lessLaborGoToDictionary-braek");
			linkListNode.appendChild(br);
		}
	}

	function showLinkList(pageY, pageX, clientY, clientX){
		/* when display equals none, offsetHeight and offsetWidth return undefined. */
		linkListNode.classList.remove("lessLaborGoToDictionary-hide");
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
		return !linkListNode.classList.contains("lessLaborGoToDictionary-hide");
	}

	function onStorageChanged(change, area){
		if( change["lh"] && change["lw"] ){
			setLinkListSize( change["lh"]["newValue"], change["lw"]["newValue"] );
		}
		else if( change["as"] ){
			setAnchorSize( change["as"]["newValue"] );
		}
		else if( change["ck"] ){
			setCtrlKeyFlag( change["ck"]["newValue"] );
		}
		else if( change["sk"] ){
			setShiftKeyFlag( change["sk"]["newValue"] );
		}
		else if( change["ol"] ) {
			closeLinkList();
			setOptionList( change["ol"]["newValue"] );
			resetLinkListEvents();
		}
		else if( change["bf"] ){
			closeLinkList();
			setLinkListFlag( change["bf"]["newValue"] );
			resetLinkListEvents();
		}
	}

	function setLinkListSize( height=LINK_NODE_DEFAULT_HEIGHT, width=LINK_NODE_DEFAULT_WIDTH ){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
	}

	function reload(){
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"bf": true,
			"sk": false,
			"ck": false,
			"lh": LINK_NODE_DEFAULT_HEIGHT,
			"lw": LINK_NODE_DEFAULT_WIDTH,
			"as": ANCHOR_DEFAULT_SIZE
		});
		return getter.then(setVer, onReadError);
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
	}

	function setOptionList(res){
		optionList = [];
		for(let i=0; i<res.length; i++){
			let data = res[i];
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
				promise.catch(onSaveError);
			}
		}
		else if(e.target.classList.contains("lessLaborGoToDictionary-zoomDown")){
			if( zoomLinkList(-1) ){
				promise = saveAnchorSize();
				promise.catch(onSaveError);
			}
		}
	}

	function zoomLinkList(direction=1){
		if ( direction < 0 && anchorSize <= ANCHOR_MIN_SIZE ) return false;
		if ( 0 < direction && ANCHOR_MAX_SIZE <= anchorSize ) return false;
		anchorSize += direction * ANCHOR_RESIO;
		anchorSize += 0.01;
		anchorSize *= 10 ;
		anchorSize = Math.floor(anchorSize);
		anchorSize /= 10 ;
		let list = linkListNode.querySelectorAll("a.lessLaborGoToDictionary-anchor");
		for(let i=0; i<list.lenght; i++){
			let node = list[i];
			node.style["font-size"] = anchorSize + "em";
		}
		return true;
	}

	function saveAnchorSize(){
		let res = ponyfill.runtime.sendMessage({
			"method": "saveAnchorSize",
			"data": {
				"as": anchorSize
			}
		});
		console.log(res);
		return res;
	}

	function onSaveError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationSaveOptionError", [e.message])
		});
		return res;
	}

	function onReadError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationReadOptionError", [e.message])
		});
		return res;
	}

	function unexpectedError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationUnexpectedError", [e.message])
		});
		return res;
	}

	function silentError(e){
		if( e.message.match( SILENT_ERROR_REGEX ) ){
			console.error(e);
		}
		else {
			throw(e);
		}
	}
})();
