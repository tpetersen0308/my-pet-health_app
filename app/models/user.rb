class User < ApplicationRecord
  has_secure_password

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true

  def name
    "#{self.first_name} #{self.last_name}"
  end

  def owner?
    self.class.name == "Owner"
  end

  def vet?
    self.class.name == "Veterinarian"
  end
end
