class HealthScreening < ApplicationRecord
  belongs_to :pet

  after_find :update_status

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

  def self.dog_screenings

    {"Parvovirus" => 3, 
     "CAV-1/Canine Hepatitis" => 3, 
     "CAV-2/Kennel Cough" => 3,
     "Distemper" => 3,
     "Rabies" => 3,
     "Canine Influenza" => 1,
     "Lyme" => 1,
     "Stool Analysis" => 1}

  end

  def self.cat_screenings
    {"Feline Influenza" => 1,
     "Felines Leukemia" => 1,
     "Bordetella" => 1,
     "Rabies" => 1,
     "Stool Analysis" => 1,
     "Feline Distemper" => 3,
     "Feline Herpesvirus" => 3,
     "Calcivirus" => 3}
  end

end
