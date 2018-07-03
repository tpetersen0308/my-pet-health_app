function cancel(id = nil) {
  if(id){
    $("#js-cancel-" + id).on("click", function(event) {
      event.preventDefault();
      $.getJSON("/pets/" + id, function(data) {
        $("#js-pet-" + id).html(displayPet(data));
      })
    })
  } else {
    $(".js-cancel").on("click", function(event) {
      event.preventDefault();
      $("#js-content").html("");
    })
  }
}