class PetsVeterinarian < ApplicationRecord
  belongs_to :pet
  belongs_to :veterinarian
end
