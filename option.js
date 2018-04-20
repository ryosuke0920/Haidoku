( () => {
  let conf = {
    "defailt":{
      "google":"1",
      "yahoo":"2",
      "dictionary.cambridge.org":"3"
    }
  };

  document.querySelector('#optionForm').addEventListener('submit',resistFormOption);

  function resistFormOption(e){
    console.log(e);
    e.preventDefault();

    let form = e.target;
    let registers = form.querySelectorAll("input[name=register]:checked");

    for(let i=0; i<registers.length; i++){
      console.log("i="+i);
      let value = registers[i].value;
      console.log("value="+value);

      browser.contextMenus.create(
        {
          "id":value,
          "title":value,
          "contexts":["selection"]
        },
        onCreated
      );
    }

    function onCreated(e){
      console.log("e="+e);
    }

    browser.contextMenus.onClicked.addListener(function(info, tab) {
      console.log(info);
      console.log(tab);
      switch (info.menuItemId) {
        case "log-selection":
          console.log(info.selectionText);
          break;
      }
    });

  }
})();
