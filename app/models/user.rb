class User < ApplicationRecord
  has_secure_password

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: {case_sensitive: false}
  validates_format_of :email, with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create

  def self.ci_find(attribute, value)
    where("lower(#{attribute}) = ?", value.downcase).first
  end

  def name
    "#{self.first_name} #{self.last_name}"
  end

  def owner?
    self.class.name == "Owner"
  end

  def vet?
    self.class.name == "Veterinarian"
  end

  def self.from_oauth(auth)
    self.find_or_create_by(uid: auth['uid']) do |u|
      u.first_name = auth['info']['name'].split(" ").first
      u.last_name = auth['info']['name'].split(" ").last
      u.email = auth['info']['email']
      u.password = SecureRandom.hex
    end
  end
end
