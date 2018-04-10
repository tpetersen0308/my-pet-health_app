class User < ApplicationRecord
  has_secure_password

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true
  validates_format_of :email, with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create

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
