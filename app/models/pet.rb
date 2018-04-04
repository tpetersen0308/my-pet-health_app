class Pet < ApplicationRecord
  belongs_to :owner
  has_many :veterinarians
  has_many :health_screenings

  validates :name, presence: true
  validates :species, presence: true
  validates :owner_id, presence: true

  after_initialize :initialize_screenings

  def initialize_screenings
    if self.health_screenings.empty?
      (self.cat? ? HealthScreening.cat_screenings : HealthScreening.dog_screenings).each do |name, interval|
        self.health_screenings.build(kind: name, renewal_interval: interval, species: self.species)
      end
      self.save
    end  
  end

  def cat?
    self.species == "Cat"
  end

  def dog?
    self.species == "Dog"
  end
end
