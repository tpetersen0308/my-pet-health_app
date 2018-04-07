module HealthScreeningsHelper

  def last_updated(screening)
    screening.last_updated ? screening.last_updated.strftime("%B %e, %Y") : "Never"
  end

end
