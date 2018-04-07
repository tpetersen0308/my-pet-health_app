class HealthScreeningsController < ApplicationController

  def index
    @health_screenings = HealthScreening.find_by(:pet_id => params.require(:pet_id))
  end

end
