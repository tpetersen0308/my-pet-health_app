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

  after_save :set_or_update_age
  after_find :set_or_update_age
  after_initialize :initialize_screenings

  scope :cats, -> {where(species: "Cat")}
  scope :dogs, -> {where(species: "Dog")}

  def initialize_screenings
    if self.health_screenings.empty?
      (self.cat? ? HealthScreening.cat_screenings : HealthScreening.dog_screenings).each do |name, interval|
        self.health_screenings.build(kind: name, renewal_interval: interval, species: self.species)
      end
    end  
  end

  def cat?
    self.species == "Cat"
  end

  def dog?
    self.species == "Dog"
  end

  def set_or_update_age
    now = DateTime.now
    total_months = (now.year*12 + now.month) - (self.birth_date.year*12 + self.birth_date.month)
    years = total_months/12
    months = total_months%12
    if years > 0 && months > 0
      self.age = "#{years} years, #{months} months"
    elsif months > 0  
      self.age = "#{months} months"
    else
      self.age = "#{years} years"
    end
  end

  def self.get_pets_by_user_type(user)
    if user.owner?
      self.all.select{|pet| pet.owner_id == user.id}
    elsif user.vet?
      self.all.select{|pet| pet.veterinarian_ids.include?(user.id)}
    end
  end

  def self.ci_search(attribute, value)
    where("lower(#{attribute}) = ?", value.downcase)
  end
end
