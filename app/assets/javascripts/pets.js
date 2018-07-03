class Pet {
  constructor(id, name, species, age, sex) {
    this.id = id;
    this.name = name;
    this.species = species;
    this.age = age;
    this.sex = sex;
  }
}

/*********************************************************************************
* viewPets() adds event listeners to view pets links that create filtering links *
* when clicked, and adds event listeners to filtering links that properly filter *
* the list of pets that is displayed.                                            *
**********************************************************************************/
function viewPets(){
  $(".js-viewPets").on("click", function(event) {
    event.preventDefault();
    let userId = $(this).data("id");
    let userName = $(this).data("name");
    
    //append filter links to the DOM
    $("#js-petsLink-" + userId).html(`<a href='#' class='js-filterPets' data-id=${userId} data-name=${userName} data-species='dogs'><strong>Dogs</strong></a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-filterPets' data-id=${userId} data-name=${userName} data-species='cats'><strong>Cats</strong></a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-filterPets' data-id=${userId} data-name=${userName}><strong>All</strong></a>`);
    $("#js-petsLink-" + userId).append(`<span> | </span><a href='#' class='js-hidePets' data-id=${userId} data-name=${userName}><strong>Hide</strong></a>`);

    //show all pets the first time view pets is clicked
    filterPets(`/users/${userId}/pets`, userId, userName);

    //attach event listeners to filter links
    $(".js-filterPets").on("click", function(event){
      event.preventDefault();
      let id = $(this).data("id");
      let species = $(this).data("species") || "";
      filterPets(`/users/${id}/pets/${species}`, id, userName);
    });

    hidePets(); //attach event listener to hide pets link
  })
}

/*********************************************************************************
* hidePets() attaches an event listener to the hide pets link such that the pets *
* list is hidden when the link is clicked.                                       * 
**********************************************************************************/
function hidePets() {
  $(".js-hidePets").on("click", function(event) {
    event.preventDefault();
    let userId = $(this).data("id");
    let userName = $(this).data("name");

    //replace filters links with view pets link
    $("#js-petsLink-" + userId).html(`<a class='js-viewPets' href='#' data-id=${userId} data-name=${userName}><strong>View${userVet() ? " Dr. "  : " "}${userName}'s ${userVet() ? "Patients" : "Pets"}</strong></a>`);
    $("#js-pets-" + userId).html(''); //remove list from DOM
    viewPets(); //re-attach event listener to view pets link
  })
}

/*********************************************************************************
* filterPets() sends an AJAX GET request to the url provided as an argument, and *
* displays the list of pets from the server response.                            * 
**********************************************************************************/
function filterPets(url, userId, userName) {
  $.getJSON(url, function(data){
    let petsHTML;
    if (data.length > 0) {
      petsHTML = data.map(pet => displayPet(pet)).join('');
    } else { //if the user has no pets to display under given filter, respond with informative message
      if(url.includes("dogs")) {
        petsHTML = `<h4>${userName} does not have any dogs</h4>`
      } else if(url.includes("cats")) {
        petsHTML = `<h4>${userName} does not have any cats</h4>`
      } else {
        petsHTML = `<h4>${userName} has not registered any pets</h4>`
      }
    }
    $("#js-pets-" + userId).html(petsHTML); //append the list or message to the DOM
    addDeleteListener(); //attach listener to remove pet link
    addEditListener(); //attach listener to edit pet link
    viewScreenings(); //attach listener to view pet's screenings
  });
}

