class Owner < User
  has_many :pets
  has_many :veterinarians, through: :pets
end
