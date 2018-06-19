class VeterinarianSerializer < UserSerializer
  attributes :id
  has_many :pets
end
