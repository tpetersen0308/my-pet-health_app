class Pet {
  constructor(id, name, species, age, sex) {
    this.id = id;
    this.name = name;
    this.species = species;
    this.age = age;
    this.sex = sex;
  }
}

function viewPets(){
  $(".js-viewPets").on("click", function(event) {
    event.preventDefault();
    let userId = $(this).data("id");
    let userName = $(this).data("name");
    
    $("#js-petsLink-" + userId).html(`<a href='#' class='js-filterPets' data-id=${userId} data-name=${userName} data-species='dogs'>Dogs</a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-filterPets' data-id=${userId} data-name=${userName} data-species='cats'>Cats</a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-filterPets' data-id=${userId} data-name=${userName}>All</a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-hidePets' data-id=${userId} data-name=${userName}>Hide</a>`);

    //$.getJSON(`/users/${userId}/pets`, function(data){
    //  let petsHTML = data.map(pet => displayPet(pet)).join('');
    //  $("#js-pets-" + userId).html(petsHTML);
    //  viewScreenings();
    //});
    filterPets(`/users/${userId}/pets`, userId);

    $(".js-filterPets").on("click", function(event){
      event.preventDefault();
      let id = $(this).data("id");
      let species = $(this).data("species") || "";
      filterPets(`/users/${id}/pets/${species}`, id);
    });

    hidePets();
  })
}

function hidePets() {
  $(".js-hidePets").on("click", function(event) {
    event.preventDefault();
    let userId = $(this).data("id");
    let userName = $(this).data("name");

    $("#js-petsLink-" + userId).html(`<a class='js-viewPets' href='#' data-id=${userId} data-name=${userName}>View ${userName}'s ${userVet() ? "Patients" : "Pets"}</a>`);
    $("#js-pets-" + userId).html('');
    viewPets();
  })
}

function filterPets(url, userId) {
  $.getJSON(url, function(data){
    let petsHTML = data.map(pet => displayPet(pet)).join('');
    $("#js-pets-" + userId).html(petsHTML);
    viewScreenings();
  });
}

function displayPet(data) {
  let newPet = new Pet(data.id, data.name, data.species, data.age, data.sex);
  let newOwner = new User(data.owner.id, data.owner.first_name, data.owner.last_name);
  let vets = data.veterinarians.map(vet => new User(vet.id, vet.first_name, vet.last_name));
  let vetsHTML = "<li>Veterinarians:<ul>" + vets.map(vet => `<li><a href="/users/${vet.id}">${vet.displayFullName()}</a></li>`).join('') + "</ul></li>";
  let petHTML = `<div id='js-pet-${newPet.id}'>`; 
  petHTML += `<h4>${newPet.name}</h4><ul><li>Type: ${newPet.sex} ${newPet.species}</li><li><a href="/users/${newOwner.id}">${newOwner.displayFullName()}</a></li><li>Age: ${newPet.age}</li>${vetsHTML}</ul>`;
  petHTML += `<p id="js-screeningsLink-${newPet.id}"><a href='#' class='js-viewScreenings' data-id=${newPet.id} data-name=${newPet.name}>View ${newPet.name}'s Screenings</a></p>`;
  petHTML += `</div><div id="js-screenings-${newPet.id}"></div>`;
  return petHTML;
}

function registerPet() {
  $(".js-registerPet").on("click", function(event) {
    event.preventDefault();
    let url = $(this).attr("href");
    
    $.get(url, function(data){
      $("#js-content").html(data);

      $("#new_pet").submit(function(event){
        event.preventDefault();
        let values = $(this).serialize();
        let posting = $.post($(this).attr("action"), values);
    
        posting.success(function(data){
          let petHTML = "<h3>Your pet has been successfully registered:</h3>" + displayPet(data);
          $("#js-content").html(petHTML);
          $("#js-screeningsLink-" + data.id).html('');
        })
      })
    })
  })
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
        newPetHTML += $("#js-pet-" + data.id).html();
      } else {
        newPetHTML += "<p>We're sorry, we were unable to find any pets that match your search criteria.</p>";
      }
      $("#js-searchResults").html(newPetHTML);
      viewScreenings();
    })
  })
}

$(function() {
  search();
  viewPets();
  registerPet();
})