class Pet {
  constructor(name, species, age, sex) {
    this.name = name;
    this.species = species;
    this.age = age;
    this.sex = sex;
  }
}

function search() {
  $("#js-search").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values);
    posting.done(function(data){
      let newPet = new Pet(data.name, data.species, data.age, data.sex);
      let newPetHTML = `<h4>${newPet.name}</h4><ul><li>Type: ${newPet.sex} ${newPet.species}</li><li>Age: ${newPet.age}</li></ul>`
      $("#js-searchResults").html(newPetHTML);
    })
  })
}

$(function() {
  search();
})