class HealthScreening {
  constructor(id, petId, kind, species, lastUpdated, status) {
    this.id = id;
    this.petId = petId;
    this.kind = kind;
    this.species = species;
    this.lastUpdated = lastUpdated ? new Date(lastUpdated) : lastUpdated,
    this.status = status
  }

/*********************************************************************************************
* displayLastUpdated() returns a screenings lastUpdated attribute as a string-formatted date *
**********************************************************************************************/ 
displayLastUpdated() {
    if(this.lastUpdated) {
      return this.lastUpdated.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
    } else {
      return "Never"
    }
  }
}

/******************************************************************************************** 
* viewScreenings() attaches an event listener to links for viewing pet health screenings,   *
* appends the appropriate filtering links to the DOM with event listeners attached to them. *
*********************************************************************************************/
function viewScreenings() {
  $(".js-viewScreenings").on("click", function(event) { //attach listener
    event.preventDefault(); 
    const id = $(this).data("id");
    const name = $(this).data("name");

    //append filtering links to the DOM
    $("#js-screeningsLink-" + id).html(`<a href='#' class='js-filterScreenings' data-id=${id} data-name=${name} data-status='current'><strong>Current</strong></a>`);
    $("#js-screeningsLink-" + id).append(`<span> | </span><a href='#' class='js-filterScreenings' data-id=${id} data-name=${name} data-status='overdue'><strong>Overdue</strong></a>`);
    $("#js-screeningsLink-" + id).append(`<span> | </span><a href='#' class='js-filterScreenings' data-id=${id} data-name=${name}><strong>All</strong></a>`);
    $("#js-screeningsLink-" + id).append(`<span> | </span><a href='#' class='js-hideScreenings' data-id=${id} data-name=${name}><strong>Hide</strong></a>`);

    //display screenings with filterScreenings()
    filterScreenings(`/pets/${id}/health_screenings`, id, name);

    //attach event listener to filtering links
    $(".js-filterScreenings").on("click", function(event) {
      event.preventDefault();
      let id = $(this).data("id");
      let status = $(this).data("status") || "";
      filterScreenings(`/pets/${id}/health_screenings/${status}`, id, name); //display selected screenings
    });

    hideScreenings(); //attach event listener to hide screenings link
  })
}

/********************************************************************************************  
* filterScreenings() sends an AJAX GET request to its url argument, which determines the    *
* index action to request a collection of screenings from, and appends the collection to    *
* the DOM.                                                                                  *
*********************************************************************************************/
function filterScreenings(url, petId, name) {

  //send GET request for screenings collection
  $.getJSON(url, function(data){ 
    $("#js-screenings-" + petId).html(''); //clear screenings div to prevent appending duplicates
    
    if(data.length > 0) { //build screenings and append to DOM if there are screenings to display
      for(screening of data) {
        $("#js-screenings-" + petId).append(`<div id='js-screening-${screening.id}'></div>`);
        showScreening(screening);
      }
    } else { //display informative message if there are no screenings to display
      $("#js-screenings-" + petId).append(`<h4>All of ${name.toUpperCase()}'s screenings are ${url.includes("current") ? "overdue" : "current"}</h4><br>`)
    }
  });
}

/*********************************************************************************************
* showScreening() appends a screening JS object model to the DOM and renders an edit button  *
* if the current user is a vet and the screening is out of date.                             * 
**********************************************************************************************/
function showScreening(screening) {
  let newScreening = new HealthScreening(screening.id, screening.pet.id, screening.kind, screening.species, screening.last_updated, screening.status);
  $("#js-screening-" + newScreening.id).html(`<p>${newScreening.kind}</p><ul><li id="js-lastUpdated-${newScreening.id}">Last Updated: ${newScreening.displayLastUpdated()} </li><li>Status: ${newScreening.status}</li></ul>`);
  if(currentUserVet() && newScreening.status === "Overdue") { //display update button only if user is a vet and the screening isn't up to date
    $("#js-lastUpdated-" + newScreening.id).append(`<button class="js-updateScreening" data-id=${newScreening.id} data-pet-id=${newScreening.petId}>Update</button>`);
    updateScreening(); //add event listener to update button
  }
}

/********************************************************************************************
* updateScreening() attaches an event listener to the update button that sends an AJAX GET  *
* request to the health_screenings#edit controller action, and replaces the screening       *
* information with an update form.                                                          *
*********************************************************************************************/
function updateScreening() {
  $(".js-updateScreening").on("click", function() {
    let screeningId = $(this).data("id");
    let petId = $(this).data("pet-id");

    let req = $.get(`/pets/${petId}/health_screenings/${screeningId}/edit`, function(data){
      $("#js-lastUpdated-" + screeningId).html(data); //append form to DOM
      cancel(false, screeningId);
    })
    
    req.success(function(){
      submitScreeningUpdate(screeningId); //attach event listener to form
    })
  })
}

/********************************************************************************************
* submitScreeningUpdate() attaches an event listener to the submit button on the edit form, *
* which sends an AJAX POST request to the health_screenings#update controller action and    *
* renders the updated resource in the DOM.                                                  *
*********************************************************************************************/
function submitScreeningUpdate(screeningId){
  $("form").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values); //submit form to health_screenings#update
    
    posting.done(function (data) {
      if(typeof data === "object") {   
        $.getJSON(`/health_screenings/${screeningId}`, function(screeningData){
          showScreening(screeningData); //display updated information on successful update
        })
      } else { //re-render the form with errors if the update was unsuccessful
        $("#js-lastUpdated-" + screeningId).html(data);
        cancel(false, screeningId); //attach event listener to cancel link
        submitScreeningUpdate(screeningId); //attach event listener to form submission
      }
    })
  })
}

/********************************************************************************************
* hideScreenings() adds an event listener to the link for hiding screenings which removes   *
* the list of screenings from the DOM, and replaces the filtering links with a link to view *
* screenings.                                                                               *
*********************************************************************************************/
function hideScreenings() {
  $(".js-hideScreenings").on("click", function(event) {
    event.preventDefault();
    let id = $(this).data("id");
    let name = $(this).data("name");

    $("#js-screeningsLink-" + id).html(`<a class='js-viewScreenings' href='#' data-id=${id} data-name=${name}><strong>View ${name}'s Screenings</strong></a>`);
    $("#js-screenings-" + id).html('');
    viewScreenings();
  })
}

//on document: ready, attach event listeners to view screenings links
$(function() {
  viewScreenings();
})