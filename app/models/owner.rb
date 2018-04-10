class Owner < User
  has_many :pets
  has_many :veterinarians, through: :pets

  def self.find_by_first_and_last_name(*args)
    Owner.find_by(:first_name => args.first, :last_name => args.last)
  end
end
