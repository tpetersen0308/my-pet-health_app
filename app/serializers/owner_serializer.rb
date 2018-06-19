class OwnerSerializer < User
  attributes :id
  has_many :pets
end
