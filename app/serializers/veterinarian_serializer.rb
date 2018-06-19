class VeterinarianSerializer < User
  attributes :id
  has_many :pets
end