/*********************************************************************************
* displayPet() creates new Pet and User JS model objects and returns HTML with   *
* their information to be appended to the DOM.                                   * 
**********************************************************************************/
function displayPet(data) {
  let newPet = new Pet(data.id, data.name, data.species, data.age, data.sex);
  let newOwner = new User(data.owner.id, data.owner.first_name, data.owner.last_name);
  let vets = data.veterinarians.map(vet => new User(vet.id, vet.first_name, vet.last_name));
  let vetsHTML = vets.map(vet => `<li><a href="/users/${vet.id}">Dr. ${vet.displayFullName()}</a></li>`).join('');
  
  //only include vets list if the pet is associated with at least one vet
  if(vetsHTML.length > 0){ 
    vetsHTML = "<li>Veterinarians:<ul>" + vetsHTML + "</ul></li>";
  } else { //display informative message if the pet is not associated with any vets
    vetsHTML = `<li>Veterinarians:<ul><li>${newPet.name} is not yet associated with any veterinarians.</li></ul></li>`;
  }
  let petHTML = `<div id='js-pet-${newPet.id}'>`; 
  petHTML += `<h3>${newPet.name}</h3><ul><li>Type: ${newPet.sex} ${newPet.species}</li><li><a href="/users/${newOwner.id}">Owner: <strong>${newOwner.displayFullName()}</strong></a></li><li>Age: ${newPet.age}</li>${vetsHTML}</ul>`;
  
  //if the current user is the pet's owner, display links to remove the pet or edit its info
  if($("#js-currentUserId").val() === newOwner.id.toString()) { 
    petHTML += `<p><strong><a href="/users/${newOwner.id}/pets/${newPet.id}/edit" class="js-editPet" data-id=${newPet.id} data-owner-id=${newOwner.id} data-name=${newPet.name}>Edit ${newPet.name}'s information</a></strong></p>`;
    petHTML += `<p><strong><a href="#" class="js-deletePet" data-id=${newPet.id} data-owner-id=${newOwner.id} data-name=${newPet.name}>Remove ${newPet.name} from my pets</a></strong></p>`;
  }

  petHTML += `<p id="js-screeningsLink-${newPet.id}"><strong><a href='#' class='js-viewScreenings' data-id=${newPet.id} data-name=${newPet.name}>View ${newPet.name}'s Screenings</a></strong></p>`;
  petHTML += `</div><div id="js-screenings-${newPet.id}"></div>`;
  
  return petHTML;
}

/*********************************************************************************
* addEditListener() appends the edit pet form to the DOM when the edit pet link  *
* is clicked.                                                                    * 
**********************************************************************************/
function addEditListener() {
  $(".js-editPet").on("click", function(event) {
    event.preventDefault();
    let url = $(this).attr("href"); //assign the href attribute of the form to url variable
    let id = $(this).data("id");
    let name = $(this).data("name");
    
    //send AJAX GET request to pets#new for the edit form and append it to the DOM
    $.get(url, function(data){
      $("#js-pet-" + id).html(`<h3>Edit ${name}'s information:</h3><br>` + data);
      cancel(id); //attach event listener to cancel link
      submitPetUpdates(id, name); //attach even listener to submit button
    })
  })
}

/*********************************************************************************
* submitPetUpdates() attaches an event listener to the edit pet form and submits *
* an AJAX POST request to the pets#update controller action. If the server       *
* responds with a JSON object, the updates are displayed. Otherwise, the form is *
* reloaded with errors.                                                          * 
**********************************************************************************/
function submitPetUpdates(id, name) {
  //attach event listener
  $("#edit_pet_" + id).submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values); //submit form to pets#update

    
    posting.success(function(data){
      //if response is a JSON object, append the updated pet info to the DOM
      if(typeof data === "object"){
        let petHTML = "<h1>Your pet's information has been updated:</h1>" + displayPet(data);
        $("#js-pet-" + id).html(petHTML);
        addEditListener();
        addDeleteListener();
        $("#js-screeningsLink-" + data.id).remove();
        $("#js-screenings-" + data.id).remove();
      //if response is html, append the form with errors
      } else {
        $("#js-pet-" + id).html(`<h3>Edit ${name}'s information:</h3><br>` + data);
        submitPetUpdates(id, name); //re-attach event listener to form submission
      }
    })
  })
}

