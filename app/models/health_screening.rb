class HealthScreening < ApplicationRecord
  belongs_to :pet

  def current?
    now = DateTime.now
    if last_updated
      if renewal_interval
        (now.year * 12 + now.month) - (last_updated.year * 12 + last_updated.month) > 0
      else
        true #some screenings must only be performed once
      end
    else
      false #screening has never been performed
    end
  end

  def dog_screenings
    # generate set of new screenings for dogs
  end

  def cat_screenings
    # generate set of new screenings for cats
  end

  def dog_and_cat_screenings
    # generate set of new screenings that apply to both dogs and cats
  end
end
