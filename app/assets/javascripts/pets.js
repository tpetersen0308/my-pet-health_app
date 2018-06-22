class Pet {
  constructor(name, species, birthDate, sex) {
    this.name = name;
    this.species = species;
    this.birthDate = birthDate;
    this.sex = sex;
  }
}

function search() {
  $("#js-search").submit(function(event){
    event.preventDefault();
    let values = $(this).serialize();
    let posting = $.post($(this).attr("action"), values);
    posting.done(function(data){
      
    })
  })
}