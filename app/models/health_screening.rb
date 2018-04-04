class HealthScreening < ApplicationRecord
  belongs_to :pet

  def current?
    now = DateTime.now
    if last_updated
      if renewal_interval
        (now.year * 12 + now.month) - (last_updated.year * 12 + last_updated.month) < renewal_interval*12
      else
        true #some screenings must only be performed once
      end
    else
      false #screening has never been performed
    end
  end

  def dog_screenings

    {"Parvovirus" => 3, 
     "CAV-1/Canine Hepatitis" => 3, 
     "CAV-2/Kennel Cough" => 3,
     "Distemper" => 3,
     "Rabies" => 3,
     "Canine Influenza" => 1,
     "Lyme" => 1,
     "Stool Analysis" => 1}

  end

  def cat_screenings
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
