function cancel(id = false) {
  if(id){
    $("#js-cancel-" + id).on("click", function(event) {
      event.preventDefault();
      $.getJSON("/pets/" + id, function(data) {
        $("#js-pet-" + id).html(displayPet(data));
        addEditListener();
      })
    })
  } else {
    $(".js-cancel").on("click", function(event) {
      event.preventDefault();
      $("#js-content").html("");
    })
  }
}