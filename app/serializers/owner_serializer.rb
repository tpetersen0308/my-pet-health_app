class OwnerSerializer < UserSerializer
  attributes :id, :first_name, :last_name
  has_many :pets
end
