module HealthScreeningsHelper

  def last_updated(screening)
    screening.last_updated("%B %e, %Y")
  end

end
