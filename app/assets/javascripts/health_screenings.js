class HealthScreening {
  constructor(id, kind, species, lastUpdated, status) {
    this.id = id;
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
* index route to request a collection of screenings from, and appends the collection to the *
* DOM.                                                                                      *
*********************************************************************************************/
function filterScreenings(url, petId, name) {
  let screenings = [];

  //send GET request for screenings collection
  $.getJSON(url, function(data){ 
    $("#js-screenings-" + petId).html(''); //clear screenings div to prevent appending duplicates
    
    if(data.length > 0) { //build screenings and append to DOM if there are screenings to display
      for(screening of data) {
        screenings.push(new HealthScreening(screening.id, screening.kind, screening.species, screening.last_updated, screening.status));
        showScreening(screenings[screenings.length - 1], petId);
        if(currentUserVet() && screening.status === "Overdue") { //display update button only if user is a vet and the screening isn't up to date
          $("#js-lastUpdated-" + screening.id).append(`<button class="js-updateScreening" data-id=${screening.id} data-pet-id=${petId}>Update</button>`);
          updateScreening(); //add event listener to update button
        }
      }
    } else {
      $("#js-screenings-" + petId).append(`<h4>All of ${name.toUpperCase()}'s screenings are ${url.includes("current") ? "overdue" : "current"}</h4><br>`)
    }
  });
}

function updateScreening() {
  $(".js-updateScreening").on("click", function() {
    let screeningId = $(this).data("id");
    let petId = $(this).data("pet-id");

    let req = $.get(`/pets/${petId}/health_screenings/${screeningId}/edit`, function(data){
      $("#js-lastUpdated-" + screeningId).html(data);
    })
    
    req.success(function(){
      submitScreeningUpdate(screeningId);
    })
  })
}

function submitScreeningUpdate(screeningId){
  $("form").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values);
    
    posting.done(function (data) {
      if(typeof data === "object") {   
        $.getJSON(`/health_screenings/${screeningId}`, function(screeningData){
          let newScreening = new HealthScreening(screeningData.id, screeningData.kind, screeningData.species, screeningData.last_updated, screeningData.status);
          $("#js-screening-" + screeningId).html(`<p>${newScreening.kind}</p><ul><li id="js-lastUpdated-${newScreening.id}">Last Updated: ${newScreening.displayLastUpdated()} </li><li>Status: ${newScreening.status}</li></ul>`);
        })
      } else {
        $("#js-lastUpdated-" + screeningId).html(data);
        submitScreeningUpdate(screeningId);
      }
    })
  })
}

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

function showScreening(screening, petId) {
  $("#js-screenings-" + petId).append(`<div id='js-screening-${screening.id}'><p>${screening.kind}</p><ul><li id="js-lastUpdated-${screening.id}">Last Updated: ${screening.displayLastUpdated()} </li><li>Status: ${screening.status}</li></ul></div>`);
}

$(function() {
  viewScreenings();
})