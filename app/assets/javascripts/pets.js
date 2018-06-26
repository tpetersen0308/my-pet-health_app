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
    let petsHTML;
    if (data.length > 0) {
      petsHTML = data.map(pet => displayPet(pet)).join('');
    } else {
      petsHTML = "<strong>There are no pets to display</strong>"
    }
    $("#js-pets-" + userId).html(petsHTML);
    addDeleteListener();
    addEditListener();
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
  if($("#js-currentUserId").val() === newOwner.id.toString()) {
    petHTML += `<p><a href="/users/${newOwner.id}/pets/${newPet.id}/edit" class="js-editPet" data-id=${newPet.id} data-owner-id=${newOwner.id} data-name=${newPet.name}>Edit ${newPet.name}'s information</a></p>`;
    petHTML += `<p><a href="#" class="js-deletePet" data-id=${newPet.id} data-owner-id=${newOwner.id} data-name=${newPet.name}>Remove ${newPet.name} from my pets</a></p>`;
  }
  petHTML += `<p id="js-screeningsLink-${newPet.id}"><a href='#' class='js-viewScreenings' data-id=${newPet.id} data-name=${newPet.name}>View ${newPet.name}'s Screenings</a></p>`;
  petHTML += `</div><div id="js-screenings-${newPet.id}"></div>`;
  return petHTML;
}

function addEditListener() {
  $(".js-editPet").on("click", function(event) {
    event.preventDefault();
    let url = $(this).attr("href");
    let id = $(this).data("id");
    let name = $(this).data("name");
    
    $.get(url, function(data){
      $("#js-pet-" + id).html(`<h4>Edit ${name}'s information:</h4>` + data);

      $("#edit_pet_" + id).submit(function(event){
        event.preventDefault();
        let values = $(this).serialize();
        let posting = $.post($(this).attr("action"), values);
    
        posting.success(function(data){
          let petHTML = "<h3>Your pet's information has been updated:</h3>" + displayPet(data);
          $("#js-pet-" + id).html(petHTML);
          addEditListener();
          addDeleteListener();
          $("#js-screeningsLink-" + data.id).remove();
          $("#js-screenings-" + data.id).remove();
        })
      })
    })
  })
}

function addDeleteListener() {
  $(".js-deletePet").on("click", function(event){
    event.preventDefault();
    let answer = confirm(`Are you sure you want to remove ${$(this).data("name")} from your pets?`);
    let name = $(this).data("name");
    let id = $(this).data("id");
    let ownerId = $(this).data("owner-id");
    if(answer){
      let req = $.ajax({
        type: "POST",
        url: `/users/${ownerId}/pets/${id}`,
        data: {_method: 'delete'},
        success: function() {
          $("#js-pet-" + id).remove();
          $("#js-content").html(`<strong>${name} has been removed from your pets.</strong>`)
        },
        error: function (data) {
          console.error('Error:', data);
        }
      })
    }
  })
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
          addEditListener();
          addDeleteListener();
          $("#js-screeningsLink-" + data.id).remove();
          $("#js-screenings-" + data.id).remove();
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
        newPetHTML += displayPet(data);//$("#js-pet-" + data.id).html();
      } else {
        newPetHTML += "<p>We're sorry, we were unable to find any pets that match your search criteria.</p>";
      }
      $("#js-searchResults").html(newPetHTML);
      addDeleteListener();
      addEditListener();
      viewScreenings();
    })
  })
}

$(function() {
  search();
  viewPets();
  registerPet();
})