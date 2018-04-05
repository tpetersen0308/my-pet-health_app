class Veterinarian < User
  has_and_belongs_to_many :pets
  has_many :owners, through: :pets
end
