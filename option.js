(function(){
  function saveOptions(e){
    console.log(this);
    console.log(e);
  }
  document.querySelector("#optionForm").addEventListener("submit", saveOptions);
})();
