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

function currentUserVet() {
  return $("#js-currentUserVet").val() === "true";
}

function viewScreenings() {
  $(".js-viewScreenings").on("click", function(event) {
    event.preventDefault();
    const id = $(this).data("id");
    let screenings = [];

    $("#js-screeningsLink-" + id).html(`<a href='#' class='js-hideScreenings' data-id=${id} >Hide Screenings</a>`);

    $.getJSON(`/pets/${id}/health_screenings`, function(data){
      $("#js-screenings-" + id).html(''); //clear screenings div to prevent appending duplicates
      for(screening of data) {
        screenings.push(new HealthScreening(screening.id, screening.kind, screening.species, screening.last_updated, screening.status));
        showScreening(screenings[screenings.length - 1], id);
        if(currentUserVet() && screening.status === "Overdue") {
          $("#js-lastUpdated-" + screening.id).append(`<button class="js-updateScreening" data-id=${screening.id} data-pet-id=${id}>Update</button>`);
          updateScreening();
        }
      }
    });
    hideScreenings();
  })
}

function updateScreening() {
  $(".js-updateScreening").on("click", function() {
    let screeningId = $(this).data("id");
    let petId = $(this).data("pet-id");
    debugger
  })
}

function hideScreenings() {
  $(".js-hideScreenings").on("click", function(event) {
    event.preventDefault();
    let id = $(this).data("id");
    $("#js-screeningsLink-" + id).html(`<a class='js-viewScreenings' href='#' data-id=${id} >View Screenings</a>`);
    $("#js-screenings-" + id).html('');
    viewScreenings();
  })
}

function showScreening(screening, petId) {
  $("#js-screenings-" + petId).append(`<p>${screening.kind}</p><ul><li id="js-lastUpdated-${screening.id}">Last Updated: ${screening.displayLastUpdated()} </li><li>Status: ${screening.status}</li></ul>`);
}

$(function() {
  attachListeners();
})