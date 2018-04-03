class Veterinarian < User
  has_many :pets
  has_many :owners, through: :pets
end