/*********************************************************************************
* addDeleteListener() attaches an event listener to the remove pet links which   *
* submits an AJAX POST request to the pets#delete controller action.             * 
**********************************************************************************/
function addDeleteListener() {
  //attach event listener
  $(".js-deletePet").on("click", function(event){
    event.preventDefault();
    //confirm that user wants to remove the resource from their pets
    let answer = confirm(`Are you sure you want to remove ${$(this).data("name")} from your pets?`);
    let name = $(this).data("name");
    let id = $(this).data("id");
    let ownerId = $(this).data("owner-id");

    //on user confirmation, submit AJAX POST request to pets#delete
    if(answer){
      let req = $.ajax({
        type: "POST",
        url: `/users/${ownerId}/pets/${id}`,
        data: {_method: 'delete'},
        //when resource is successfully deleted, remove the pet from the DOM and display confirmation message.
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

/**********************************************************************************
* registerPet() attaches an event listener to the register pet link which appends *
* the pet registration form to the DOM.                                           * 
***********************************************************************************/
function registerPet() {
  //attach event listener
  $(".js-registerPet").on("click", function(event) {
    event.preventDefault();
    let url = $(this).attr("href");
    
    //make AJAX GET request to pets#new action and append the form to the DOM
    $.get(url, function(data){
      $("#js-content").html("<h2>Register a New Pet:</h2><br>" + data);
      cancel(); //attach event listener to cancel link
      submitNewPet(); //attach event listener to form submission
    })
  })
}

/*********************************************************************************
* submitNewPet() attaches an event listener to the pet registration form, which  *
* makes an AJAX POST request to the pets#create controller action and appends    *
* the results to the DOM.                                                        *
**********************************************************************************/
function submitNewPet() {
  //attach event listener
  $("#new_pet").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values); //submit form to pets#create

    posting.success(function(data){
      //if the server responds with a JSON object, append the new pet information to the DOM
      if(typeof data === "object"){
        let petHTML = "<h2>Your pet has been successfully registered:</h2><br>" + displayPet(data);
        $("#js-content").html(petHTML); //append new pet
        addEditListener(); //attach listener to edit pet link
        addDeleteListener(); //attach listener to remove pet link
        $("#js-screeningsLink-" + data.id).remove(); //new pets have no current screenings, so links are not displayed here
        $("#js-screenings-" + data.id).remove();
      } else {
        //if the server responds with html, re-render the form with errors
        $("#js-content").html("<h2>Register a New Pet:</h2><br>" + data);
        cancel(); //attach event listener to cancel link
        submitNewPet(); //attach event listener to form submission
      }
    })
  })
}

/*********************************************************************************
* search() attaches an event listner to the find a pet link, which appends the   *
* search form to the DOM and then attaches an event listener to search form      *
* submission, which makes an AJAX POST request to the pets#search controller     *
* action.                                                                        *
**********************************************************************************/
function search() {
  //attach event listener to find a pet link
  $("#js-searchLink").on("click", function(event) {
    event.preventDefault();
    // make AJAX GET request for pet search form and append it to the DOM
    let req = $.get("/pets", function(data){
      $("#js-content").html(data);
      cancel(); //attache event listener to cancel link
    })
    
    req.done(function() {
      //attach event listener to search form submission
      $("#js-search").submit(function(event){
        event.preventDefault();
        let values = $(this).serialize();
        let posting = $.post($(this).attr("action"), values); //make AJAX POST request to pets#search
        $("#pet_name").val(""); //clear search form fields
        $("#pet_owner_first_name").val("");
        $("#pet_owner_last_name").val("");
        
        posting.success(function(data){
          $("#js-submitSearch").removeAttr('disabled'); //re-enable search for submit button
          let newPetHTML = `<h2>Search Results: </h2><br>`;
          //if search results are positive, append all results to the DOM
          if(data){
            for(pet of data) {
              newPetHTML += displayPet(pet);
            }
          } else {
            //if search results are negative, display informative message
            newPetHTML += "<h3>We're sorry, we were unable to find any pets that match your search criteria.</h3>";
          }
          $("#js-searchResults").html(newPetHTML);
          addDeleteListener(); //attach event listeners to pet links
          addEditListener();
          viewScreenings();
        })
      })
    })
  })
    
}

//on document: ready, attach event listeners to find a pet, view pets, and register pet links
$(function() {
  search();
  viewPets();
  registerPet();
})