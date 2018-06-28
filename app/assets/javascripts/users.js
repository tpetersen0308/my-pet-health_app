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

function currentUserVet() {
  return $("#js-currentUserVet").val() === "true";
}

function userVet() {
  return $("#js-userVet").val() === "true";
}

function registerUser() {
  $(".js-signUp").on("click", function(event) {
    event.preventDefault();

    $.get("/users/new", function(data) {
      $("#js-content").html(data);
      cancel();
      submitNewUser();
    })

  })
}

function submitNewUser() {
  $("#js-signUpForm").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post("/users", values)

    posting.done(function(resp){
      if(typeof resp === "string") {
        $("#js-content").html(resp);
        cancel();
        submitNewUser();
      } else {
        window.location.replace("/users/" + resp.id);
      }
    })
  })
}


$(function() {
  registerUser();
})