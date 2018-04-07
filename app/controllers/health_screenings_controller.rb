class HealthScreeningsController < ApplicationController

  def index
    pet = Pet.find_by(:id => params.require(:pet_id))
    @health_screenings = HealthScreening.all.select{|hs| hs.pet == pet}
  end

end
