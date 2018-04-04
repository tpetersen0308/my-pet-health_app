# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Owner.destroy_all
Veterinarian.destroy_all
Pet.destroy_all
HealthScreening.destroy_all


owners_first = ["Travis", "Hanna", "Hank", "Miranda", "Janet"]

owners_first.each do |name|
  Owner.create(first_name: name, last_name: "Petersen", email: "#{name}@fake.com", password: "password")
end

Veterinarian.create(first_name: "Dr. Joe", last_name: "Smith", email: "drjoesmith@fake.com", password: "password")
Veterinarian.create(first_name: "Dr. Jane", last_name: "Doe", email: "drjanedoe@fake.com", password: "password")

Pet.create(name: "Leo", species: "Cat", birth_date: DateTime.new(2017, 6,3), owner: Owner.find_by(first_name: "Hanna"), vet_ids: [1])

Pet.create(name: "Starbuck", species: "Cat", birth_date: DateTime.new(2016, 10,25), owner: Owner.find_by(first_name: "Hank"), vet_ids: [1])

Pet.create(name: "Prudence", species: "Cat", birth_date: DateTime.new(2010, 8, 30), owner: Owner.find_by(first_name: "Miranda"), vet_ids: [2])

Pet.create(name: "Charlie", species: "Cat", birth_date: DateTime.new(2011, 4, 20), owner: Owner.find_by(first_name: "Miranda"), vet_ids: [2])

Pet.create(name: "Lilly", species: "Dog", birth_date: DateTime.new(2005, 5, 19), owner: Owner.find_by(first_name: "Janet"), vet_ids: [2])

Pet.create(name: "Cooper", species: "Cat", birth_date: DateTime.new(2016, 8, 4), owner: Owner.find_by(first_name: "Travis"), vet_ids: [1])

Pet.create(name: "Emily", species: "Dog", birth_date: DateTime.new(2012, 1, 7), owner: Owner.find_by(first_name: "Travis"), vet_ids: [1])

Pet.create(name: "Mitsie", species: "Dog", birth_date: DateTime.new(2015, 6, 15), owner: Owner.find_by(first_name: "Miranda"), vet_ids: [1])
