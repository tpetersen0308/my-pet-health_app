function cancel(petId = false, screeningId = false) {
  if(petId){
    $("#js-cancel-" + petId).on("click", function(event) {
      event.preventDefault();
      $.getJSON("/pets/" + petId, function(data) {
        $("#js-pet-" + petId).html(displayPet(data));
        addEditListener();
      })
    })
  } else if(screeningId) {
    $("#js-cancel-" + screeningId).on("click", function(event) {
      event.preventDefault();
      $.getJSON("/health_screenings/" + screeningId, function(data) {
        showScreening(data);
      })
    })
  } else {
    $(".js-cancel").on("click", function(event) {
      event.preventDefault();
      $("#js-content").html("");
    })
  }
}