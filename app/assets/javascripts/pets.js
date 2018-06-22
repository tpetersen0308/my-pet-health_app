class Pet {
  constructor(id, name, species, age, sex) {
    this.id = id;
    this.name = name;
    this.species = species;
    this.age = age;
    this.sex = sex;
  }
}

function displayPet(data) {
  let newPet = new Pet(data.id, data.name, data.species, data.age, data.sex);
  let newOwner = new User(data.owner.id, data.owner.first_name, data.owner.last_name);
  let vets = data.veterinarians.map(vet => new User(vet.id, vet.first_name, vet.last_name));
  let vetsHTML = "<li>Veterinarians:<ul>" + vets.map(vet => `<li><a href='users/${vet.id}'>${vet.displayFullName()}</a></li>`).join('') + "</ul></li>";
  let petHTML = `<h4>${newPet.name}</h4><ul><li>Type: ${newPet.sex} ${newPet.species}</li><li><a href='/users/${newOwner.id}'>${newOwner.displayFullName()}</a></li><li>Age: ${newPet.age}</li>${vetsHTML}</ul>`;
  return petHTML;
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
        newPetHTML += displayPet(data);
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