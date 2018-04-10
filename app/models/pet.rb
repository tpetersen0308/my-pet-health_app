class Pet < ApplicationRecord
  belongs_to :owner
  has_many :pets_veterinarians
  has_many :veterinarians, through: :pets_veterinarians
  has_many :health_screenings

  validates :name, presence: true
  validates :species, presence: true, inclusion: {in: %w(Dog Cat)}
  validates :owner_id, presence: true
  validates :birth_date, presence: true
  validates :sex, presence: true, inclusion: {in: %w(Male Female)}

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

  def age
    now = DateTime.now
    months = (now.year*12 + now.month) - (self.birth_date.year*12 + self.birth_date.month)
    "#{months/12} years, #{months%12} months"
  end

  def self.get_pets_by_user_type(user)
    if user.owner?
      self.all.select{|pet| pet.owner_id == user.id}
    elsif user.vet?
      self.all.select{|pet| pet.veterinarian_ids.include?(user.id)}
    end
  end
end
