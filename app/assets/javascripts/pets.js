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
    
    $("#js-petsLink-" + userId).html(`<a href='#' class='js-filterPets' data-id=${userId} data-name=${userName} data-species='dogs'><strong>Dogs</strong></a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-filterPets' data-id=${userId} data-name=${userName} data-species='cats'><strong>Cats</strong></a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-filterPets' data-id=${userId} data-name=${userName}><strong>All</strong></a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-hidePets' data-id=${userId} data-name=${userName}><strong>Hide</strong></a>`);

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

    $("#js-petsLink-" + userId).html(`<a class='js-viewPets' href='#' data-id=${userId} data-name=${userName}><strong>View ${userName}'s ${userVet() ? "Patients" : "Pets"}</strong></a>`);
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
      petsHTML = "<h3>There are no pets to display</h3>"
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
  petHTML += `<h3>${newPet.name}</h3><ul><li>Type: ${newPet.sex} ${newPet.species}</li><li><a href="/users/${newOwner.id}">Owner: <strong>${newOwner.displayFullName()}</strong></a></li><li>Age: ${newPet.age}</li>${vetsHTML}</ul>`;
  if($("#js-currentUserId").val() === newOwner.id.toString()) {
    petHTML += `<p><strong><a href="/users/${newOwner.id}/pets/${newPet.id}/edit" class="js-editPet" data-id=${newPet.id} data-owner-id=${newOwner.id} data-name=${newPet.name}>Edit ${newPet.name}'s information</a></strong></p>`;
    petHTML += `<p><strong><a href="#" class="js-deletePet" data-id=${newPet.id} data-owner-id=${newOwner.id} data-name=${newPet.name}>Remove ${newPet.name} from my pets</a></strong></p>`;
  }
  petHTML += `<p id="js-screeningsLink-${newPet.id}"><strong><a href='#' class='js-viewScreenings' data-id=${newPet.id} data-name=${newPet.name}>View ${newPet.name}'s Screenings</a></strong></p>`;
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
      $("#js-pet-" + id).html(`<h3>Edit ${name}'s information:</h3><br>` + data);

      submitPetUpdates(id, name);
    })
  })
}

function submitPetUpdates(id, name) {
  $("#edit_pet_" + id).submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values);

    posting.success(function(data){
      if(typeof data === "object"){
        let petHTML = "<h1>Your pet's information has been updated:</h1>" + displayPet(data);
        $("#js-pet-" + id).html(petHTML);
        addEditListener();
        addDeleteListener();
        $("#js-screeningsLink-" + data.id).remove();
        $("#js-screenings-" + data.id).remove();
      } else {
        $("#js-pet-" + id).html(`<h3>Edit ${name}'s information:</h3><br>` + data);
        submitPetUpdates(id, name);
      }
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
          $("#js-content").html(`<h2>${name} has been removed from your pets.</h2>`)
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
      $("#js-content").html("<h2>Register a New Pet:</h2><br>" + data);

      submitNewPet();
    })
  })
}

function submitNewPet() {
  $("#new_pet").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values);

    posting.success(function(data){
      if(typeof data === "object"){
        let petHTML = "<h2>Your pet has been successfully registered:</h2><br>" + displayPet(data);
        $("#js-content").html(petHTML);
        addEditListener();
        addDeleteListener();
        $("#js-screeningsLink-" + data.id).remove();
        $("#js-screenings-" + data.id).remove();
      } else {
        $("#js-content").html("<h2>Register a New Pet:</h2><br>" + data);
        submitNewPet();
      }
    })
  })
}

function search() {
  $("#js-searchLink").on("click", function(event) {
    event.preventDefault();
    let req = $.get("/pets", function(data){
      $("#js-content").html(data);
    })
    
    req.done(function() {
      $("#js-search").submit(function(event){
        event.preventDefault();
        let values = $(this).serialize();
        let posting = $.post($(this).attr("action"), values);
        
        $("#pet_name").val("");
        $("#pet_owner_first_name").val("");
        $("#pet_owner_last_name").val("");
        
        posting.success(function(data){
          $("#js-submitSearch").removeAttr('disabled');
          let newPetHTML = `<h2>Search Results: </h2><br>`;
          if(data){
            newPetHTML += displayPet(data);
          } else {
            newPetHTML += "<h3>We're sorry, we were unable to find any pets that match your search criteria.</h3>";
          }
          $("#js-searchResults").html(newPetHTML);
          addDeleteListener();
          addEditListener();
          viewScreenings();
        })
      })
    })
  })
    
}

$(function() {
  search();
  viewPets();
  registerPet();
})