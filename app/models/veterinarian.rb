class Veterinarian < User
  has_many :pets_veterinarians
  has_many :pets, through: :pets_veterinarians
  has_many :owners, through: :pets
end
