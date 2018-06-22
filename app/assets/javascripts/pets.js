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

    $("#pet_name").val("");
    $("#pet_owner_first_name").val("");
    $("#pet_owner_last_name").val("");
    
    posting.success(function(data){
      $("#js-submitSearch").removeAttr('disabled');
      let newPetHTML = `<h3>Search Results: </h3>`;
      if(data){
        let newPet = new Pet(data.name, data.species, data.age, data.sex);
        newPetHTML += `<h4>${newPet.name}</h4><ul><li>Type: ${newPet.sex} ${newPet.species}</li><li>Age: ${newPet.age}</li></ul>`;
      } else {
        newPetHTML += "<p>We're sorry, we were unable to find any pets that match your search criteria.</p>";
      }
      $("#js-searchResults").html(newPetHTML);
    })
  })
}

$(function() {
  search();
})