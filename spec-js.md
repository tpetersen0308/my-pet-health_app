# Specifications for the Rails with jQuery Assessment

Specs:
- [ ] Use jQuery for implementing new requirements
- [x] Include a show resource rendered using jQuery and an Active Model Serialization JSON backend.
      - Search results are displayed using jQuery.
- [x] Include an index resource rendered using jQuery and an Active Model Serialization JSON backend.
      - Pets and Health Screenings are rendered per these requirements.
- [x] Include at least one has_many relationship in information rendered via JSON and appended to the DOM.
      - Pets have many screenings, Users have many Pets.
- [ ] Use your Rails API and a form to create a resource and render the response without a page refresh.
- [x] Translate JSON responses into js model objects.
      - JSON responses are translated into js model objects in displayPets() and displayScreenings().
- [x] At least one of the js model objects must have at least one method added by your code to the prototype.
      - HealthScreenings have a displayLastUpdated() method and Users have a displayFullName() method.

Confirm
- [ ] You have a large number of small Git commits
- [ ] Your commit messages are meaningful
- [ ] You made the changes in a commit that relate to the commit message
- [ ] You don't include changes in a commit that aren't related to the commit message