(() => {
	const JP_FROM = [
		"０","１","２","３","４","５","６","７","８","９",
		"Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ",
		"ａ","ｂ","ｃ","ｄ","ｅ","ｆ","ｇ","ｈ","ｉ","ｊ","ｋ","ｌ","ｍ","ｎ","ｏ","ｐ","ｑ","ｒ","ｓ","ｔ","ｕ","ｖ","ｗ","ｘ","ｙ","ｚ",
		"ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾁﾞ","ﾂﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ",
		"ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ","ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ",
		"ﾊ","ﾋ","ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ",
		"ｧ","ｨ","ｩ","ｪ","ｫ","ｯ","ｬ","ｭ","ｮ","｡","｢","｣","､","･","ｰ",
		"！","”","＃","＄","％","＆","’","（","）","＊","＋","，","−","．","／",
		"：","；","＜","＝","＞","？","＠","［","￥","＼","］","＾","＿","｀","｛","｜","｝","〜"
	];
	const JP_TO = [
		"0","1","2","3","4","5","6","7","8","9",
		"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
		"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
		"ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","セ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ",
		"ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ",
		"ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン",
		"ァ","ィ","ゥ","ェ","ォ","ッ","ャ","ュ","ョ","。","「","」","、","・","ー",
		"!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/",
		":",";","<","=",">","?","@","[","\\","\\","]","^","_","`","{","|","}","~"
	];
	const SPACE_REGEX = new RegExp(/\s+/,"g");
	const SINGLE_SPACE = " ";
	const PRESET_SEARCH_DELAY = 500;
	let presetNode = document.querySelector("#preset");
	let tableNode = document.querySelector("#table");
	let cellPrototypeNode = document.querySelector("#cellPrototype");
	let presetSearchNode = document.querySelector("#presetSearchText");
	let language;
	let languageJson = {};
	let presetSearchQueue = [];

	Promise.resolve().then( initPreset ).catch( unexpectedError );

	function initPreset(){
		initI18n();
		initNode();
		initListener();
	}

	function initI18n(){
		let list = [
			{ "selector": ".filterText", "property": "innerText", "key": "htmlFilterText" },
			{ "selector": "#languageFilter option[value=\"\"]", "property": "innerText", "key": "htmlLanguageAll" },
			{ "selector": "#languageFilter option[value=en]", "property": "innerText", "key": "htmlLanguageEn" },
			{ "selector": "#languageFilter option[value=ja]", "property": "innerText", "key": "htmlLanguageJa" },
			{ "selector": "#languageFilter option[value=zh]", "property": "innerText", "key": "htmlLanguageZh" },
			{ "selector": ".addPreset", "property": "innerText", "key": "htmlAddPresetButtonName" },
			{ "selector": ".presetSearchText", "property": "placeholder", "key": "htmlPresetSearchKeyword" },
			{ "selector": ".presetClearSearchButton", "property": "innerText", "key": "htmlPresetClearSearchButton" }
		];
		setI18n(list);
	}

	function initNode(){
		language = ponyfill.i18n.getUILanguage();
		let matcher = language.match("^(.+?)-");
		if ( matcher ) language = matcher[1];
		for(let i=0; i<PRESET_OPTION_LIST.length; i++){
			let option = PRESET_OPTION_LIST[i];
			let node = cellPrototypeNode.cloneNode(true);
			node.removeAttribute("id");
			node.setAttribute("data-language",option["la"]);
			node.querySelector(".label").innerText = option["l"];
			node.querySelector(".url").innerText = option["u"];
			if(option.hasOwnProperty("aside")) {
				let aside = node.querySelector(".presetAside");
				aside.innerText = option["aside"];
				show(aside);
			}
			node.addEventListener("click",checkPreset);
			tableNode.appendChild(node);
			languageJson[option["la"]] = true;
		}
		if(languageJson.hasOwnProperty(language)){
			presetNode.querySelector("#languageFilter").value = language;
		}
		languageFilter(language);
	}

	function initListener(){
		presetNode.addEventListener("click", presetBehavior);
		presetNode.querySelector("#languageFilter").addEventListener("change", languageFilterBehavior);
		presetSearchNode.addEventListener("input", presetSearchInput);
	}

	function presetBehavior(e){
		let cassList = e.target.classList;
		if(cassList.contains("addPreset")){
			if ( !checkPrestLength() ) {
				onCheckPresetLengthError();
				return ;
			}
			addPreset();
		}
		else if(cassList.contains("presetClearSearchButton")){
			presetClearSearch();
		}
	}

	function presetClearSearch(){
		presetSearchNode.value = "";
		presetSearchQueue = [];
		presetRemoveCellHide();
	}

	function presetRemoveCellHide(){
		let list = tableNode.querySelectorAll(".checkWrapper.cell-hide");
		for(let i=0; i<list.length; i++){
			list[i].classList.remove("cell-hide");
		}
	}

	function reduceSpace(text){
		return text.replace(SPACE_REGEX, SINGLE_SPACE).trim();
	}

	function commonize(text){
		for( let i=0; i<JP_FROM.length; i++ ){
			while(-1 < text.indexOf(JP_FROM[i])){
				text = text.replace(JP_FROM[i], JP_TO[i]);
			}
		}
		text = text.toLowerCase();
		return text;
	}

	function presetSearchInput(){
		let tmp = reduceSpace(presetSearchNode.value);
		if ( tmp.length == 0 ) {
			presetRemoveCellHide();
			return;
		}
		presetSearchQueue.push(presetSearchNode.value);
		setTimeout(()=>{
			if( presetSearchQueue.length <= 0 ) return;
			let text = presetSearchQueue.shift();
			if( presetSearchQueue.length <= 0 ) {
				presetRemoveCellHide();
				presetSearch(text);
			}
		},PRESET_SEARCH_DELAY);
	}

	function presetSearch(text){
		text = commonize(reduceSpace(text));
		let texts = text.split(SINGLE_SPACE);
		let nodes = tableNode.querySelectorAll(".checkWrapper:not(.hide)");
		for(let i=0; i<nodes.length; i++){
			let node = nodes[i];
			let content = commonize(node.innerText);
			for( let j=0; j<texts.length; j++){
				let word = texts[j];
				if ( content.indexOf(word) <= -1 ){
					node.classList.add("cell-hide");
					break;
				}
			}
		}
	}

	function languageFilterBehavior(e){
		languageFilter(e.target.value);
		presetSearch(presetSearchNode.value);
	}

	function languageFilter(language){
		let list = tableNode.querySelectorAll(".checkWrapper");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			show(node);
		}
		if ( !language || !languageJson.hasOwnProperty(language) ) {
			return;
		}
		list = tableNode.querySelectorAll(".checkWrapper:not([data-language~=\""+language+"\"])");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			hide(node);
		}
	}

	function checkPrestLength(){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		return checkFieldLength(list.length);
	}

	function onCheckPresetLengthError(){
		let sum = ""+0;
		let list = containerNode.querySelectorAll(".field");
		if( list ) sum = list.length;
		let remaining = MAX_FIELD - sum;
		let list2 = tableNode.querySelectorAll(".checkbox:checked");
		let sum2 = 0;
		if( list2 ) sum2 = list2.length;
		return notice( ponyfill.i18n.getMessage("htmlCheckPresetLengthError", [ MAX_FIELD, sum, sum2, remaining ] ));
	}

	function addPreset(e){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			let checkWrapperNode = node.closest(".checkWrapper");
			let label = checkWrapperNode.querySelector(".label").innerText;
			let p = checkWrapperNode.querySelector(".url").innerText;
			addNewField(true, true, label, p);
		}
		let promise = saveOption();
		resetPreset();
		resetSort();
		showForm();
		smoothScroll();
	}

	function checkPreset(e){
		if( e.target.tagName == "INPUT" ) {
			/* input type="checkbox" */
			return;
		}
		let checkboxNode = this.querySelector(".checkbox");
		checkboxNode.checked = !checkboxNode.checked;
	}

	function resetPreset(){
		let list = tableNode.querySelectorAll(".checkbox:checked");
		for(let i=0; i<list.length; i++){
			let node = list[i];
			node.checked = false;
		}
	}

})();
