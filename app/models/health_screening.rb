class HealthScreening < ApplicationRecord
  belongs_to :pet
  validate :last_updated_cannot_be_prior_to_birth_date
  after_find :update_status



  def last_updated_cannot_be_prior_to_birth_date
    if last_updated && last_updated.year*12 + last_updated.month < pet.birth_date.year*12 + pet.birth_date.month
      errors.add(:last_updated, "Cannot be prior to pet's date of birth.")
    end
  end

  def update_status
    if months_since_last_updated
      if months_since_last_updated > renewal_interval*12
        self.status = "Overdue"
      else
        self.status = "Current"
      end
    else self.status = "Overdue"
    end
    self.save
  end

  def current?
    if last_updated
      if renewal_interval
        months_since_last_updated < renewal_interval*12
      else
        true #some screenings must only be performed once
      end
    else
      false #screening has never been performed
    end
  end

  def months_since_last_updated
    now = DateTime.now
    if last_updated
      (now.year * 12 + now.month) - (last_updated.year * 12 + last_updated.month)
    end
  end

  def self.current
    where(status: "Current")
  end

  def self.overdue
    where(status: "Overdue")
  end

  def self.dog_screenings

    {"Parvovirus" => 3, 
     "CAV-1/Canine Hepatitis" => 3, 
     "CAV-2/Kennel Cough" => 3,
     "Distemper" => 3,
     "Rabies" => 3,
     "Canine Influenza" => 1,
     "Lyme" => 1,
     "Stool Analysis" => 1,
     "Spayed/Neutered" => 1000}

  end

  def self.cat_screenings
    {"Feline Influenza" => 1,
     "Feline Leukemia" => 1,
     "Bordetella" => 1,
     "Rabies" => 1,
     "Stool Analysis" => 1,
     "Feline Distemper" => 3,
     "Feline Herpesvirus" => 3,
     "Calcivirus" => 3,
     "Spayed/Neutered" => 1000}
  end

end
