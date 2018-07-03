class User {
  constructor(id, firstName, lastName, email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email
  }

  displayFullName() {
    return this.firstName + ' ' + this.lastName;
  }
}

/******************************************************************************
* currentUserVet() returns true if the current user is a vet and false if not * 
*******************************************************************************/
function currentUserVet() {
  return $("#js-currentUserVet").val() === "true";
}

/********************************************************************************
* userVet() returns true if the user being displayed is a vet and false if not. *  
*********************************************************************************/
function userVet() {
  return $("#js-userVet").val() === "true";
}

/******************************************************************************
* registerUser() attaches an event listener to the sign up link which submits *
* an AJAX GET request to the users#new controller action and append the new   *
* user form to the DOM.                                                       * 
*******************************************************************************/
function registerUser() {
  $(".js-signUp").on("click", function(event) {
    event.preventDefault();

    //make AJAX GET request to users#new
    $.get("/users/new", function(data) {
      $("#js-content").html(data); //append form to DOM
      cancel(); //attach event listener to cancel link
      submitNewUser(); //attach event listener to form submission
    })

  })
}

/******************************************************************************
* submitNewUser() attaches an event listener to the new user form submission  *
* which makes an AJAX POST request to the users#create controller action.     * 
*******************************************************************************/
function submitNewUser() {
  $("#js-signUpForm").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post("/users", values) //submit form to users#create

    posting.done(function(resp){
      //if the server responds with html, re-render the form with errors
      if(typeof resp === "string") {
        $("#js-content").html(resp);
        cancel(); //attach event listener to cancel link
        submitNewUser(); //attach event listener to form submission
      } else {
        //if the user is successfully created, redirect to new user's show page
        window.location.replace("/users/" + resp.id);
      }
    })
  })
}

//on documnent: ready, attach event listener to sign up link
$(function() {
  registerUser();
})