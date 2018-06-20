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
      }
      debugger
    });
    
  })
}

$(function() {
  attachListeners();
})