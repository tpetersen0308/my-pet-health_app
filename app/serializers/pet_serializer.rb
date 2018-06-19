class PetSerializer < ActiveModel::Serializer
  attributes :id, :name, :species, :birth_date, :sex
  belongs_to :owner
  has_many :veterinarians
  has_many :health_screenings
end
