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

function userVet(userId) {
  return $("#js-userVet").val() === "true";
}