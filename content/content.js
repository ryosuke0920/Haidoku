(()=>{
	const LINK_NODE_DEFAULT_HEIGHT = 200;
	const LINK_NODE_DEFAULT_WIDTH = 320;
	const LINK_NODE_MIN_HEIGHT = 50;
	const LINK_NODE_MIN_WIDTH = 50;
	const LINK_NODE_PADDING = 3;
	const SCROLL_SPACE = 17;
	const RECT_SPACE = 3;
	const SCROLL_BAR_WIDTH = 22;
	const ANCHOR_DEFAULT_SIZE = 0.8;
	const ANCHOR_MAX_SIZE = 2;
	const ANCHOR_MIN_SIZE = 0.6;
	const ANCHOR_RESIO = 0.1;
	const SILENT_ERROR_PREFIX = "[silent]";
	const SILENT_ERROR_REGEX = new RegExp( /^\[silent\]/ );
	const REMOVE_SPACE_REGEX = new RegExp( /(?:\s|\|)+/, "g" );
	const LINK_LIST_CLOSE_TIME = 500;
	const API_QUERY_DERAY = 1000;
	const API_TEXT_MAX_LENGTH = 255;
	const API_TEXT_MAX_LENGTH_ERROR = "max length error";
	const API_WHITE_SPACE_ERROR = "white space error";
	const FOOTER_CONTENT = "Provided by Wiktionary under Creative Commons Attribution-Share Alike 3.0";//https://www.mediawiki.org/wiki/API:Licensing

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
	let apiContentNode;
	let apiTitleNode;
	let apiErrorMessageNode;
	let apiBodyNode;
	let mousedownFlag = false;
	let selectionChangedFlag = false;
	let faviconCache = {};
	let apiRequestQueue = {};
	let fetchRequestID = (()=>{ let id = 0; return ()=>{return ++id} })();
	let serviceCode = API_SERVICE_CODE_NONE;
	let languageFilter = [];
	let apiCutOut = true;
	let apiFooterNode;
	let apiSwitcheNode;
	let windowId = Math.random();
	let arrowNode;
	let moveObj;
	let historyButtoneNode;
	let historyDoneButtoneNode;
	let innerSelectionFlag = false;

	Promise.resolve()
		.then(init)
		.then(
			()=>{ return Promise.resolve().then(loadSetting).then(addCommonLinkListEvents); },
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
		hide(linkListNode);
		linkListNode.style.padding = LINK_NODE_PADDING + "px";
		applyLinkListSize();
		body.appendChild( linkListNode );

		coverNode = document.createElement("div");
		coverNode.setAttribute("id",CSS_PREFIX+"-cover");
		coverNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/rect30.png")+")";
		linkListNode.appendChild(coverNode);

		menuNode = document.createElement("nav");
		menuNode.setAttribute("id",CSS_PREFIX+"-menu");
		linkListNode.appendChild(menuNode);

		let linkListGridNode = document.createElement("div");
		linkListGridNode.setAttribute("id",CSS_PREFIX+"-grid");
		linkListNode.appendChild(linkListGridNode);

		containerNode = document.createElement("ul");
		containerNode.setAttribute("id",CSS_PREFIX+"-container");
		linkListGridNode.appendChild(containerNode);

		apiContentNode = document.createElement("div");
		apiContentNode.setAttribute("id",CSS_PREFIX+"-apiContent");
		linkListGridNode.appendChild(apiContentNode);

		let apiHeaderNode = document.createElement("div");
		apiHeaderNode.setAttribute("id",CSS_PREFIX+"-apiHeader");
		apiContentNode.appendChild(apiHeaderNode);

		let apiHeaderTextAreaNode = document.createElement("div");
		apiHeaderTextAreaNode.setAttribute("id",CSS_PREFIX+"-apiHeaderTextArea");
		apiHeaderNode.appendChild(apiHeaderTextAreaNode);

		apiSwitcheNode = document.createElement("span");
		apiSwitcheNode.setAttribute("id",CSS_PREFIX+"-apiSwitch");
		apiSwitcheNode.classList.add(CSS_PREFIX+"-checkboxButton");
		apiHeaderNode.appendChild(apiSwitcheNode);

		let apiSwitcheCircleNode = document.createElement("span");
		apiSwitcheCircleNode.classList.add(CSS_PREFIX+"-circle");
		apiSwitcheNode.appendChild(apiSwitcheCircleNode);

		let apiTitleWrapper = document.createElement("div");
		apiTitleWrapper.setAttribute("id",CSS_PREFIX+"-apiTitleWrapper");
		apiHeaderTextAreaNode.appendChild(apiTitleWrapper);

		historyButtoneNode = document.createElement("div");
		historyButtoneNode.setAttribute("id",CSS_PREFIX+"-history");
		historyButtoneNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/history.svg")+")";
		historyButtoneNode.title = ponyfill.i18n.getMessage("htmlSaveHistory");
		apiTitleWrapper.appendChild(historyButtoneNode);

		historyDoneButtoneNode = document.createElement("div");
		historyDoneButtoneNode.setAttribute("id",CSS_PREFIX+"-historyDone");
		historyDoneButtoneNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/done.svg")+")";
		historyDoneButtoneNode.title = ponyfill.i18n.getMessage("htmlSaveHistoryDone");
		apiTitleWrapper.appendChild(historyDoneButtoneNode);

		apiTitleNode = document.createElement("a");
		apiTitleNode.setAttribute("id",CSS_PREFIX+"-apiTitle");
		apiTitleNode.setAttribute("rel","noreferrer");
		apiTitleNode.setAttribute("target","_blank");
		apiTitleWrapper.appendChild(apiTitleNode);

		apiErrorMessageNode = document.createElement("div");
		apiErrorMessageNode.setAttribute("id",CSS_PREFIX+"-apiErrorMessage");
		apiTitleWrapper.appendChild(apiErrorMessageNode);

		let apiNowLoadingMsgNode = document.createElement("div");
		apiNowLoadingMsgNode.setAttribute("id",CSS_PREFIX+"-nowLoadingMsg");
		apiNowLoadingMsgNode.innerText = ponyfill.i18n.getMessage("htmlNowSearching");
		apiHeaderTextAreaNode.appendChild(apiNowLoadingMsgNode);

		let apiOffMsgNode = document.createElement("div");
		apiOffMsgNode.setAttribute("id",CSS_PREFIX+"-apiOffMsg");
		apiOffMsgNode.innerText = ponyfill.i18n.getMessage("htmlLinkageDisabled");
		apiHeaderTextAreaNode.appendChild(apiOffMsgNode);

		let apiLoadingNode = document.createElement("div");
		apiLoadingNode.setAttribute("id",CSS_PREFIX+"-apiLoading");
		apiContentNode.appendChild(apiLoadingNode);

		let apiOffNode = document.createElement("div");
		apiOffNode.setAttribute("id",CSS_PREFIX+"-apiOff");
		apiOffNode.innerHTML = ponyfill.i18n.getMessage("htmlLinkageMessage");
		apiContentNode.appendChild(apiOffNode);

		let apiLoadingContentNode = document.createElement("div");
		apiLoadingContentNode.setAttribute("id",CSS_PREFIX+"-apiLoadingContent");
		apiLoadingContentNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/circle.svg")+")";
		apiLoadingNode.appendChild(apiLoadingContentNode);

		apiBodyNode = document.createElement("div");
		apiBodyNode.setAttribute("id",CSS_PREFIX+"-apiBody");
		apiContentNode.appendChild(apiBodyNode);

		apiFooterNode = document.createElement("div");
		apiFooterNode.setAttribute("id",CSS_PREFIX+"-apiFooter");
		apiFooterNode.innerText = FOOTER_CONTENT;
		apiContentNode.appendChild(apiFooterNode);
		clearApiContent();

		arrowNode = document.createElement("div");
		arrowNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/arrow.svg")+")";
		arrowNode.setAttribute("id", CSS_PREFIX+"-move");
		arrowNode.title = ponyfill.i18n.getMessage("htmlMove");
		menuNode.appendChild(arrowNode);

		let resizeNode = document.createElement("div");
		resizeNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/resize.svg")+")";
		resizeNode.setAttribute("id",CSS_PREFIX+"-resize");
		resizeNode.title = ponyfill.i18n.getMessage("htmlResize");
		menuNode.appendChild(resizeNode);

		let zoomDownNode = document.createElement("div");
		zoomDownNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/minus.svg")+")";
		zoomDownNode.setAttribute("id",CSS_PREFIX+"-zoomDown");
		zoomDownNode.title = ponyfill.i18n.getMessage("htmlZoomDown");
		menuNode.appendChild(zoomDownNode);

		let zoomUpNode = document.createElement("div");
		zoomUpNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/plus.svg")+")";
		zoomUpNode.setAttribute("id",CSS_PREFIX+"-zoomUp");
		zoomUpNode.title = ponyfill.i18n.getMessage("htmlZoomUp");
		menuNode.appendChild(zoomUpNode);

		let optionNode = document.createElement("div");
		optionNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/option.svg")+")";
		optionNode.setAttribute("id",CSS_PREFIX+"-option");
		optionNode.title = ponyfill.i18n.getMessage("htmloption");
		menuNode.appendChild(optionNode);
	}

	function addCommonLinkListEvents(){
		ponyfill.storage.onChanged.addListener( onStorageChanged );
		linkListNode.addEventListener("click", menuClickBihavior);
		document.addEventListener("keydown", keydownBehavior);
		document.addEventListener("mousemove", mousemoveBehavior);
		document.addEventListener("mouseup", mouseupCommonBehavior);
		document.addEventListener("mousedown", mousedownCommonBehavior);
		ponyfill.runtime.onMessage.addListener( notify );
		apiSwitcheNode.addEventListener("click", apiSwitchBehavior);
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

	function updateInnerSelectionFlag(){
		let selection = window.getSelection();
		innerSelectionFlag = selection.containsNode(linkListNode, true);
	}

	function manualSelectionChangeBehavior(e){
		updateInnerSelectionFlag();
		if(innerSelectionFlag) return;
		closeLinkList();
	}

	function selectionChangeAutoBehavior(e){
		updateInnerSelectionFlag();
		selectionChangedFlag = true;
		if(mousedownFlag || innerSelectionFlag) return;
		let selection = window.getSelection();
		if( selection.isCollapsed ){
			closeLinkList();
			return;
		}
		let text = selection.toString();
		if( !checkBlank(text) ) {
			closeLinkList();
			return;
		};
		makeLinkList(text);
		showLinkListByClick();
		if(!isEnableApi()) return;
		abortApiRequestQueue();
		apiRequest(text);
	}

	function mousedownCommonBehavior(e){
		if( e.button != 0 ) return;
		if ( e.target == arrowNode ) {
			moveObj = {
				"dy": e.pageY - linkListNodeTop,
				"dx": e.pageX - linkListNodeLeft
			};
			return;
		}
		if ( e.target != coverNode ) mousedownFlag = true;
	}

	function mousedownAutoBehavior(e){
		if( e.button != 0 ) return;
		if( !isLinkListNodeUnderMouse(e.pageY, e.pageX) ) {
			closeLinkList();
		}
	}

	function mouseupCommonBehavior(e){
		moveObj = undefined;
		mousedownFlag = false;
		if ( resizeWatcherFlag ) {
			resizeWatcherFlag = false;
			Promise.resolve().then(saveLinkListSize).catch(onSaveError);
		}
	}

	function mouseupAutoBehavior(e){
		if( e.button != 0 ) return;
		if( !( selectionChangedFlag && !innerSelectionFlag ) ) return;
		let selection = window.getSelection();
		if( selection.isCollapsed ) return;
		selectionChangedFlag = false;
		let text = selection.toString();
		if( !checkBlank(text) ) return;
		makeLinkList(text);
		showLinkListByClick();
		if(!isEnableApi()) return;
		abortApiRequestQueue();
		apiRequest(text);
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
		else if ( hasToShow() ) {
			let selection = window.getSelection();
			if( selection.isCollapsed ) return;
			let text = selection.toString();
			if( !checkBlank(text) ) return;
			makeLinkList(text);
			showLinkListByKey();
			if(!isEnableApi()) return;
			abortApiRequestQueue();
			apiRequest(text);
		}
	}

	function mousemoveBehavior(e){
		if ( moveObj ) {
			moveWidgetMousePonit(e);
			return;
		}
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

	function applyFaviconDisplay(res){
		if( res == LINK_LIST_FAVICON_ONLY ) {
			linkListNode.classList.add(CSS_PREFIX+"-mini");
		}
		else {
			linkListNode.classList.remove(CSS_PREFIX+"-mini");
		}
	}

	function applyLinknListDirection(res){
		if( res == LINK_LIST_DIRECTION_HORIZAONTAL ) {
			linkListNode.classList.add(CSS_PREFIX+"-inline");
		}
		else {
			linkListNode.classList.remove(CSS_PREFIX+"-inline");
		}
	}

	function applyLinknListSeparator(res){
		if( res == LINK_LIST_SEPARATOR_VERTICAL ) {
			linkListNode.classList.add(CSS_PREFIX+"-separator");
		}
		else {
			linkListNode.classList.remove(CSS_PREFIX+"-separator");
		}
	}

	function applyServiceCode(res){
		if( res == API_SERVICE_CODE_NONE ) {
			hide(apiContentNode);
		}
		else {
			show(apiContentNode);
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
		hide(linkListNode);
		abortApiRequestQueue();
	}

	function closeLinkListDelay(){
		window.setTimeout(closeLinkList, LINK_LIST_CLOSE_TIME);
	}

	function onClickAnchor(e){
		closeLinkListDelay();
	}

	function onClickSaveHistory(e){
		saveHistory(e.currentTarget.getAttribute("data-text"), window.location.toString(), document.title.toString(), e.currentTarget.getAttribute("data-url"), e.currentTarget.getAttribute("data-label")).catch(onSaveError);
	}

	function saveHistory(text,fromURL,fromTitle,toURL,toTitle,asIs=false){
		let data = {
			"method": "saveHistory",
			"data": {
				"text": text,
				"fromURL": fromURL,
				"fromTitle": fromTitle,
				"toURL": toURL,
				"toTitle": toTitle,
				"asIs": asIs
			}
		};
		return ponyfill.runtime.sendMessage(data);
	}

	function setSelectedText(text){
		linkListNode.setAttribute("data-selected-text", text);
	}

	function getSelectedText(){
		return linkListNode.getAttribute("data-selected-text");
	}

	function makeLinkList(text){
		setSelectedText(text);
		let list = containerNode.querySelectorAll("."+CSS_PREFIX+"-list");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			containerNode.removeChild(node);
		}
		clearApiContent();
		for(let i=0; i<optionList.length; i++){
			let item = optionList[i];
			let li = document.createElement("li");
			li.classList.add(CSS_PREFIX+"-list");
			li.setAttribute( "title", item["l"] );
			let url = item["u"];
			url = url.replace( "$1", encodeURIComponent(text) );
			let a = document.createElement("a");
			a.classList.add(CSS_PREFIX+"-anchor");
			a.setAttribute( "href", url );
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
			if( faviconCache.hasOwnProperty(item["u"]) ){
				src = faviconCache[item["u"]];
			}
			else {
				src = ponyfill.extension.getURL("/image/favicon.svg");
			}
			img.setAttribute( "src", src );
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

	function showLinkListByClick(){
		if( linkListAction == LINK_LIST_ACTION_MOUSECLICK || linkListAction == LINK_LIST_ACTION_MOUSEOVER ) addStopper();
		showLinkList();
	}

	function showLinkListByKey(){
		removeStopper();
		showLinkList();
	}

	function getSelectionRect(){
		let selection = window.getSelection();
		for(let i=selection.rangeCount-1; 0<=i; i--) {
			let range = selection.getRangeAt(i);
			if(range.collapsed) continue;
			let rectList = range.getClientRects();
			let rect = rectList[rectList.length-1];
			return rect;
		}
	}

	function showLinkList(){
		show(linkListNode);
		applyLinkListSize();
		let rect = getSelectionRect();
		if(!rect) throw( new Error("Rect not found.") );
		linkListNodeLeft = makeWidgetPointX(rect);
		linkListNodeTop = makeWidgetPointY(rect);
		moveWidget();
		linkListNode.scrollTop = 0;
		linkListNode.scrollLeft = 0;
	}

	function makeWidgetPointX(rect){
		let clientX = rect.right;
		let pageX = window.scrollX + clientX;
		let viewPortWidth = window.innerWidth - SCROLL_SPACE;
		if ( viewPortWidth < linkListNode.offsetWidth ){
			return window.scrollX;
		}
		if ( (clientX + linkListNode.offsetWidth + RECT_SPACE) <= viewPortWidth){
			return pageX + RECT_SPACE;
		}
		return window.scrollX + viewPortWidth - linkListNode.offsetWidth;
	}

	function makeWidgetPointY(rect){
		let clientY = rect.bottom;
		let pageY = window.scrollY + clientY;
		let viewPortHeight = window.innerHeight - SCROLL_SPACE;
		if ( viewPortHeight < linkListNode.offsetHeight ){
			return pageY + RECT_SPACE;
		}
		if ( (clientY + RECT_SPACE + linkListNode.offsetHeight) <=  viewPortHeight ){
			return pageY + RECT_SPACE;
		}
		yy = rect.top - linkListNode.offsetHeight - RECT_SPACE;
		if ( 0 <= yy) {
			return window.scrollY + yy;
		}
		return pageY + RECT_SPACE;
	}

	function isLinkListShown(){
		return isShown(linkListNode);
	}

	function onStorageChanged(change, area){
		if( change["lh"] || change["lw"] ){
			let lh = linkListNodeHeight;
			if( change.hasOwnProperty("lh") ) lh = change["lh"]["newValue"];
			let lw = linkListNodeWidth;
			if( change.hasOwnProperty("lw") ) lw = change["lw"]["newValue"];
			setLinkListSize( lh, lw );
		}
		if( change["as"] ){
			setAnchorSize( change["as"]["newValue"] );
		}
		if( change["ck"] ){
			setCtrlKeyFlag( change["ck"]["newValue"] );
		}
		if( change["sk"] ){
			setShiftKeyFlag( change["sk"]["newValue"] );
		}
		if( change["ol"] ) {
			closeLinkList();
			setOptionList( change["ol"]["newValue"] );
			resetLinkListEvents();
			if(hasLinkList()) getFavicon().then( gotFavicon ).catch((e)=>{console.error(e);});
		}
		if( change["bf"] ){
			closeLinkList();
			setLinkListFlag( change["bf"]["newValue"] );
			resetLinkListEvents();
		}
		if( change["cl"] ){
			setLinkListStyle( change["cl"]["newValue"] );
		}
		if( change["ca"] ){
			setLinkListAction( change["ca"]["newValue"] );
		}
		if( change["f"] ){
			applyFaviconDisplay( change["f"]["newValue"] );
		}
		if( change["ld"] ){
			applyLinknListDirection( change["ld"]["newValue"] );
		}
		if( change["ls"] ){
			applyLinknListSeparator( change["ls"]["newValue"] );
		}
		if( change["s"] ){
			closeLinkList();
			setServiceCode( change["s"]["newValue"] );
			applyServiceCode( change["s"]["newValue"] );
		}
		if( change["ll"] ){
			setLanguageFilter( change["ll"]["newValue"] );
		}
		if( change["co"] ){
			setLinkListApiCutOut( change["co"]["newValue"] );
		}
		if(!change.hasOwnProperty("w")) return;
		if(change["w"]["newValue"] == windowId) return;
		if( change["sw"] ){
			closeLinkList();
			setApiSwitch( change["sw"]["newValue"] );
		}
	}

	function setLinkListSize( height=LINK_NODE_DEFAULT_HEIGHT, width=LINK_NODE_DEFAULT_WIDTH ){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
		if( isLinkListShown() ) applyLinkListSize();
	}

	function loadSetting(){
		let serviceCode = getDefaultServiceCode();
		let languageFilter = getDefaultLanguageFilter();
		let getter = ponyfill.storage.sync.get({
			"ol": [],
			"bf": true,
			"sk": false,
			"ck": false,
			"lh": LINK_NODE_DEFAULT_HEIGHT,
			"lw": LINK_NODE_DEFAULT_WIDTH,
			"as": ANCHOR_DEFAULT_SIZE,
			"cl": LINK_LIST_STYLE_DARK,
			"ca": LINK_LIST_ACTION_MOUSECLICK,
			"f": LINK_LIST_FAVICON_ONLY,
			"ld": LINK_LIST_DIRECTION_VERTICAL,
			"ls": LINK_LIST_SEPARATOR_VERTICAL,
			"sw": API_SWITCH_DISABLED,
			"s": serviceCode,
			"ll": languageFilter,
			"co": true
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
		setLinkListStyle( res["cl"] );
		setLinkListAction( res["ca"] );
		applyFaviconDisplay( res["f"] );
		applyLinknListDirection( res["ld"] );
		applyLinknListSeparator( res["ls"] );
		setApiSwitch( res["sw"] );
		setServiceCode( res["s"] );
		applyServiceCode( res["s"] );
		setLanguageFilter( res["ll"] );
		setLinkListApiCutOut( res["co"] );
		resetLinkListEvents();
		if(hasLinkList()) getFavicon().then( gotFavicon ).catch((e)=>{console.error(e);});
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

	function setServiceCode(res){
		serviceCode = res;
	}

	function setLanguageFilter(res){
		languageFilter = res;
	}

	function setLinkListApiCutOut(res){
		apiCutOut = res;
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
		coverNode.removeEventListener("click", widgetActionMouseclick);
		if( linkListAction == LINK_LIST_ACTION_MOUSEOVER ){
			linkListNode.classList.add(CSS_PREFIX+"-mouseover");
			addStopper();
			linkListNode.addEventListener("mouseenter", removeStopper);
			linkListNode.addEventListener("mouseleave", controlStopper);
		}
		else if( linkListAction == LINK_LIST_ACTION_MOUSECLICK ) {
			linkListNode.classList.add(CSS_PREFIX+"-mouseclick");
			addStopper();
			coverNode.addEventListener("click", widgetActionMouseclick);
		}
	}

	function widgetActionMouseclick(e){
		removeStopper();
		let rect = getSelectionRect();
		if(!rect) throw( new Error("Rect not found.") );
		linkListNodeLeft = makeWidgetPointX(rect);
		linkListNodeTop = makeWidgetPointY(rect);
		moveWidget();
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
		if(!hasStopper())return;
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
		if( linkListFlag && hasToShow() ) addAutoLinkListEvents();
	}

	function setOptionList(res){
		optionList = [];
		for(let i=0; i<res.length; i++){
			let data = res[i];
			if ( data["c"] ) optionList.push(data);
		}
	}

	function getFavicon(){
		return ponyfill.runtime.sendMessage({
			"method": "getFavicon",
		});
	}

	function gotFavicon(e){
		faviconCache = e;
	}

	function hasToShow(){
		return (hasLinkList() || hasServiceCode());
	}

	function hasLinkList(){
		if( optionList.length > 0 ) return true;
		return false;
	}

	function hasServiceCode(){
		return (serviceCode != API_SERVICE_CODE_NONE);
	}

	function menuClickBihavior(e){
		let id = e.target.getAttribute("id");
		if(id == CSS_PREFIX+"-history"){
			hide(historyButtoneNode);
			show(historyDoneButtoneNode);
			Promise.resolve().then(saveHistoryWiktionaryLinkage).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-zoomUp"){
			if( zoomLinkList(1) ) Promise.resolve().then(saveAnchorSize).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-zoomDown"){
			if( zoomLinkList(-1) ) Promise.resolve().then(saveAnchorSize).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-resize"){
			resetSize(LINK_NODE_DEFAULT_HEIGHT, LINK_NODE_DEFAULT_WIDTH);
			Promise.resolve().then(saveLinkListSize).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-option"){
			ponyfill.runtime.sendMessage({"method": "openOptions"}).then(closeLinkList).catch(unexpectedError);
		}
	}

	function resetSize(height,width){
		linkListNodeHeight = height;
		linkListNodeWidth = width;
		applyLinkListSize();
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

	function onAudioPlayError(e){
		console.error(e);
		let res = ponyfill.runtime.sendMessage({
			"method": "notice",
			"data": ponyfill.i18n.getMessage("notificationAudioPlayError", [e.message])
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

	function notify(e){
		if(e.method == "updateFaviconCache") {
			faviconCache = e.data;
		}
	}

	function apiRequest(text){
		text = text.replace(REMOVE_SPACE_REGEX," ").trim();
		let obj = {
			"abort": false,
			"data": {
				"text": text,
				"api": "wiktionary"
			}
		};
		if( !checkBlank(text) ){
			obj.data.error = API_WHITE_SPACE_ERROR;
			return apiResponseError.bind(obj)(obj.data);
		}
		if( !checkByte(text, API_TEXT_MAX_LENGTH) ){
			obj.data.error = API_TEXT_MAX_LENGTH_ERROR;
			return apiResponseError.bind(obj)(obj.data);
		}
		obj.id = fetchRequestID();
		apiRequestQueue[obj.id] = obj;
		let keyList = Object.keys(apiRequestQueue);
		if(keyList.length<=1) {
			clearApiContent();
			apiRequestStart(obj);
			return;
		}
		setTimeout((e)=>{
			if( !isActiveApiRequestQueue(obj) ){
				dropApiRequestQueue(obj);
				return;
			}
			apiRequestStart(obj);
		}, API_QUERY_DERAY);
	}

	function apiRequestStart(obj){
		ponyfill.runtime.sendMessage({
			"method": "apiRequest",
			"data": obj.data
		}).then(
			apiResponse.bind(obj)
		).catch(
			apiResponseError.bind(obj)
		).finally(
			()=>{ dropApiRequestQueue(obj) }
		).catch((e)=>{ console.error(e) });
	}

	function isActiveApiRequestQueue(obj){
		return ( apiRequestQueue.hasOwnProperty(obj.id) && !obj.abort );
	}

	function dropApiRequestQueue(obj){
		delete apiRequestQueue[obj.id];
	}

	function abortApiRequestQueue(){
		let valueList = Object.values(apiRequestQueue);
		for(let i=0; i<valueList.length; i++){
			valueList[i].abort = true;
		}
	}

	function clearApiContent(){
		linkListNode.classList.add(CSS_PREFIX+"-loading");
		hide(historyButtoneNode);
		hide(historyDoneButtoneNode);
		clearChildren(apiBodyNode);
		clearApiTitle();
	}

	function clearApiTitle(){
		apiTitleNode.removeAttribute("data-text");
		apiTitleNode.removeAttribute("data-title");
		apiTitleNode.removeAttribute("href");
		apiTitleNode.removeAttribute("title");
		apiErrorMessageNode.removeAttribute("title");
		apiTitleNode.innerText = apiErrorMessageNode.innerText = "";
	}

	function setApiErrorMessage(text){
		apiErrorMessageNode.innerText = text;
		apiErrorMessageNode.setAttribute("title", text);
	}

	function apiResponse(e){
		if( !isActiveApiRequestQueue(this) ) return;
		if( e.hasOwnProperty("error") ) return apiResponseError.bind(this)(e);
		makeApiTitleNode(e.text, e.title, e.fullurl);
		let property = API_SERVICE_PROPERTY[e.service];
		let result = parseHTML(e.html, property.sectionHeading);
		let parsed = result.parsed;
		let bases = result.bases;
		let parseStatus = result.status;
		let warnings = [];
		if(parseStatus){
			for(let h=0; h<parsed.length; h++){
				let header = parsed[h].header;
				let bodys = parsed[h].bodys;
				if(0 < languageFilter.length){
					let list = [];
					for(let i=0; i<bodys.length; i++){
						let obj = bodys[i];
						if ( isLanguageFilterd(obj.title.innerText, languageFilter, property.followed, property.languageTopRegex, property.languageBottomRegex ) ) {
							list.push(obj);
						}
					}
					if ( list.length <= 0 ) {
						apiBodyNode.appendChild(makeMessageNode(ponyfill.i18n.getMessage("htmlSectionNotFound")));
					}
					else {
						bodys = list;
					}
				}
				if(apiCutOut){
					for(let i=0; i<bodys.length; i++){
						let obj = bodys[i];
						let node = cutOut(obj.content, property.cutOut);
						if(node){
							obj.content = node;
						}
						else {
							obj.warnings.push( makeMessageNode(ponyfill.i18n.getMessage("htmlMeaningNotFound")) );
						}
					}
				}
				header = removeSimbol(header);
				header = convertStyle(header);
				header = convertAnchor(header, e.service);
				header = convertNaveFrame(header);
				apiBodyNode.appendChild(header);
				for(let i=0; i<bodys.length; i++){
					let obj = bodys[i];
					obj.title = removeSimbol(obj.title);
					obj.title = convertStyle(obj.title);
					obj.title = convertAnchor(obj.title, e.service);
					apiBodyNode.appendChild(obj.title);
					for(let j=0; j<obj.warnings.length; j++){
						apiBodyNode.appendChild(obj.warnings[j]);
					}
					obj.content = removeSimbol(obj.content);
					obj.content = convertStyle(obj.content);
					obj.content = convertAudio(obj.content, e.service);
					obj.content = convertAnchor(obj.content, e.service);
					obj.content = convertNaveFrame(obj.content);
					apiBodyNode.appendChild(obj.content);
				}
			}
		}
		else {
			apiBodyNode.appendChild(makeMessageNode(ponyfill.i18n.getMessage("htmlParseFailed")));
			for(let i=0; i<bases.length; i++){
				let base = bases[i];
				base = removeSimbol(base);
				base = convertStyle(base);
				base = convertAudio(base, e.service);
				base = convertAnchor(base, e.service);
				base = convertNaveFrame(base);
				apiBodyNode.appendChild(base);
			}
		}
		show(historyButtoneNode);
		linkListNode.classList.remove(CSS_PREFIX+"-loading");
	}

	function makeApiTitleNode(text,title,url){
		if( text.toLowerCase() != title.toLowerCase() ) {
			apiTitleNode.innerText = ponyfill.i18n.getMessage("htmlMaybeTitle",[title]);
		}
		else {
			apiTitleNode.innerText = title;
		}
		apiTitleNode.setAttribute("title", title);
		apiTitleNode.setAttribute("data-text", text);
		apiTitleNode.setAttribute("data-title", title);
		apiTitleNode.setAttribute("href", url);
	}

	function parseHTML(htmls, sectionHeading){
		let parsed = [];
		let bases = [];
		let flag = false;
		/*
		parsed = [
			header:[dom]
			bodys:[
				title: dom
				warnings:[dom]
				content:dom
			],
			bases:[dom],
			status: boolean
		]
		*/
		for(let i=0; i<htmls.length; i++){
			let node = document.createElement("div");
			node.innerHTML = htmls[i];
			bases.push(node);
			if ( flag ) continue;
			let list = node.querySelectorAll(sectionHeading);
			if ( list.length <= 0 ) {
				flag = true;
				continue;
			}
			let tmp = list[0];
			let headersTmp = [];
			while(tmp && tmp.previousElementSibling){
				if( checkBlank(tmp.previousElementSibling.innerText) ) {
					headersTmp.push(tmp.previousElementSibling);
				}
				tmp = tmp.previousElementSibling;
			}
			let header = document.createElement("div");
			for(let j=0; j<headersTmp.length; j++){
				header.appendChild(headersTmp[j]);
			}
			let bodys = [];
			for(let j=0; j<list.length; j++){
				let target = list[j];
				let contentTmp = [];
				while( target && target.nextElementSibling && !nodeListContains(list,target.nextElementSibling) ) {
					if(checkBlank(target.nextElementSibling.innerText)){
						contentTmp.push(target.nextElementSibling);
					}
					target = target.nextElementSibling;
				}
				let obj = {
					"title": list[j],
					"warnings": [],
					"content": null,
					"tmp": contentTmp
				};
				bodys.push(obj);
			}
			for(let i=0; i<bodys.length; i++){
				let obj = bodys[i];
				let content = document.createElement("div");
				for(let j=0; j<obj.tmp.length; j++){
					content.appendChild(obj.tmp[j]);
				}
				obj.content = content;
				delete obj.tmp;
			}
			parsed.push({"header":header, "bodys":bodys});
		}
		return { "parsed": parsed, "bases": bases, "status": !flag  };
	}

	function nodeListContains(nodeList, node){
		for(let i=0; i<nodeList.length; i++){
			if(nodeList[i].isEqualNode(node))　return true;
		}
		return false;
	}

	function isLanguageFilterd(title,filterList, followed, languageTopRegex, languageBottomRegex) {
		let replaceRegex;
		if(followed) replaceRegex = new RegExp("\\s+" + followed + "$", "i");
		for(let i=0; i<filterList.length; i++){
			let language = filterList[i];
			if (followed != null) language = language.replace(replaceRegex, "");
			let languageMatcher = new RegExp( languageTopRegex + language + languageBottomRegex, "i");
			if(title.match(languageMatcher)) return true;
		}
		return false;
	}

	function makeMessageNode(message){
		let node = document.createElement("div");
		node.classList.add( CSS_PREFIX+"-apiWarningMessage" );
		node.innerText = message;
		return node;
	}

	function cutOut(node, keyword){
		let meaningNode;
		if(keyword){
			let list = node.querySelectorAll("p");
			for(let i=0; i<list.length; i++){
				if(list[i].innerText == keyword) {
					meaningNode = list[i].nextElementSibling;
					break;
				}
			}
		}
		else {
			let list = node.querySelectorAll("ol");
			for(let i=0; i<list.length; i++){
				if( checkBlank(list[i].innerText) ) {
					meaningNode = list[i];
					let list2 = meaningNode.querySelectorAll("ol>li>dl,ol>li>ul");
					for(let j=0; j<list2.length; j++){
						list2[j].parentNode.removeChild(list2[j]);
					}
					break;
				}
			}
		}
		return meaningNode;
	}

	function removeSimbol(node){
		let list = node.querySelectorAll(".indicator,.noprint");
		for(let i=0; i<list.length; i++){
			list[i].parentNode.removeChild(list[i]);
		}
		return node;
	}

	function convertStyle(node){
		let list = node.querySelectorAll("[style]");
		for(let i=0; i<list.length; i++){
			list[i].style.float = "none";
			if( list[i].style.width ) list[i].style.width = "auto";
		}
		return node;
	}

	function convertAudio(node, service){
		let list = node.querySelectorAll("audio");
		for(let i=0; i<list.length; i++){
			let audio = list[i];
			audio.style.display = "none";
			let playButton = document.createElement("span");
			playButton.classList.add(CSS_PREFIX+"-play");
			if(audio.nextElementSibling){
				audio.nextElementSibling.insertBefore(playButton);
			}
			else{
				audio.parentNode.appendChild(playButton);
			}
			playButton.addEventListener("click",(e)=>{
				let url = audio.currentSrc;
				if(!url){
					let list = audio.querySelectorAll("source");
					for(let i=list.length-1; 0<=i; i--){
						url = list[i].src;
						if( url.match("ogg$") ) break;
					}
				}
				if(!url) return onAudioPlayError( new Error("Audio source not found.") );
				url = new URL(url, service).href;
				let p = ponyfill.runtime.sendMessage({
					"method": "downloadAsBaase64",
					"data": {
						"url": url
					}
				});
				p.catch( (e)=>{ return onAudioPlayError(e); });
			});
		}
		return node;
	}

	function convertAnchor(node, service){
		let list = node.querySelectorAll("a");
		for(let i=0; i<list.length; i++){
			let url = list[i].getAttribute("href");
			list[i].setAttribute("href", new URL(url, service).href );
			list[i].setAttribute("target", "_blank");
			list[i].setAttribute("rel", "noreferrer");
			list[i].addEventListener("click", onClickAnchor);
		}
		return node;
	}

	function convertNaveFrame(node){
		let naviFrameList = node.querySelectorAll(".NavFrame");
		for(let i=0; i<naviFrameList.length; i++){
			let naviFrame = naviFrameList[i];
			let naviHead = naviFrame.querySelector(".NavFrame > .NavHead");
			let naviContent = naviFrame.querySelector(".NavFrame > .NavContent");
			if(!(naviHead && naviContent && naviHead.nextElementSibling && naviHead.nextElementSibling.isEqualNode(naviContent)) ){
				continue;
			}
			let display = naviContent.style.display;
			if (display == "none") display = "block";
			naviContent.setAttribute("data-display", display);
			naviHead.addEventListener("click", (e)=>{
				if(naviContent.style.display != "none"){
					naviContent.style.display = "none";
				}
				else {
					naviContent.style.display = naviContent.getAttribute("data-display");
				}
			});
			naviContent.style.display = "none";
		}
		return node;
	}

	function apiResponseError(e){
		function after(content){
			apiBodyNode.appendChild(content);
			linkListNode.classList.remove(CSS_PREFIX+"-loading");
		}
		clearApiTitle();
		let content = document.createElement("div");
		if( e.error == API_WHITE_SPACE_ERROR ){
			setApiErrorMessage(e.text);
			content.innerText = ponyfill.i18n.getMessage("htmlWhiteSpaceLimitation");
			after(content);
			return;
		}
		if( e.error == API_TEXT_MAX_LENGTH_ERROR ){
			setApiErrorMessage(e.text);
			content.innerText = ponyfill.i18n.getMessage("htmlMaxLengthLimitation",[API_TEXT_MAX_LENGTH]);
			after(content);
			return;
		}
		if(!isActiveApiRequestQueue(this)) return;
		if(e && ( e instanceof Object) && e.hasOwnProperty("error")){
			if( e.error == PAGE_NOT_FOUND_ERROR ){
				setApiErrorMessage(e.text);
				content.innerText = ponyfill.i18n.getMessage("htmlPageNotFound");
				after(content);
				return;
			}
			else if( e.error == CONNECTION_ERROR ){
				setApiErrorMessage(e.text);
				content.innerText = ponyfill.i18n.getMessage("htmlConnectionError",[e.code]);
				after(content);
				return;
			}
			else if( e.error == SERVER_ERROR ){
				setApiErrorMessage(e.text);
				content.innerText = ponyfill.i18n.getMessage("htmlServerError",[e.code]);
				after(content);
				return;
			}
			else if( e.error == APPLICATION_ERROR ){
				setApiErrorMessage(e.text);
				content.innerText = ponyfill.i18n.getMessage("htmlApplicationError",[e.code]);
				after(content);
				return;
			}
		}
		console.error(e);
		setApiErrorMessage(e.text);
		content.innerText = ponyfill.i18n.getMessage("htmlUnexpectedError",[e.toString()]);
		after(content);
		return;
	}

	function show(node){
		node.classList.remove(CSS_PREFIX+"-hide");
	}

	function hide(node){
		node.classList.add(CSS_PREFIX+"-hide");
	}

	function isShown(node){
		return !node.classList.contains(CSS_PREFIX+"-hide");
	}

	function apiSwitchBehavior(e){
		if(!isApiSwitchOn()){
			setApiSwitch(API_SWITCH_ENABLED);
			saveApiSwitch(API_SWITCH_ENABLED).catch( onSaveError );
			apiRequest(getSelectedText());
		}
		else {
			setApiSwitch(API_SWITCH_DISABLED);
			saveApiSwitch(API_SWITCH_DISABLED).catch( onSaveError );
		}
	}

	function setApiSwitch(value){
		if(value != API_SWITCH_ENABLED){
			apiSwitcheNode.removeAttribute("data-checked");
			linkListNode.classList.add(CSS_PREFIX+"-apiDisabled");
		}
		else {
			apiSwitcheNode.setAttribute("data-checked", API_SWITCH_ENABLED);
			linkListNode.classList.remove(CSS_PREFIX+"-apiDisabled");
		}
	}

	function isApiSwitchOn(){
		return ( apiSwitcheNode.getAttribute("data-checked") == API_SWITCH_ENABLED );
	}

	function saveApiSwitch(value){
		windowId = Math.random();
		return ponyfill.runtime.sendMessage({
			"method": "saveApiSwitch",
			"data": {
				"w": windowId,
				"sw": value
			}
		});
	}

	function isEnableApi(){
		return ( hasServiceCode() && isApiSwitchOn() );
	}

	function moveWidgetMousePonit(e){
		linkListNodeTop = e.pageY - moveObj.dy;
		linkListNodeLeft = e.pageX - moveObj.dx;
		moveWidget();
	}

	function moveWidget(){
		linkListNode.style.top = linkListNodeTop+"px";
		linkListNode.style.left = linkListNodeLeft+"px";
	}

	function saveHistoryWiktionaryLinkage(){
		return saveHistory(
			apiTitleNode.getAttribute("data-text"),
			window.location.toString(),
			document.title.toString(),
			apiTitleNode.href,
			apiTitleNode.getAttribute("data-title"),
			true
		).catch(onSaveError);
	}

})();
