(function(){
  document.querySelector('#optionForm').addEventListener('submit',resistFormOption);

  function resistFormOption(e){
    e.preventDefault();
    console.log("resistFormOption");
    //console.log(e);
    //console.log(e.target);

    let form = e.target;
    let input = {};
    let registers = form.querySelectorAll("[name=register]");
    console.log(registers);

    //iterable...

    for(let i=0; i<registers.length; i++){
      console.log("i="+i);
    }
    //browser.storage.local.get();
  }
})();
