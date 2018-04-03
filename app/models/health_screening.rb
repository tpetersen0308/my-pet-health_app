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
    # parvo, canine influenza, bordetella (annually), stool sample (biennially)
  end

  def cat_screenings
    # generate set of new screenings for cats
    # feline influenza, FVRCP (annually), stool sample (annually) 
  end

  def dog_and_cat_screenings
    # generate set of new screenings that apply to both dogs and cats
    # rabies (1 yr cats 3 yr dogs), fleas/ticks
  end
end
