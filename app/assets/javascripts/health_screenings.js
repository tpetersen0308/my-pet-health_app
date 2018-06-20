class HealthScreening {
  constructor(kind, species, lastUpdated, status) {
    this.kind = kind;
    this.species = species;
    this.lastUpdated = lastUpdated,
    this.status = status
  }
}

function attachListeners() {
  $(".js-viewScreenings").on("click", function(event) {
    event.preventDefault();
    const id = $(this).data("id");
    const screenings = [];
    $.getJSON(`/pets/${id}/health_screenings`, function(data){
      for(screening of data) {
        screenings.push(new HealthScreening(screening.kind, screening.species, screening.lastUpdated, screening.status));
        showScreening(screenings[screenings.length - 1]);
      }
    });
    
  })
}

function showScreening(screening) {
  $("#js-screenings").append(`<p>${screening.kind}</p><ul><li>Last Updated: ${this.lastUpdated}</li><li>Status: ${this.status}</li></ul>`);
}

$(function() {
  attachListeners();
})