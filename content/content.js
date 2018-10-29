(()=>{
	let body = document.querySelector("body");
	if( !body ) return;

	const LINK_NODE_DEFAULT_HEIGHT = 200;
	const LINK_NODE_DEFAULT_WIDTH = 320;
	const LINK_NODE_MIN_HEIGHT = 50;
	const LINK_NODE_MIN_WIDTH = 50;
	const SCROLL_SPACE = 17;
	const RECT_SPACE = 3;
	const ANCHOR_DEFAULT_SIZE = 0.8;
	const ANCHOR_MAX_SIZE = 2;
	const ANCHOR_MIN_SIZE = 0.6;
	const ANCHOR_RESIO = 0.1;
	const REMOVE_SPACE_REGEX = new RegExp( /(?:\s|\|)+/, "g" );
	const LINK_LIST_CLOSE_TIME = 500;
	const API_QUERY_DERAY = 1000;
	const API_TEXT_MAX_LENGTH = 255;
	const API_TEXT_MAX_LENGTH_ERROR = "max length error";
	const FOOTER_CONTENT = "Provided by Wiktionary under Creative Commons Attribution-Share Alike 3.0";//https://www.mediawiki.org/wiki/API:Licensing
	const FOOTER_CONTENT2 = "Provided by Wikipedia under Creative Commons Attribution-Share Alike 3.0";//https://www.mediawiki.org/wiki/API:Licensing

	let dlModel = new domainListModel();
	let weModel = new widgetEnableModel();
	let wikipediaRequestStatus;
	let wiktionaryRequestStatus;

	let enableWidgetValue;
	let domainList;

	let rootNode;
	let widgetNode;
	let coverNode;
	let menuNode;
	let containerNode;
	let footerNode;
	let apiContentNode;
	let wikipediaContent;
	let apiTitleNode;
	let apiErrorMessageNode;
	let apiBodyNode;
	let wiktionaryContent;
	let apiTitleNode2;
	let apiErrorMessageNode2;
	let apiBodyNode2;
	let apiSwitcheNode;
	let arrowNode;
	let historyButtoneNode;
	let historyDoneButtoneNode;
	let historyButtoneNode2;
	let historyDoneButtoneNode2;
	let widgetNodeTop = 0;
	let widgetNodeLeft = 0;
	let widgetNodeHeight = LINK_NODE_DEFAULT_HEIGHT;
	let widgetNodeWidth = LINK_NODE_DEFAULT_WIDTH;
	let widgetScrollTopTmp = 0;
	let widgetScrollleftTmp = 0;
	let linkListAction = LINK_LIST_ACTION_MOUSECLICK;
	let optionList = [];
	let linkListFlag = false;
	let shiftKeyFlag = false;
	let ctrlKeyFlag = false;
	let linkListStyle;
	let faviconDisplay;
	let linknListDirection;
	let linknListSeparator;
	let apiSwitchFlag;
	let resizeWatcherFlag = false;
	let anchorSize = ANCHOR_DEFAULT_SIZE;
	let mousedownFlag = false;
	let selectionChangedFlag = false;
	let faviconCache = {};
	let serviceCode = API_SERVICE_CODE_NONE;
	let serviceCode2 = API_SERVICE_CODE_NONE;
	let languageFilter = [];
	let apiCutOut = true;
	let windowId = Math.random();
	let moveObj;
	let innerSelectionFlag = false;

	start().then(()=>{
		ponyfill.storage.onChanged.addListener( onStorageChanged );
		ponyfill.runtime.onMessage.addListener( notify );
	});

	function start(){
		return Promise.resolve().then(getConfig).then(gotConfig).catch(onReadError);
	}

	function initWidget(){
		rootNode = document.createElement("div");
		rootNode.setAttribute("style","all: initial;");
		rootNode.style.position = "absolute";
		rootNode.style.top = "0";
		rootNode.style.left = "0";
		body.appendChild(rootNode);
		let shadow = rootNode.attachShadow({"mode": "open"});

		widgetNode = document.createElement("div");
		widgetNode.style.padding = LINK_NODE_PADDING + "px";
		widgetNode.setAttribute("id",CSS_PREFIX+"-widget");
		hide(widgetNode);
		shadow.appendChild(widgetNode);

		let style = document.createElement("style");
		style.textContent = WIDGET_STYLE;
		widgetNode.appendChild(style)

		menuNode = document.createElement("nav");
		menuNode.setAttribute("id",CSS_PREFIX+"-menu");
		widgetNode.appendChild(menuNode);

		let linkListGridNode = document.createElement("div");
		linkListGridNode.setAttribute("id",CSS_PREFIX+"-grid");
		widgetNode.appendChild(linkListGridNode);

		footerNode = document.createElement("div");
		footerNode.setAttribute("id",CSS_PREFIX+"-footer");
		widgetNode.appendChild(footerNode);

		coverNode = document.createElement("div");
		coverNode.setAttribute("id",CSS_PREFIX+"-cover");
		coverNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/icon30.png")+")";
		widgetNode.appendChild(coverNode);

		containerNode = document.createElement("ul");
		containerNode.setAttribute("id",CSS_PREFIX+"-container");
		linkListGridNode.appendChild(containerNode);

		let blankNode = document.createElement("div");
		blankNode.setAttribute("id",CSS_PREFIX+"-blank");
		linkListGridNode.appendChild(blankNode);

		apiContentNode = document.createElement("div");
		apiContentNode.setAttribute("id",CSS_PREFIX+"-apiContent");
		linkListGridNode.appendChild(apiContentNode);

		let apiHeaderNode = document.createElement("div");
		apiHeaderNode.setAttribute("id",CSS_PREFIX+"-apiHeader");
		apiContentNode.appendChild(apiHeaderNode);

		apiSwitcheNode = document.createElement("span");
		apiSwitcheNode.setAttribute("id",CSS_PREFIX+"-apiSwitch");
		apiSwitcheNode.classList.add(CSS_PREFIX+"-checkboxButton");
		apiHeaderNode.appendChild(apiSwitcheNode);

		let apiSwitcheCircleNode = document.createElement("span");
		apiSwitcheCircleNode.classList.add(CSS_PREFIX+"-circle");
		apiSwitcheNode.appendChild(apiSwitcheCircleNode);

		let w1ButtonNode = document.createElement("span");
		w1ButtonNode.setAttribute("id",CSS_PREFIX+"-wiktionaryButton");
		w1ButtonNode.classList.add(CSS_PREFIX+"-textButton");
		w1ButtonNode.title = w1ButtonNode.innerText = "Wiktionary";
		apiHeaderNode.appendChild(w1ButtonNode);

		let w2ButtonNode = document.createElement("span");
		w2ButtonNode.setAttribute("id",CSS_PREFIX+"-wikipediaButton");
		w2ButtonNode.classList.add(CSS_PREFIX+"-textButton");
		w2ButtonNode.title = w2ButtonNode.innerText = "Wikipedia";
		apiHeaderNode.appendChild(w2ButtonNode);

		let apiOffNode = document.createElement("div");
		apiOffNode.setAttribute("id",CSS_PREFIX+"-apiOff");
		apiOffNode.innerHTML = ponyfill.i18n.getMessage("htmlLinkageMessage");
		apiContentNode.appendChild(apiOffNode);

		wiktionaryContent = document.createElement("div");
		wiktionaryContent.setAttribute("id",CSS_PREFIX+"-wiktionaryContent");
		wiktionaryContent.setAttribute("class",CSS_PREFIX+"-wikiContent");
		apiContentNode.appendChild(wiktionaryContent);

		let apiLoadingNode = document.createElement("div");
		apiLoadingNode.classList.add(CSS_PREFIX+"-apiLoading");
		wiktionaryContent.appendChild(apiLoadingNode);

		let apiLoadingContentNode = document.createElement("div");
		apiLoadingContentNode.classList.add(CSS_PREFIX+"-apiLoadingContent");
		apiLoadingContentNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/circle.svg")+")";
		apiLoadingNode.appendChild(apiLoadingContentNode);

		let apiTitleBoxNode = document.createElement("h1");
		apiTitleBoxNode.classList.add(CSS_PREFIX+"-apiTitleBox");
		wiktionaryContent.appendChild(apiTitleBoxNode);

		historyButtoneNode = document.createElement("span");
		historyButtoneNode.setAttribute("id",CSS_PREFIX+"-history");
		historyButtoneNode.classList.add(CSS_PREFIX+"-buttonIcon");
		historyButtoneNode.classList.add(CSS_PREFIX+"-historyButton");
		historyButtoneNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/history.svg")+")";
		historyButtoneNode.title = ponyfill.i18n.getMessage("htmlSaveHistory");
		apiTitleBoxNode.appendChild(historyButtoneNode);

		historyDoneButtoneNode = document.createElement("span");
		historyDoneButtoneNode.setAttribute("id",CSS_PREFIX+"-historyDone");
		historyDoneButtoneNode.classList.add(CSS_PREFIX+"-buttonIcon");
		historyDoneButtoneNode.classList.add(CSS_PREFIX+"-historyButton");
		historyDoneButtoneNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/done.svg")+")";
		historyDoneButtoneNode.title = ponyfill.i18n.getMessage("htmlSaveHistoryDone");
		apiTitleBoxNode.appendChild(historyDoneButtoneNode);

		apiTitleNode = document.createElement("a");
		apiTitleNode.setAttribute("id",CSS_PREFIX+"-apiTitle");
		apiTitleNode.setAttribute("rel","noreferrer");
		apiTitleNode.setAttribute("target","_blank");
		apiTitleBoxNode.appendChild(apiTitleNode);

		apiErrorMessageNode = document.createElement("span");
		apiErrorMessageNode.setAttribute("id",CSS_PREFIX+"-apiErrorMessage");
		apiTitleBoxNode.appendChild(apiErrorMessageNode);

		apiBodyNode = document.createElement("div");
		apiBodyNode.setAttribute("id",CSS_PREFIX+"-apiBody");
		apiBodyNode.setAttribute("class",CSS_PREFIX+"-apiWikiText");
		wiktionaryContent.appendChild(apiBodyNode);

		wikipediaContent = document.createElement("div");
		wikipediaContent.setAttribute("id",CSS_PREFIX+"-wikipediaContent");
		wikipediaContent.setAttribute("class",CSS_PREFIX+"-wikiContent");
		apiContentNode.appendChild(wikipediaContent);

		let apiLoadingNode2 = document.createElement("div");
		apiLoadingNode2.classList.add(CSS_PREFIX+"-apiLoading");
		wikipediaContent.appendChild(apiLoadingNode2);

		let apiLoadingContentNode2 = document.createElement("div");
		apiLoadingContentNode2.classList.add(CSS_PREFIX+"-apiLoadingContent");
		apiLoadingContentNode2.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/circle.svg")+")";
		apiLoadingNode2.appendChild(apiLoadingContentNode2);

		let apiTitleBoxNode2 = document.createElement("h1");
		apiTitleBoxNode2.classList.add(CSS_PREFIX+"-apiTitleBox");
		wikipediaContent.appendChild(apiTitleBoxNode2);

		historyButtoneNode2 = document.createElement("span");
		historyButtoneNode2.setAttribute("id",CSS_PREFIX+"-history2");
		historyButtoneNode2.classList.add(CSS_PREFIX+"-buttonIcon");
		historyButtoneNode2.classList.add(CSS_PREFIX+"-historyButton");
		historyButtoneNode2.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/history.svg")+")";
		historyButtoneNode2.title = ponyfill.i18n.getMessage("htmlSaveHistory");
		apiTitleBoxNode2.appendChild(historyButtoneNode2);

		historyDoneButtoneNode2 = document.createElement("span");
		historyDoneButtoneNode2.setAttribute("id",CSS_PREFIX+"-historyDone2");
		historyDoneButtoneNode2.classList.add(CSS_PREFIX+"-buttonIcon");
		historyDoneButtoneNode2.classList.add(CSS_PREFIX+"-historyButton");
		historyDoneButtoneNode2.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/done.svg")+")";
		historyDoneButtoneNode2.title = ponyfill.i18n.getMessage("htmlSaveHistoryDone");
		apiTitleBoxNode2.appendChild(historyDoneButtoneNode2);

		apiTitleNode2 = document.createElement("a");
		apiTitleNode2.setAttribute("id",CSS_PREFIX+"-apiTitle2");
		apiTitleNode2.setAttribute("rel","noreferrer");
		apiTitleNode2.setAttribute("target","_blank");
		apiTitleBoxNode2.appendChild(apiTitleNode2);

		apiErrorMessageNode2 = document.createElement("span");
		apiErrorMessageNode2.setAttribute("id",CSS_PREFIX+"-apiErrorMessage2");
		apiTitleBoxNode2.appendChild(apiErrorMessageNode2);

		apiBodyNode2 = document.createElement("div");
		apiBodyNode2.setAttribute("id",CSS_PREFIX+"-apiBody2");
		apiBodyNode2.setAttribute("class",CSS_PREFIX+"-apiWikiText");
		wikipediaContent.appendChild(apiBodyNode2);

		clearApiContent();

		arrowNode = document.createElement("div");
		arrowNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/arrow.svg")+")";
		arrowNode.setAttribute("id", CSS_PREFIX+"-move");
		arrowNode.classList.add(CSS_PREFIX+"-buttonIcon");
		arrowNode.title = ponyfill.i18n.getMessage("htmlMove");
		menuNode.appendChild(arrowNode);

		let resizeNode = document.createElement("div");
		resizeNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/resize.svg")+")";
		resizeNode.setAttribute("id",CSS_PREFIX+"-resize");
		resizeNode.classList.add(CSS_PREFIX+"-buttonIcon");
		resizeNode.title = ponyfill.i18n.getMessage("htmlResize");
		menuNode.appendChild(resizeNode);

		let zoomDownNode = document.createElement("div");
		zoomDownNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/minus.svg")+")";
		zoomDownNode.setAttribute("id",CSS_PREFIX+"-zoomDown");
		zoomDownNode.classList.add(CSS_PREFIX+"-buttonIcon");
		zoomDownNode.title = ponyfill.i18n.getMessage("htmlZoomDown");
		menuNode.appendChild(zoomDownNode);

		let zoomUpNode = document.createElement("div");
		zoomUpNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/plus.svg")+")";
		zoomUpNode.setAttribute("id",CSS_PREFIX+"-zoomUp");
		zoomUpNode.classList.add(CSS_PREFIX+"-buttonIcon");
		zoomUpNode.title = ponyfill.i18n.getMessage("htmlZoomUp");
		menuNode.appendChild(zoomUpNode);

		let optionNode = document.createElement("div");
		optionNode.style.backgroundImage = "url("+ponyfill.extension.getURL("/image/option.svg")+")";
		optionNode.setAttribute("id",CSS_PREFIX+"-option");
		optionNode.classList.add(CSS_PREFIX+"-buttonIcon");
		optionNode.title = ponyfill.i18n.getMessage("htmloption");
		menuNode.appendChild(optionNode);

		applyZoomLinkList();
		applyLinkListSize();
		applyLinkListStyle();
		applyLinkListAction();
		applyFaviconDisplay();
		applyLinknListDirection();
		applyLinknListSeparator();
		applyApiSwitch();
		applyServiceCode();

		if (serviceCode != API_SERVICE_CODE_NONE){
			widgetNode.classList.add(CSS_PREFIX+"-selectWiktionary");
		}
		else if ( serviceCode2 != API_SERVICE_CODE_NONE ){
			widgetNode.classList.add(CSS_PREFIX+"-selectWikipedia");
		}

		wikipediaRequestStatus = new requestStatusModel();
		wiktionaryRequestStatus = new requestStatusModel();

		resetLinkListEvents();
		addCommonLinkListEvents();
	}

	function addCommonLinkListEvents(){
		widgetNode.addEventListener("click", menuClickBihavior);
		document.addEventListener("keydown", keydownBehavior);
		document.addEventListener("mousemove", mousemoveBehavior);
		document.addEventListener("mouseup", mouseupCommonBehavior);
		widgetNode.addEventListener("mousedown", mousedownCommonBehavior);
		document.addEventListener("mousedown", mousedownOuterBehavior);
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
		innerSelectionFlag = selection.containsNode(widgetNode, true);
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
		apiRequest(text);
	}

	function mousedownOuterBehavior(e){
		if( e.button != 0 ) return;
		mousedownFlag = true;
	}

	function mousedownCommonBehavior(e){
		if( e.button != 0 ) return;
		if ( e.target == arrowNode ) {
			moveObj = {
				"dy": e.pageY - widgetNodeTop,
				"dx": e.pageX - widgetNodeLeft
			};
			return;
		}
	}

	function mousedownAutoBehavior(e){
		if( e.button != 0 ) return;
		if( !isOnWidget(e.pageY, e.pageX) ) {
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

	function isOnWidget(yy,xx){
		if( widgetNodeTop <= yy && yy < ( widgetNodeTop + widgetNode.offsetHeight )
		&& widgetNodeLeft <= xx && xx < ( widgetNodeLeft + widgetNode.offsetWidth ) ){
			return true;
		}
		return false;
	}

	function getLinkListHeight(){
		return widgetNode.offsetHeight - ( 2 * LINK_NODE_PADDING );
	}

	function getLinkListWidth(){
		return widgetNode.offsetWidth - ( 2 * LINK_NODE_PADDING );
	}

	function resizeWatcher(){
		switchWatchFlag()
	}

	function switchWatchFlag(){
		let height = getLinkListHeight();
		let width = getLinkListWidth();
		if ( widgetNodeHeight != height || widgetNodeWidth != width ){
			resizeWatcherFlag = true;
			if ( height < LINK_NODE_MIN_HEIGHT ) height = LINK_NODE_MIN_HEIGHT;
			if ( width < LINK_NODE_MIN_WIDTH ) width = LINK_NODE_MIN_WIDTH;
			widgetNodeHeight = height;
			widgetNodeWidth = width;
		}
	}
	function setFaviconDisplay(res){
		faviconDisplay = res;
	}
	function applyFaviconDisplay(){
		if( faviconDisplay == LINK_LIST_FAVICON_ONLY ) {
			widgetNode.classList.add(CSS_PREFIX+"-mini");
		}
		else {
			widgetNode.classList.remove(CSS_PREFIX+"-mini");
		}
	}
	function setLinknListDirection(res){
		linknListDirection = res;
	}
	function applyLinknListDirection(){
		if( linknListDirection == LINK_LIST_DIRECTION_HORIZAONTAL ) {
			widgetNode.classList.add(CSS_PREFIX+"-inline");
		}
		else {
			widgetNode.classList.remove(CSS_PREFIX+"-inline");
		}
	}
	function setLinknListSeparator(res){
		linknListSeparator = res;
	}
	function applyLinknListSeparator(){
		if( linknListSeparator == LINK_LIST_SEPARATOR_VERTICAL ) {
			widgetNode.classList.add(CSS_PREFIX+"-separator");
		}
		else {
			widgetNode.classList.remove(CSS_PREFIX+"-separator");
		}
	}
	function applyServiceCode(){
		widgetNode.classList.remove(CSS_PREFIX+"-enableWiktionary");
		widgetNode.classList.remove(CSS_PREFIX+"-enableWikipedia");
		widgetNode.classList.remove(CSS_PREFIX+"-selectWikipedia");
		widgetNode.classList.remove(CSS_PREFIX+"-selectWiktionary");
		if( serviceCode == API_SERVICE_CODE_NONE && serviceCode2 == API_SERVICE_CODE_NONE ) {
			hide(apiContentNode);
		}
		else {
			if( serviceCode != API_SERVICE_CODE_NONE ){
				widgetNode.classList.add(CSS_PREFIX+"-enableWiktionary");
			}
			if( serviceCode2 != API_SERVICE_CODE_NONE ){
				widgetNode.classList.add(CSS_PREFIX+"-enableWikipedia");
			}
			if( serviceCode == API_SERVICE_CODE_NONE && serviceCode2 != API_SERVICE_CODE_NONE ){
				widgetNode.classList.add(CSS_PREFIX+"-selectWikipedia");
				footerNode.innerText = footerNode.title = FOOTER_CONTENT2;
			}
			else {
				widgetNode.classList.add(CSS_PREFIX+"-selectWiktionary");
				footerNode.innerText = footerNode.title = FOOTER_CONTENT;
			}
			show(apiContentNode);
		}
	}

	function saveLinkListSize(){
		return ponyfill.runtime.sendMessage({
			"method": "saveLinkListSize",
			"data": {
				"lh": widgetNodeHeight,
				"lw": widgetNodeWidth
			}
		});
	}

	function closeLinkList(){
		resetScrollTmp();
		hide(widgetNode);
		wiktionaryRequestStatus.abort();
		wikipediaRequestStatus.abort();
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
		widgetNode.setAttribute("data-selected-text", text);
	}

	function getSelectedText(){
		return widgetNode.getAttribute("data-selected-text");
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
		resizeWidget(widgetNodeHeight, widgetNodeWidth)
	}

	function resizeWidget(height, width){
		widgetNode.style.height = height + "px";
		widgetNode.style.width = width + "px";
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
		show(widgetNode);
		let rect = getSelectionRect();
		if(!rect) throw( new Error("Rect not found.") );
		widgetNodeLeft = makeWidgetPointX(rect);
		widgetNodeTop = makeWidgetPointY(rect);
		moveWidget();
		scrollWidget(0,0);
	}

	function makeWidgetPointX(rect){
		let clientX = rect.right;
		let pageX = window.scrollX + clientX;
		let viewPortWidth = window.innerWidth - SCROLL_SPACE;
		if ( viewPortWidth < widgetNode.offsetWidth ){
			return window.scrollX;
		}
		if ( (clientX + widgetNode.offsetWidth + RECT_SPACE) <= viewPortWidth){
			return pageX + RECT_SPACE;
		}
		return window.scrollX + viewPortWidth - widgetNode.offsetWidth;
	}

	function makeWidgetPointY(rect){
		let clientY = rect.bottom;
		let pageY = window.scrollY + clientY;
		let viewPortHeight = window.innerHeight - SCROLL_SPACE;
		if ( viewPortHeight < widgetNode.offsetHeight ){
			return pageY + RECT_SPACE;
		}
		if ( (clientY + RECT_SPACE + widgetNode.offsetHeight) <=  viewPortHeight ){
			return pageY + RECT_SPACE;
		}
		yy = rect.top - widgetNode.offsetHeight - RECT_SPACE;
		if ( 0 <= yy) {
			return window.scrollY + yy;
		}
		return pageY + RECT_SPACE;
	}

	function isLinkListShown(){
		return isShown(widgetNode);
	}

	function onStorageChanged(change){
		if(change.hasOwnProperty("e")){
			setEnableWidgetValue(change.e.newValue);
			if( weModel.isDisable(enableWidgetValue) ){
				if( isEnableWidget() ) disableWidget();
			}
			else if( weModel.isEnable(enableWidgetValue) ){
				if( !isEnableWidget() ) enableWidget();
			}
			else {
				if( dlModel.isAllowedCurrentDomain(domainList) ){
					if( !isEnableWidget() ) enableWidget();
				}
				else {
					if( isEnableWidget() ) disableWidget();
				}
			}
			return;
		}
		if(change.hasOwnProperty("dl")){
			setDomainList(change.dl.newValue);
			if( weModel.isEnableWithDomain(enableWidgetValue) ){
				if( dlModel.isAllowedCurrentDomain(domainList) ){
					if( !isEnableWidget() ) enableWidget();
				}
				else {
					if( isEnableWidget() ) disableWidget();
				}
			}
			return;
		}

		if( !isEnableWidget() ) return;

		if( change["lh"] || change["lw"] ){
			let lh = widgetNodeHeight;
			if( change.hasOwnProperty("lh") ) lh = change["lh"]["newValue"];
			let lw = widgetNodeWidth;
			if( change.hasOwnProperty("lw") ) lw = change["lw"]["newValue"];
			setLinkListSize( lh, lw );
			applyLinkListSize();
		}
		if( change["as"] ){
			setAnchorSize( change["as"]["newValue"] );
			applyZoomLinkList();
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
			applyLinkListStyle();
		}
		if( change["ca"] ){
			setLinkListAction( change["ca"]["newValue"] );
			applyLinkListAction();
		}
		if( change["f"] ){
			setFaviconDisplay( change["f"]["newValue"] );
			applyFaviconDisplay();
		}
		if( change["ld"] ){
			setLinknListDirection( change["ld"]["newValue"] );
			applyLinknListDirection();
		}
		if( change["ls"] ){
			setLinknListSeparator( change["ls"]["newValue"] );
			applyLinknListSeparator();
		}
		if( change["s"] || change["wc"] ){
			closeLinkList();
			if (change["s"]) setServiceCode( change["s"]["newValue"] );
			if (change["wc"]) setServiceCode2( change["wc"]["newValue"] );
			applyServiceCode();
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
			applyApiSwitch();
		}
	}
	function isEnableWidget(){
		return rootNode !== undefined;
	}
	function disableWidget(){
		widgetNode.removeEventListener("click", menuClickBihavior);
		widgetNode.removeEventListener("mousedown", mousedownCommonBehavior);
		apiSwitcheNode.removeEventListener("click", apiSwitchBehavior);
		document.removeEventListener("keydown", keydownBehavior);
		document.removeEventListener("mousemove", mousemoveBehavior);
		document.removeEventListener("mouseup", mouseupCommonBehavior);
		document.removeEventListener("mousedown", mousedownOuterBehavior);
		document.removeEventListener("selectionchange", selectionChangeAutoBehavior);
		document.removeEventListener("mouseup", mouseupAutoBehavior);
		document.removeEventListener("mousedown", mousedownAutoBehavior);
		document.removeEventListener("selectionchange", manualSelectionChangeBehavior);
		rootNode.remove();
		rootNode = widgetNode = coverNode = menuNode = containerNode = apiContentNode = apiTitleNode = apiErrorMessageNode = apiBodyNode = apiTitleNode2 = apiErrorMessageNode2 = apiBodyNode2 = apiSwitcheNode = arrowNode = historyButtoneNode = historyDoneButtoneNode = historyButtoneNode2 = historyDoneButtoneNode2 = wiktionaryRequestStatus = wikipediaRequestStatus = undefined;
	}
	function enableWidget(){
		start();
	}
	function setLinkListSize( height=LINK_NODE_DEFAULT_HEIGHT, width=LINK_NODE_DEFAULT_WIDTH ){
		widgetNodeHeight = height;
		widgetNodeWidth = width;
	}

	function getConfig(){
		let sc = getDefaultServiceCode();
		let languageFilter = getDefaultLanguageFilter();
		return ponyfill.storage.sync.get({
			"e": DEFAULT_ENABLE_VALUE,
			"dl": DEFAULT_DOMAIN_LIST,
			"ol": DEFAULT_OPTION_LIST_ON_GET,
			"bf": DEFAULT_AUTO_VIEW_FLAG,
			"sk": DEFAULT_SHIFT_KEY_VIEW_FLAG,
			"ck": DEFAULT_CTRL_KEY_VIEW_FLAG,
			"lh": LINK_NODE_DEFAULT_HEIGHT,
			"lw": LINK_NODE_DEFAULT_WIDTH,
			"as": ANCHOR_DEFAULT_SIZE,
			"cl": LINK_LIST_DEFAULT_STYLE,
			"ca": LINK_LIST_ACTION_MOUSECLICK,
			"f": LINK_LIST_FAVICON_ONLY,
			"ld": LINK_LIST_DIRECTION_VERTICAL,
			"ls": LINK_LIST_SEPARATOR_VERTICAL,
			"sw": API_SWITCH_DISABLED,
			"s": sc,
			"ll": languageFilter,
			"co": DEFAULT_MEANING_VALUE,
			"wc": "w-"+sc
		});
	}
	function gotConfig(res){
		setEnableWidgetValue(res.e);
		setDomainList(res.dl);
		if(weModel.isDisable(enableWidgetValue)) return;
		if(weModel.isEnableWithDomain(enableWidgetValue) && !dlModel.isAllowedCurrentDomain(res.dl)) return;
		return Promise.resolve()
		.then(()=>{ return setVer(res); })
		.then(()=>{ if(hasLinkList()) return getFavicon().then( gotFavicon ); })
		.then( initWidget );
	}
	function setEnableWidgetValue(value){
		enableWidgetValue = value;
	}
	function setDomainList(list){
		domainList = list;
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
		setFaviconDisplay( res["f"] );
		setLinknListDirection( res["ld"] );
		setLinknListSeparator( res["ls"] );
		setApiSwitch( res["sw"] );
		setServiceCode( res["s"] );
		setServiceCode2( res["wc"] );
		setLanguageFilter( res["ll"] );
		setLinkListApiCutOut( res["co"] );
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

	function setServiceCode(res){
		serviceCode = res;
	}
	function setServiceCode2(res){
		serviceCode2 = res;
	}

	function setLanguageFilter(res){
		languageFilter = res;
	}

	function setLinkListApiCutOut(res){
		apiCutOut = res;
	}

	function setLinkListStyle(res){
		linkListStyle = res;
	}

	function applyLinkListStyle(){
		widgetNode.classList.remove(CSS_PREFIX+"-dark");
		if( linkListStyle == LINK_LIST_STYLE_DARK ) {
			widgetNode.classList.add(CSS_PREFIX+"-dark");
		}
	}

	function setLinkListAction(res){
		linkListAction = res;
	}

	function applyLinkListAction(){
		resetScrollTmp();
		widgetNode.classList.remove(CSS_PREFIX+"-mouseover");
		widgetNode.classList.remove(CSS_PREFIX+"-mouseclick");
		removeStopper();
		widgetNode.removeEventListener("mouseenter", removeStopper);
		widgetNode.removeEventListener("mouseleave", controlStopper);
		coverNode.removeEventListener("click", widgetActionMouseclick);
		if( linkListAction == LINK_LIST_ACTION_MOUSEOVER ){
			widgetNode.classList.add(CSS_PREFIX+"-mouseover");
			addStopper();
			widgetNode.addEventListener("mouseenter", removeStopper);
			widgetNode.addEventListener("mouseleave", controlStopper);
		}
		else if( linkListAction == LINK_LIST_ACTION_MOUSECLICK ) {
			widgetNode.classList.add(CSS_PREFIX+"-mouseclick");
			addStopper();
			coverNode.addEventListener("click", widgetActionMouseclick);
		}
	}

	function widgetActionMouseclick(e){
		removeStopper();
		let rect = getSelectionRect();
		if(!rect) throw( new Error("Rect not found.") );
		widgetNodeLeft = makeWidgetPointX(rect);
		widgetNodeTop = makeWidgetPointY(rect);
		moveWidget();
	}

	function controlStopper(e){
		if(!resizeWatcherFlag){
			addStopper();
			widgetScrollTopTmp = widgetNode.scrollTop;
			widgetScrollleftTmp = widgetNode.scrollLeft;
			scrollWidget(0,0);
		}
	}

	function addStopper(){
		widgetNode.classList.add(CSS_PREFIX+"-stopper");
	}

	function removeStopper(e){
		if(!hasStopper())return;
		scrollWidget(widgetScrollTopTmp, widgetScrollleftTmp);
		widgetNode.classList.remove(CSS_PREFIX+"-stopper");
	}

	function hasStopper(){
		return widgetNode.classList.contains(CSS_PREFIX+"-stopper");
	}

	function resetScrollTmp(){
		widgetScrollTopTmp = widgetScrollleftTmp = 0;
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
			Promise.resolve().then(()=>{return saveHistoryWiktionaryLinkage(apiTitleNode)}).catch(onSaveError);
		}
		else if(id == CSS_PREFIX+"-history2"){
			hide(historyButtoneNode2);
			show(historyDoneButtoneNode2);
			Promise.resolve().then(()=>{return saveHistoryWiktionaryLinkage(apiTitleNode2)}).catch(onSaveError);
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
		else if(id == CSS_PREFIX+"-wiktionaryButton"){
			widgetNode.classList.remove(CSS_PREFIX+"-selectWikipedia");
			widgetNode.classList.add(CSS_PREFIX+"-selectWiktionary");
			footerNode.innerText = FOOTER_CONTENT;
		}
		else if(id == CSS_PREFIX+"-wikipediaButton"){
			widgetNode.classList.add(CSS_PREFIX+"-selectWikipedia");
			widgetNode.classList.remove(CSS_PREFIX+"-selectWiktionary");
			footerNode.innerText = FOOTER_CONTENT2;
		}
	}

	function resetSize(height,width){
		widgetNodeHeight = height;
		widgetNodeWidth = width;
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
		let list = containerNode.querySelectorAll("span."+CSS_PREFIX+"-label");
		for(let i=0; i<list.length; i++){
			setFontSize(list[i], anchorSize);
		}
		list = containerNode.querySelectorAll("img."+CSS_PREFIX+"-favicon");
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

	function notify(e){
		if(e.method == "updateFaviconCache") {
			faviconCache = e.data;
		}
	}

	function apiRequest(text){
		clearApiContent();
		text = text.replace(REMOVE_SPACE_REGEX," ").trim();
		if( serviceCode != API_SERVICE_CODE_NONE ) apiWiktionaryRequest(text);
		if( serviceCode2 != API_SERVICE_CODE_NONE ) apiWikipediaRequest(text);
	}

	function apiWiktionaryRequest(text){
		let delay = wiktionaryRequestStatus.hasAnother();
		wiktionaryRequestStatus.abort();
		let obj = {
			"id": wiktionaryRequestStatus.start(),
			"status": wiktionaryRequestStatus,
			"data": {
				"text": text,
				"serviceCode": serviceCode
			},
			"node":{
				"wrapper": wiktionaryContent,
				"title": apiTitleNode,
				"error": apiErrorMessageNode,
				"body": apiBodyNode,
				"history": historyButtoneNode,
				"historyDone": historyDoneButtoneNode
			}
		};
		if( !checkByte(text, API_TEXT_MAX_LENGTH) ){
			obj.data.error = API_TEXT_MAX_LENGTH_ERROR;
			apiResponseError.bind(obj)(obj.data);
			obj.status.done(obj.id);
			return;
		}
		if(!delay) {
			apiRequestStart(obj);
			return;
		}
		setTimeout((e)=>{
			if( !obj.status.isActive(obj.id) ) return;
			apiRequestStart(obj);
		}, API_QUERY_DERAY);

		function apiRequestStart(obj){
			ponyfill.runtime.sendMessage({
				"method": "apiRequest",
				"data": obj.data
			}).then(
				apiWiktionaryResponse.bind(obj)
			).catch(
				apiResponseError.bind(obj)
			).finally(()=>{
				obj.status.done(obj.id);
			});
		}
	}

	function apiWikipediaRequest(text){
		let delay = wikipediaRequestStatus.hasAnother();
		wikipediaRequestStatus.abort();
		let obj = {
			"id": wikipediaRequestStatus.start(),
			"status": wikipediaRequestStatus,
			"data": {
				"text": text,
				"serviceCode": serviceCode2
			},
			"node":{
				"wrapper": wikipediaContent,
				"title": apiTitleNode2,
				"error": apiErrorMessageNode2,
				"body": apiBodyNode2,
				"history": historyButtoneNode2,
				"historyDone": historyDoneButtoneNode2
			}
		};
		if( !checkByte(text, API_TEXT_MAX_LENGTH) ){
			obj.data.error = API_TEXT_MAX_LENGTH_ERROR;
			apiResponseError.bind(obj)(obj.data);
			obj.status.done(obj.id);
			return;
		}
		if(!delay) {
			apiRequestStart(obj);
			return;
		}
		setTimeout((e)=>{
			if( !obj.status.isActive(obj.id) ) return;
			apiRequestStart(obj);
		}, API_QUERY_DERAY);

		function apiRequestStart(obj){
			ponyfill.runtime.sendMessage({
				"method": "apiRequest",
				"data": obj.data
			}).then(
				apiWikipediaResponse.bind(obj)
			).catch(
				apiResponseError.bind(obj)
			).finally(()=>{
				obj.status.done(obj.id);
			});
		}
	}

	function clearApiContent(){
		show(historyButtoneNode);
		hide(historyDoneButtoneNode);
		show(historyButtoneNode2);
		hide(historyDoneButtoneNode2);
		clearChildren(apiBodyNode);
		clearChildren(apiBodyNode2);
		clearApiTitle(apiTitleNode, apiErrorMessageNode);
		clearApiTitle(apiTitleNode2, apiErrorMessageNode2);
		wiktionaryContent.classList.add(CSS_PREFIX+"-loading");
		wikipediaContent.classList.add(CSS_PREFIX+"-loading");
	}

	function clearApiTitle(titleNode, errorNode){
		titleNode.removeAttribute("data-text");
		titleNode.removeAttribute("data-title");
		titleNode.removeAttribute("href");
		titleNode.removeAttribute("title");
		errorNode.removeAttribute("title");
		titleNode.innerText = errorNode.innerText = "";
	}

	function apiWiktionaryResponse(e){
		if( !this.status.isActive(this.id) ) return;
		if( e.hasOwnProperty("error") ) return apiResponseError.bind(this)(e);
		makeApiTitleNode(this.node.title, e.text, e.title, e.fullurl);
		let property = API_SERVICE_PROPERTY[e.service];
		let result = parseHTML(e.html, property.sectionHeading);
		let parsed = result.parsed;
		let bases = result.bases;
		let parseStatus = result.status;
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
						this.node.body.appendChild(makeMessageNode(ponyfill.i18n.getMessage("htmlSectionNotFound")));
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
				header = convertReferer(header);
				this.node.body.appendChild(header);
				for(let i=0; i<bodys.length; i++){
					let obj = bodys[i];
					obj.title = removeSimbol(obj.title);
					obj.title = convertStyle(obj.title);
					obj.title = convertAnchor(obj.title, e.service);
					obj.title = convertReferer(obj.title);
					this.node.body.appendChild(obj.title);
					for(let j=0; j<obj.warnings.length; j++){
						this.node.body.appendChild(obj.warnings[j]);
					}
					obj.content = removeSimbol(obj.content);
					obj.content = convertStyle(obj.content);
					obj.content = convertAudio(obj.content, e.service);
					obj.content = convertAnchor(obj.content, e.service);
					obj.content = convertNaveFrame(obj.content);
					obj.content = convertReferer(obj.content);
					this.node.body.appendChild(obj.content);
				}
			}
		}
		else {
			this.node.body.appendChild(makeMessageNode(ponyfill.i18n.getMessage("htmlParseFailed")));
			for(let i=0; i<bases.length; i++){
				let base = bases[i];
				base = removeSimbol(base);
				base = convertStyle(base);
				base = convertAudio(base, e.service);
				base = convertAnchor(base, e.service);
				base = convertNaveFrame(base);
				base = convertReferer(base);
				this.node.body.appendChild(base);
			}
		}
		this.node.wrapper.classList.remove(CSS_PREFIX+"-loading");
	}

	function apiWikipediaResponse(e){
		if( !this.status.isActive(this.id) ) return;
		if( e.hasOwnProperty("error") ) return apiResponseError.bind(this)(e);
		makeApiTitleNode(this.node.title, e.text, e.title, e.fullurl);
		let bases = makeBaseHTML(e.html);
		for(let i=0; i<bases.length; i++){
			let base = bases[i];
			base = removeSimbol(base);
			base = convertStyle(base);
			base = convertAudio(base, e.service);
			base = convertAnchor(base, e.service);
			base = convertNaveFrame(base);
			base = convertReferer(base);
			this.node.body.appendChild(base);
		}
		this.node.wrapper.classList.remove(CSS_PREFIX+"-loading");
	}

	function makeApiTitleNode(titleNode,text,title,url){
		if( text.toLowerCase() != title.toLowerCase() ) {
			titleNode.innerText = ponyfill.i18n.getMessage("htmlMaybeTitle",[title]);
		}
		else {
			titleNode.innerText = title;
		}
		titleNode.setAttribute("title", title);
		titleNode.setAttribute("data-text", text);
		titleNode.setAttribute("data-title", title);
		titleNode.setAttribute("href", url);
	}

	function makeBaseHTML(htmls){
		let bases = [];
		for(let i=0; i<htmls.length; i++){
			let node = document.createElement("div");
			node.innerHTML = htmls[i];
			bases.push(node);
		}
		return bases;
	}
	function parseHTML(htmls, sectionHeading){
		let parsed = [];
		let bases = makeBaseHTML(htmls);
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
		for(let i=0; i<bases.length; i++){
			let node = bases[i];
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

	function convertReferer(node){
		let list = node.querySelectorAll("[src],[href]");
		for(let i=0; i<list.length; i++){
			list[i].setAttribute("referrerpolicy", "no-referrer");
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
		if(!this.status.isActive(this.id)) return;
		let self = this;
		function after(content){
			hide( self.node.history );
			hide( self.node.historyDone );
			self.node.body.appendChild(content);
			self.node.wrapper.classList.remove(CSS_PREFIX+"-loading");
		}
		function setApiErrorMessage(text){
			self.node.error.innerText = text;
			self.node.error.setAttribute("title", text);
		}
		clearApiTitle(this.node.title, this.node.error);
		let content = document.createElement("div");
		if( e.error == API_TEXT_MAX_LENGTH_ERROR ){
			setApiErrorMessage(e.text);
			content.innerText = ponyfill.i18n.getMessage("htmlMaxLengthLimitation",[API_TEXT_MAX_LENGTH]);
			after(content);
			return;
		}
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
			applyApiSwitch();
			saveApiSwitch(API_SWITCH_ENABLED).catch( onSaveError );
			apiRequest(getSelectedText());
		}
		else {
			setApiSwitch(API_SWITCH_DISABLED);
			applyApiSwitch();
			saveApiSwitch(API_SWITCH_DISABLED).catch( onSaveError );
		}
	}
	function setApiSwitch(res){
		apiSwitchFlag = res;
	}
	function applyApiSwitch(){
		if(apiSwitchFlag != API_SWITCH_ENABLED){
			apiSwitcheNode.removeAttribute("data-checked");
			widgetNode.classList.add(CSS_PREFIX+"-apiDisabled");
		}
		else {
			apiSwitcheNode.setAttribute("data-checked", API_SWITCH_ENABLED);
			widgetNode.classList.remove(CSS_PREFIX+"-apiDisabled");
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
		widgetNodeTop = e.pageY - moveObj.dy;
		widgetNodeLeft = e.pageX - moveObj.dx;
		moveWidget();
	}

	function moveWidget(){
		widgetNode.style.top = widgetNodeTop+"px";
		widgetNode.style.left = widgetNodeLeft+"px";
	}

	function scrollWidget(top, left){
		widgetNode.scrollTop = top;
		widgetNode.scrollLeft = left;
	}

	function saveHistoryWiktionaryLinkage(titleNode){
		return saveHistory(
			titleNode.getAttribute("data-text"),
			window.location.toString(),
			document.title.toString(),
			titleNode.href,
			titleNode.getAttribute("data-title"),
			true
		).catch(onSaveError);
	}

})();
