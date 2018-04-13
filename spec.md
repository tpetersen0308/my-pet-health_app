# Specifications for the Rails Assessment

Specs:
- [x] Using Ruby on Rails for the project
- [x] Include at least one has_many relationship (x has_many y e.g. User has_many Recipes) 
      - Owners have many vets through Pets, Veterinarians have many Owners through pets, Pets
        have many HealthScreenings and Veterinarians.
- [x] Include at least one belongs_to relationship (x belongs_to y e.g. Post belongs_to User)
      - A Pet belongs to an Owner and a HealthScreening belongs to a Pet.
- [x] Include at least one has_many through relationship (x has_many y through z e.g. Recipe has_many Items through Ingredients)
      - Owners and Veterinarians bear a many to many relationship through a Pet, and Pets and Veterinarians
        bear a many to many relationship through a PetVeterinarian.
- [x] The "through" part of the has_many through includes at least one user submittable attribute (attribute_name e.g. ingredients.quantity)
      - Pets have several user-submittable attributes.
- [x] Include reasonable validations for simple model objects (list of model objects with validations e.g. User, Recipe, Ingredient, Item)
      - Many of the attributes for new instances are validated upon creation.
- [x] Include a class level ActiveRecord scope method (model object & class method name and URL to see the working feature e.g. User.most_recipes URL: /users/most_recipes)
      - HealthScreenings can be scoped by current and overdue and have corresponding URLS
        as /pet/:pet_id/health_screenings/:status
- [x] Include signup (how e.g. Devise)
      - Custom logic and github oauth
- [x] Include login (how e.g. Devise)
      - Custom logic and github oauth
- [x] Include logout (how e.g. Devise)
      - Custom logic and github oauth
- [x] Include third party signup/login (how e.g. Devise/OmniAuth)
      - github oauth 
- [x] Include nested resource show or index (URL e.g. users/2/recipes)
      - /users/:user_id/pets
      - /pets/:pet_id/health_screenings
      - /pets/:pet_id/health_screenings/:status
      - etc.
- [x] Include nested resource "new" form (URL e.g. recipes/1/ingredients)
      - /users/:user_id/pets/new
- [x] Include form display of validation errors (form URL e.g. /recipes/new)
      - Dedicated partial for this in app/views/shared

Confirm:
- [x] The application is pretty DRY
- [x] Limited logic in controllers
- [x] Views use helper methods if appropriate
- [x] Views use partials if appropriate