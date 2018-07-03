/**************************************************************************************
* cancel() attaches event listeners to cancel links on forms which remove the form    *
* from the DOM. Because different kinds of forms are appended to different areas of   *
* the DOM and sometimes must be replaced with information on a resources, optional    *
* paramaters can be provided to determine which logic will control form cancellation. *  
***************************************************************************************/
function cancel(petId = false, screeningId = false) {
  //if a pet id is provided, attach an event listener that will remove the form from the 
  //pet's div and replace it with the pet's current information.
  if(petId){
    $("#js-cancel-" + petId).on("click", function(event) {
      event.preventDefault();
      //submit AJAX GET request to the pets#show controller action
      $.getJSON("/pets/" + petId, function(data) {
        $("#js-pet-" + petId).html(displayPet(data)); //replace the form with the pet's information
        addEditListener(); //re-attach event listener to edit pet link
        addDeleteListener(); //re-attach event listener to remove pet link
        viewScreenings(); //re-attach event listener to view screenings link
      })
    })
  } else if(screeningId) {
    //if a health screening id is provided, follow the same logic as above for the pet form
    $("#js-cancel-" + screeningId).on("click", function(event) {
      event.preventDefault();
      $.getJSON("/health_screenings/" + screeningId, function(data) {
        showScreening(data);
      })
    })
  } else {
    //if no arguments are provided, simply remove the form from the DOM
    $(".js-cancel").on("click", function(event) {
      event.preventDefault();
      $("#js-content").html("");
    })
  }
}