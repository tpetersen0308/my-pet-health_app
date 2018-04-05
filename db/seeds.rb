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

joe = Veterinarian.create(first_name: "Dr. Joe", last_name: "Smith", email: "drjoesmith@fake.com", password: "password")
jane = Veterinarian.create(first_name: "Dr. Jane", last_name: "Doe", email: "drjanedoe@fake.com", password: "password")

leo = Pet.create(name: "Leo", species: "Cat", birth_date: DateTime.new(2017, 6,3), owner: Owner.find_by(first_name: "Hanna"))

starbuck = Pet.create(name: "Starbuck", species: "Cat", birth_date: DateTime.new(2016, 10,25), owner: Owner.find_by(first_name: "Hank"))

prudence = Pet.create(name: "Prudence", species: "Cat", birth_date: DateTime.new(2010, 8, 30), owner: Owner.find_by(first_name: "Miranda"))

charlie = Pet.create(name: "Charlie", species: "Cat", birth_date: DateTime.new(2011, 4, 20), owner: Owner.find_by(first_name: "Miranda"))

lilly = Pet.create(name: "Lilly", species: "Dog", birth_date: DateTime.new(2005, 5, 19), owner: Owner.find_by(first_name: "Janet"))

cooper = Pet.create(name: "Cooper", species: "Cat", birth_date: DateTime.new(2016, 8, 4), owner: Owner.find_by(first_name: "Travis"))

emily = Pet.create(name: "Emily", species: "Dog", birth_date: DateTime.new(2012, 1, 7), owner: Owner.find_by(first_name: "Travis"))

mitsie = Pet.create(name: "Mitsie", species: "Dog", birth_date: DateTime.new(2015, 6, 15), owner: Owner.find_by(first_name: "Miranda"))

joe.pets << [leo, cooper, emily, lilly, starbuck]
joe.save

jane.pets << [prudence, charlie, mitsie, starbuck, leo]
jane.save

leo.health_screenings.find_by(kind: "Rabies").update(last_updated: DateTime.new(2017,10,1))

leo.health_screenings.find_by(kind: "Feline Influenza").update(last_updated: DateTime.new(2017,10,1))

leo.health_screenings.find_by(kind: "Stool Analysis").update(last_updated: DateTime.new(2017,10,1))

cooper.health_screenings.find_by(kind: "Rabies").update(last_updated: DateTime.new(2018, 1, 20))

cooper.health_screenings.find_by(kind: "Feline Influenza").update(last_updated: DateTime.new(2018, 1, 20))

cooper.health_screenings.find_by(kind: "Stool Analysis").update(last_updated: DateTime.new(2018, 1, 20))

starbuck.health_screenings.find_by(kind: "Rabies").update(last_updated: DateTime.new(2017,10,1))

starbuck.health_screenings.find_by(kind: "Feline Leukemia").update(last_updated: DateTime.new(2017,10,1))

starbuck.health_screenings.find_by(kind: "Stool Analysis").update(last_updated: DateTime.new(2017,10,1))

prudence.health_screenings.each do |scr|
  scr.update(last_updated: DateTime.new(2014, 2, 18))
end

charlie.health_screenings.each do |scr|
  scr.update(last_updated: DateTime.new(2016, 4, 18))
end

lilly.health_screenings.find_by(kind: "Parvovirus").update(last_updated: DateTime.new(2017,10,1))

lilly.health_screenings.find_by(kind: "CAV-2/Kennel Cough").update(last_updated: DateTime.new(2017,10,1))

lilly.health_screenings.find_by(kind: "Stool Analysis").update(last_updated: DateTime.new(2014,10,1))

lilly.health_screenings.find_by(kind: "Rabies").update(last_updated: DateTime.new(2012,10,1))

emily.health_screenings.find_by(kind: "CAV-1/Canine Hepatitis").update(last_updated: DateTime.new(2016,6,14))

emily.health_screenings.find_by(kind: "CAV-2/Kennel Cough").update(last_updated: DateTime.new(2016,6,14))

emily.health_screenings.find_by(kind: "Lyme").update(last_updated: DateTime.new(2016,6,14))

emily.health_screenings.find_by(kind: "Rabies").update(last_updated: DateTime.new(2016,6,14))
