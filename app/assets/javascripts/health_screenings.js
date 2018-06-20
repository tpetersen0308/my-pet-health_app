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
    debugger
  })
}

$(function() {
  attachListeners();
})