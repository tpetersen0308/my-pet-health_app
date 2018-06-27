class HealthScreening {
  constructor(id, kind, species, lastUpdated, status) {
    this.id = id;
    this.kind = kind;
    this.species = species;
    this.lastUpdated = lastUpdated ? new Date(lastUpdated) : lastUpdated,
    this.status = status
  }

  displayLastUpdated() {
    if(this.lastUpdated) {
      return this.lastUpdated.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
    } else {
      return "Never"
    }
  }
}

function attachListeners() {
  viewScreenings();
}

function viewScreenings() {
  $(".js-viewScreenings").on("click", function(event) {
    event.preventDefault();
    const id = $(this).data("id");
    const name = $(this).data("name");

    $("#js-screeningsLink-" + id).html(`<a href='#' class='js-filterScreenings' data-id=${id} data-name=${name} data-status='current'><strong>Current</strong></a>`);
    $("#js-screeningsLink-" + id).append(`<span> | </span><a href='#' class='js-filterScreenings' data-id=${id} data-name=${name} data-status='overdue'><strong>Overdue</strong></a>`);
    $("#js-screeningsLink-" + id).append(`<span> | </span><a href='#' class='js-filterScreenings' data-id=${id} data-name=${name}><strong>All</strong></a>`);
    $("#js-screeningsLink-" + id).append(`<span> | </span><a href='#' class='js-hideScreenings' data-id=${id} data-name=${name}><strong>Hide</strong></a>`);

    filterScreenings(`/pets/${id}/health_screenings`, id);

    $(".js-filterScreenings").on("click", function(event) {
      event.preventDefault();
      let id = $(this).data("id");
      let status = $(this).data("status") || "";
      filterScreenings(`/pets/${id}/health_screenings/${status}`, id);
    });

    hideScreenings();
  })
}

function filterScreenings(url, petId) {
  let screenings = [];
  $.getJSON(url, function(data){
    $("#js-screenings-" + petId).html(''); //clear screenings div to prevent appending duplicates
    for(screening of data) {
      screenings.push(new HealthScreening(screening.id, screening.kind, screening.species, screening.last_updated, screening.status));
      showScreening(screenings[screenings.length - 1], petId);
      if(currentUserVet() && screening.status === "Overdue") {
        $("#js-lastUpdated-" + screening.id).append(`<button class="js-updateScreening" data-id=${screening.id} data-pet-id=${petId}>Update</button>`);
        updateScreening();
      }
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
  attachListeners();
})