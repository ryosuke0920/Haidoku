(()=>{
	const LINK_NODE_DEFAULT_HEIGHT = 100;
	const LINK_NODE_DEFAULT_WIDTH = 200;
	const LINK_NODE_SWITCH_HEIGHT = 99;
	const LINK_NODE_SWITCH_WIDTH = 130;
	const LINK_NODE_MIN_HEIGHT = 50;
	const LINK_NODE_MIN_WIDTH = 50;
	const LINK_NODE_PADDING = 3;
	const SPACE = 10;
	const SCROLL_BAR_WIDTH = 22;
	const ANCHOR_DEFAULT_SIZE = 0.8;
	const ANCHOR_MAX_SIZE = 2;
	const ANCHOR_MIN_SIZE = 0.6;
	const ANCHOR_RESIO = 0.1;
	const SILENT_ERROR_PREFIX = "[silent]";
	const SILENT_ERROR_REGEX = new RegExp( /^\[silent\]/ );
	const LINK_LIST_CLOSE_TIME = 500;
	let linkListNode;
	let linkListNodeTop = 0;
	let linkListNodeLeft = 0;
	let linkListNodeHeight = LINK_NODE_DEFAULT_HEIGHT;
	let linkListNodeWidth = LINK_NODE_DEFAULT_WIDTH;
	let linkListScrollTopTmp = 0;
	let linkListScrollleftTmp = 0;
	let linkListAction = LINK_LIST_ACTION_MOUSECLICK;
	let coverNode;
	let optionList = [];
	let linkListFlag = false;
	let shiftKeyFlag = false;
	let ctrlKeyFlag = false;
	let resizeWatcherFlag = false;
	let anchorSize = ANCHOR_DEFAULT_SIZE;
	let menuNode;
	let containerNode;
	let mousedownFlag = false;
	let selectionChangedFlag = false;
	let faviconCache = {};

	Promise.resolve()
		.then(init)
		.then(
			()=>{ return Promise.resolve().then(reload).then(addCommonLinkListEvents); },
			silentError
		).catch(unexpectedError);

	function init(){
		let body = document.querySelector("body");
		if( !body ){
			/* break promise chain, but not need notification. */
			throw( new Error( SILENT_ERROR_PREFIX + " not found body") );
		}
		linkListNode = document.createElement("div");
		linkListNode.setAttribute("id",CSS_PREFIX+"-viewer");
		linkListNode.classList.add(CSS_PREFIX+"-hide");
		linkListNode.style.padding = LINK_NODE_PADDING + "px";
		applyLinkListSize();
		body.appendChild( linkListNode );
		coverNode = document.createElement("div");
		coverNode.setAttribute("id",CSS_PREFIX+"-cover");
		linkListNode.appendChild(coverNode);
		menuNode = document.createElement("nav");
		menuNode.setAttribute("id",CSS_PREFIX+"-menu");
		linkListNode.appendChild(menuNode);
		containerNode = document.createElement("ul");
		containerNode.setAttribute("id",CSS_PREFIX+"-container");
		linkListNode.appendChild(containerNode);
		let resizeNode = document.createElement("img");
		resizeNode.src = ponyfill.extension.getURL("/image/resize.svg");
		resizeNode.setAttribute("id",CSS_PREFIX+"-resize");
		resizeNode.title = ponyfill.i18n.getMessage("htmlResize");
		menuNode.appendChild(resizeNode);
		let zoomDownNode = document.createElement("img");
		zoomDownNode.src = ponyfill.extension.getURL("/image/minus.svg");
		zoomDownNode.setAttribute("id",CSS_PREFIX+"-zoomDown");
		zoomDownNode.title = ponyfill.i18n.getMessage("htmlZoomDown");
		menuNode.appendChild(zoomDownNode);
		let zoomUpNode = document.createElement("img");
		zoomUpNode.src = ponyfill.extension.getURL("/image/plus.svg");
		zoomUpNode.setAttribute("id",CSS_PREFIX+"-zoomUp");
		zoomUpNode.title = ponyfill.i18n.getMessage("htmlZoomUp");
		menuNode.appendChild(zoomUpNode);
		let copyNode = document.createElement("img");
		copyNode.src = ponyfill.extension.getURL("/image/copy.svg");
		copyNode.setAttribute("id",CSS_PREFIX+"-copy");
		copyNode.title = ponyfill.i18n.getMessage("htmlCopy");
		menuNode.appendChild(copyNode);
		let optionNode = document.createElement("img");
		optionNode.src = ponyfill.extension.getURL("/image/option.svg");
		optionNode.setAttribute("id",CSS_PREFIX+"-option");
		optionNode.title = ponyfill.i18n.getMessage("htmloption");
		menuNode.appendChild(optionNode);
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
			showLinkListByClick(rect.bottom+window.scrollY, rect.right+window.scrollX, rect.bottom, rect.right, selection);
		}
	}

	function mousedownCommonBehavior(e){
		if ( e.target != coverNode ) mousedownFlag = true;
	}

	function mousedownAutoBehavior(e){
		if( e.button != 0 ) return;
		if( !isLinkListNodeUnderMouse(e.pageY, e.pageX) ) closeLinkList();
	}

	function mouseupCommonBehavior(e){
		mousedownFlag = false;
		if ( resizeWatcherFlag ) {
			resizeWatcherFlag = false;
			saveLinkListSize().catch(onSaveError);
		}
	}

	function mouseupAutoBehavior(e){
		if( e.button != 0 ) return;
		if( selectionChangedFlag && !isLinkListNodeUnderMouse(e.pageY,e.pageX) ){
			let selectioin = window.getSelection();
			if( !selectioin.isCollapsed ){
				selectionChangedFlag = false;
				makeLinkList(selectioin.toString());
				showLinkListByClick(e.pageY, e.pageX, e.clientY, e.clientX, selectioin);
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
		if(isLinkListShown() && !hasStopper()){
			closeLinkList();
		}
		else if ( hasLinkList() ) {
			let selection = window.getSelection();
			if( !selection.isCollapsed ){
				let lastRange = selection.getRangeAt(selection.rangeCount-1);
				let rectList = lastRange.getClientRects();
				let rect = rectList[rectList.length-1];
				makeLinkList(selection.toString());
				showLinkListByKey(rect.bottom+window.scrollY, rect.right+window.scrollX, rect.bottom, rect.right, selection);
			}
		}
	}

	function mousemoveBehavior(e){
		if ( !hasStopper() && isLinkListShown() && mousedownFlag ) resizeWatcher();
	}

	function isLinkListNodeUnderMouse(yy,xx){
		if( linkListNodeTop <= yy && yy < ( linkListNodeTop + linkListNode.offsetHeight )
		&& linkListNodeLeft <= xx && xx < ( linkListNodeLeft + linkListNode.offsetWidth ) ){
			return true;
		}
		return false;
	}

	function getLinkListHeight(){
		return linkListNode.offsetHeight - ( 2 * LINK_NODE_PADDING );
	}

	function getLinkListWidth(){
		return linkListNode.offsetWidth - ( 2 * LINK_NODE_PADDING );
	}

	function resizeWatcher(){
		switchWatchFlag()
		swichMiniView();
	}

	function switchWatchFlag(){
		let height = getLinkListHeight();
		let width = getLinkListWidth();
		if ( linkListNodeHeight != height || linkListNodeWidth != width ){
			resizeWatcherFlag = true;
			if ( height < LINK_NODE_MIN_HEIGHT ) height = LINK_NODE_MIN_HEIGHT;
			if ( width < LINK_NODE_MIN_WIDTH ) width = LINK_NODE_MIN_WIDTH;
			linkListNodeHeight = height;
			linkListNodeWidth = width;
		}
	}

	function swichMiniView(){
		if( linkListNodeHeight <= LINK_NODE_SWITCH_HEIGHT || linkListNodeWidth <= LINK_NODE_SWITCH_WIDTH ) {
			linkListNode.classList.add(CSS_PREFIX+"-mini");
		}
		else {
			linkListNode.classList.remove(CSS_PREFIX+"-mini");
		}
	}

	function saveLinkListSize(){
		return ponyfill.runtime.sendMessage({
			"method": "saveLinkListSize",
			"data": {
				"lh": linkListNodeHeight,
				"lw": linkListNodeWidth
			}
		});
	}

	function closeLinkList(){
		resetScrollTmp();
		linkListNode.classList.add(CSS_PREFIX+"-hide");
	}

	function closeLinkListDelay(){
		window.setTimeout(closeLinkList, LINK_LIST_CLOSE_TIME);
	}

	function onClickAnchor(e){
		closeLinkListDelay();
	}

	function onClickSaveHistory(e){
		saveHistory(e.currentTarget).catch(onSaveError);
	}

	function saveHistory(node){
		let data = {
			"method": "saveHistory",
			"data": {
				"text": node.getAttribute("data-text"),
				"fromURL": window.location.toString(),
				"fromTitle": document.title.toString(),
				"toURL": node.getAttribute("data-url"),
				"toTitle": node.getAttribute("data-label")
			}
		};
		return ponyfill.runtime.sendMessage(data);
	}

	function makeLinkList(text){
		let list = containerNode.querySelectorAll("."+CSS_PREFIX+"-list");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			containerNode.removeChild(node);
		}
		for(let i=0; i<optionList.length; i++){
			let item = optionList[i];
			if ( !item["c"] ) continue;
			let li = document.createElement("li");
			li.classList.add(CSS_PREFIX+"-list");
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(text) );
			let a = document.createElement("a");
			a.classList.add(CSS_PREFIX+"-anchor");
			a.setAttribute( "href", url );
			a.setAttribute( "rel", "noreferrer" );
			a.setAttribute( "target", "_blank" );
			a.setAttribute( "rel", "noreferrer" );
			a.setAttribute( "data-text", text );
			a.setAttribute( "data-url", item["u"] );
			a.setAttribute( "data-label", item["l"] );
			a.addEventListener("click", onClickAnchor);
			if( item["h"] ) a.addEventListener("click", onClickSaveHistory);
			let img = document.createElement("img");
			img.classList.add(CSS_PREFIX+"-favicon");
			let src;
			if( faviconCache.hasOwnProperty(item["u"]) && faviconCache[item["u"]] != FAVICON_NODATA ){
				src = faviconCache[item["u"]];
			}
			else {
				src = ponyfill.extension.getURL("/image/favicon.svg");
			}
			img.setAttribute( "src", src );
			img.setAttribute( "title", item["l"] );
			setFaviconSize(img, anchorSize);
			a.appendChild(img);
			let span = document.createElement("span");
			span.classList.add(CSS_PREFIX+"-label");
			setFontSize(span, anchorSize);
			span.innerText = item["l"];
			a.appendChild(span);
			li.appendChild(a);
			containerNode.appendChild(li);
		}
	}

	function applyLinkListSize(){
		linkListNode.style.height = linkListNodeHeight + "px";
		linkListNode.style.width = linkListNodeWidth + "px";
	}

	function showLinkListByClick(pageY, pageX, clientY, clientX, selection){
		if( linkListAction == LINK_LIST_ACTION_MOUSECLICK || linkListAction == LINK_LIST_ACTION_MOUSEOVER ) addStopper();
		showLinkList(pageY, pageX, clientY, clientX, selection);
	}

	function showLinkListByKey(pageY, pageX, clientY, clientX, selection){
		removeStopper();
		showLinkList(pageY, pageX, clientY, clientX, selection);
	}

	function showLinkList(pageY, pageX, clientY, clientX, selection){
		/* when display equals none, offsetHeight and offsetWidth return undefined. */
		linkListNode.classList.remove(CSS_PREFIX+"-hide");
		swichMiniView();
		applyLinkListSize();
		let yy = window.innerHeight - clientY - linkListNode.offsetHeight - SCROLL_BAR_WIDTH;
		if ( 0 < yy || window.innerHeight < linkListNode.offsetHeight ) yy = 0;
		let xx = window.innerWidth - clientX - linkListNode.offsetWidth - SCROLL_BAR_WIDTH;
		if ( 0 < xx || window.innerWidth < linkListNode.offsetWidth ) xx = 0;
		linkListNodeTop = pageY + yy + SPACE;
		linkListNodeLeft = pageX + xx + SPACE;
		/*
		let lastRange = selection.getRangeAt(selection.rangeCount-1);
		let rectList = lastRange.getClientRects();
		let rect = rectList[rectList.length-1];
		if ( window.scrollY + rect.top < linkListNodeTop + linkListNode.offsetHeight && linkListNodeTop < window.scrollY + rect.bottom ){
			if ( window.scrollX + rect.left < linkListNodeLeft + linkListNode.offsetWidth && linkListNodeLeft < window.scrollX + rect.right ){
				linkListNodeTop = window.scrollY + rect.top - linkListNode.offsetHeight - SPACE;
			}
		}
		*/
		if ( linkListNodeTop < window.scrollY ) linkListNodeTop = window.scrollY;
		if ( linkListNodeLeft < window.scrollX ) linkListNodeLeft = window.scrollX;
		linkListNode.style.top = linkListNodeTop+"px";
		linkListNode.style.left = linkListNodeLeft+"px";
		linkListNode.scrollTop = 0;
		linkListNode.scrollLeft = 0;
	}

	function isLinkListShown(){
		return !linkListNode.classList.contains(CSS_PREFIX+"-hide");
	}

	function onStorageChanged(change, area){
		if( change["lh"] || change["lw"] ){
			let lh = linkListNodeHeight;
			if( change.hasOwnProperty("lh") ) lh = change["lh"]["newValue"];
			let lw = linkListNodeWidth;
			if( change.hasOwnProperty("lw") ) lw = change["lw"]["newValue"];
			setLinkListSize( lh, lw );
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
			setOptionList( change["ol"]["newValue"] ).catch(err)
			resetLinkListEvents();
		}
		else if( change["bf"] ){
			closeLinkList();
			setLinkListFlag( change["bf"]["newValue"] );
			resetLinkListEvents();
		}
		else if( change["cl"] ){
			setLinkListStyle( change["cl"]["newValue"] );
		}
		else if( change["ca"] ){
			setLinkListAction( change["ca"]["newValue"] );
		}
	}

	function setLinkListSize( height=LINK_NODE_DEFAULT_HEIGHT, width=LINK_NODE_DEFAULT_WIDTH ){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
		if( isLinkListShown() ) applyLinkListSize();
	}

	function reload(){
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"bf": true,
			"sk": false,
			"ck": false,
			"lh": LINK_NODE_DEFAULT_HEIGHT,
			"lw": LINK_NODE_DEFAULT_WIDTH,
			"as": ANCHOR_DEFAULT_SIZE,
			"cl": LINK_LIST_STYLE_CLASSIC,
			"ca": LINK_LIST_ACTION_MOUSECLICK
		});
		return getter.then(setVer, onReadError);
	}

	function setVer( res ){
		setAnchorSize( res["as"] );
		setLinkListSize( res["lh"], res["lw"] );
		setOptionList( res["ol"] ).catch(err);
		setLinkListFlag( res["bf"] );
		setCtrlKeyFlag( res["ck"] );
		setShiftKeyFlag( res["sk"] );
		setLinkListStyle( res["cl"] );
		setLinkListAction( res["ca"] );
		resetLinkListEvents();
	}

	function setAnchorSize(res){
		anchorSize = res;
		applyZoomLinkList();
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

	function setLinkListStyle(res){
		linkListNode.classList.remove(CSS_PREFIX+"-dark");
		if( res == LINK_LIST_STYLE_DARK ) linkListNode.classList.add(CSS_PREFIX+"-dark");
	}

	function setLinkListAction(res){
		linkListAction = res;
		resetScrollTmp();
		linkListNode.classList.remove(CSS_PREFIX+"-mouseover");
		linkListNode.classList.remove(CSS_PREFIX+"-mouseclick");
		removeStopper();
		linkListNode.removeEventListener("mouseenter", removeStopper);
		linkListNode.removeEventListener("mouseleave", controlStopper);
		linkListNode.removeEventListener("click", removeStopper);
		if( linkListAction == LINK_LIST_ACTION_MOUSEOVER ){
			linkListNode.classList.add(CSS_PREFIX+"-mouseover");
			addStopper();
			linkListNode.addEventListener("mouseenter", removeStopper);
			linkListNode.addEventListener("mouseleave", controlStopper);
		}
		else if( linkListAction == LINK_LIST_ACTION_MOUSECLICK ) {
			linkListNode.classList.add(CSS_PREFIX+"-mouseclick");
			addStopper();
			linkListNode.addEventListener("click", removeStopper);
		}
	}

	function controlStopper(e){
		if(!resizeWatcherFlag){
			addStopper();
			linkListScrollTopTmp = linkListNode.scrollTop;
			linkListScrollleftTmp = linkListNode.scrollLeft;
			linkListNode.scrollTop = linkListNode.scrollLeft = 0;
		}
	}

	function addStopper(){
		linkListNode.classList.add(CSS_PREFIX+"-stopper");
	}

	function removeStopper(e){
		linkListNode.scrollTop = linkListScrollTopTmp;
		linkListNode.scrollLeft = linkListScrollleftTmp;
		linkListNode.classList.remove(CSS_PREFIX+"-stopper");
	}

	function hasStopper(){
		return linkListNode.classList.contains(CSS_PREFIX+"-stopper");
	}

	function resetScrollTmp(){
		linkListScrollTopTmp = linkListScrollleftTmp = 0;
	}

	function resetLinkListEvents(){
		removeAutoLinkListEvents();
		if( linkListFlag && hasLinkList() ) addAutoLinkListEvents();
	}

	function setOptionList(res){
		optionList = [];
		for(let i=0; i<res.length; i++){
			let data = res[i];
			if ( data["c"] ) optionList.push(data);
		}
		if( optionList.length <= 0) return;
		return getFavicon().then( gotFavicon );
	}

	function getFavicon(){
		return ponyfill.runtime.sendMessage({
			"method": "getFavicon",
		});
	}

	function gotFavicon(e){
		faviconCache = e;
	}

	function hasLinkList(){
		if( optionList.length > 0 ) return true;
		return false;
	}

	function menuClickBihavior(e){
		let id = e.target.getAttribute("id");
		if(id == CSS_PREFIX+"-zoomUp"){
			if( zoomLinkList(1) ){
				saveAnchorSize().catch(onSaveError);
			}
		}
		else if(id == CSS_PREFIX+"-zoomDown"){
			if( zoomLinkList(-1) ){
				saveAnchorSize().catch(onSaveError);
			}
		}
		else if(id == CSS_PREFIX+"-copy"){
			copyText().then(closeLinkList);
		}
		else if(id == CSS_PREFIX+"-resize"){
			resetSize(LINK_NODE_DEFAULT_HEIGHT, LINK_NODE_DEFAULT_WIDTH);
			saveLinkListSize().catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-option"){
			ponyfill.runtime.sendMessage({"method": "openOptions"}).then(closeLinkList);
		}
	}

	function copyText(){
		document.execCommand("copy");
		return ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationCopyed")
		});
	}

	function resetSize(height,width){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
		applyLinkListSize();
		swichMiniView();
	}

	function zoomLinkList(direction=1){
		if ( direction < 0 && anchorSize <= ANCHOR_MIN_SIZE ) return false;
		if ( 0 < direction && ANCHOR_MAX_SIZE <= anchorSize ) return false;
		anchorSize += direction * ANCHOR_RESIO;
		anchorSize = truncNumber(anchorSize);
		applyZoomLinkList();
		return true;
	}

	function truncNumber(num){
		num += 0.01;
		num *= 10 ;
		num = Math.floor(num);
		num /= 10 ;
		return num
	}

	function applyZoomLinkList(){
		let list = linkListNode.querySelectorAll("span."+CSS_PREFIX+"-label");
		for(let i=0; i<list.length; i++){
			setFontSize(list[i], anchorSize);
		}
		list = linkListNode.querySelectorAll("img."+CSS_PREFIX+"-favicon");
		for(let i=0; i<list.length; i++){
			setFaviconSize(list[i], anchorSize);
		}
	}

	function setFontSize(node, size){
		node.style["font-size"] = size + "em";
	}

	function setFaviconSize(node, size){
		size = truncNumber(size + (2*ANCHOR_RESIO));
		node.style["height"] = size + "em";
		node.style["width"] = size + "em";
	}

	function saveAnchorSize(){
		let res = ponyfill.runtime.sendMessage({
			"method": "saveAnchorSize",
			"data": {
				"as": anchorSize
			}
		});
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
			console.log(e);
		}
		else {
			throw(e);
		}
	}

	function err(e){
		console.error(e);
	}
})();
