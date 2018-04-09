class HealthScreeningsController < ApplicationController

  def index
    pet = Pet.find_by(:id => params.require(:pet_id))
    @health_screenings = HealthScreening.all.select{|hs| hs.pet == pet}
  end

  def edit
    @health_screening = HealthScreening.find_by(:id => params.require(:id))

    if !@health_screening || @health_screening.pet != Pet.find_by(:id => params.require(:pet_id))
      flash[:alert] = "Invalid request"
      redirect_to root_path
    end
  end

  def update

  end

end
