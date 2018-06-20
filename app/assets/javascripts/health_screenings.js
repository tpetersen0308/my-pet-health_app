class HealthScreening {
  constructor(kind, species, lastUpdated, status) {
    this.kind = kind;
    this.species = species;
    this.lastUpdated = new Date(lastUpdated),
    this.status = status
  }

  displayLastUpdated() {
    return this.lastUpdated.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

function attachListeners() {
  $(".js-viewScreenings").on("click", function(event) {
    event.preventDefault();
    const id = $(this).data("id");
    const screenings = [];
    $.getJSON(`/pets/${id}/health_screenings`, function(data){
      for(screening of data) {
        screenings.push(new HealthScreening(screening.kind, screening.species, screening.last_updated, screening.status));
        showScreening(screenings[screenings.length - 1], id);
        debugger
      }
    });
    
  })
}

function showScreening(screening, petId) {
  $("#js-screenings-" + petId).append(`<p>${screening.kind}</p><ul><li>Last Updated: ${screening.lastUpdated}</li><li>Status: ${screening.status}</li></ul>`);
}

$(function() {
  attachListeners();
})