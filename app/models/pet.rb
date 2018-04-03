class Pet < ApplicationRecord
  belongs_to :owner
  has_many :veterinarians
  has_many :health_screenings
end
