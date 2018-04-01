(function(){
  console.log("start.");
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

  console.log(config["options"]);
  console.log(config["options"].length);

  for(let i=0; i<config["options"].length; i++){
    let item = config.options[i];
    console.log(item["id"]);
    console.log(item["title"]);
    console.log(item["contexts"]);
    console.log(item["url"]);

    browser.contextMenus.create({
      id: item["id"],
      title: item["title"],
      contexts: item["contexts"]
    });
  }
  console.log("end.");
})();
