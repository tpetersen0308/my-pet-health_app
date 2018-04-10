class HealthScreeningsController < ApplicationController
  before_action :logged_in_only, only: [:edit]
  before_action :vets_only, only: [:edit]


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
    health_screening = HealthScreening.find_by(:id => params.require(:id))
    
    if health_screening.update(screening_params)
      health_screening.pet.veterinarians << current_user unless health_screening.pet.veterinarians.include?(current_user)
      health_screening.pet.save
      redirect_to pet_health_screenings_path(health_screening.pet)
    else
      render :edit
    end
  end

  private
  def screening_params
    params.require(:health_screening).permit(:last_updated)
  end

end
