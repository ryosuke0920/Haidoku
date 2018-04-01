(function(){
  let config = {
    options: [
      {
        id: "AddingURL2ContextMenu-id-1",
        title: "search by dictionary.cambridge.org",
        contexts: ["selection"],
        url: "https://dictionary.cambridge.org/search/english/direct/?q=$1"
      },
      {
        id: "AddingURL2ContextMenu-id-2",
        title: "search by another site.",
        contexts: ["selection"],
        url: "https://www.yahoo.co.jp/$1"
      }
    ]
  };

  for(let i=0; i<config["options"].length; i++){
    let item = config.options[i];
    browser.contextMenus.create({
      id: item["id"],
      title: item["title"],
      contexts: item["contexts"]
    });
  }

  browser.contextMenus.onClicked.addListener(function(info, tab) {
    for(let i=0; i<config["options"].length; i++){
      let item = config.options[i];
      if( info.menuItemId == item["id"] ) {
        gotoSite(item["url"],info.selectionText);
      }
    }
  });

  function gotoSite(url,text){
    url = url.replace("$1", text);
    console.log('url='+url);
    browser.tabs.create({url: url});
  }

})();
