class PetSerializer < ActiveModel::Serializer
  attributes :id, :name, :species, :birth_date, :sex
end
