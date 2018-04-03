class HealthScreening < ApplicationRecord
  belongs_to :pet

  def current?
    now = DateTime.now
    if renewal_interval
      (now.year * 12 + now.month) - (last_updated.year * 12 + last_updated.month) > 0
    else
      true
    end
  end
end
