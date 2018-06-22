class HealthScreeningsController < ApplicationController
  before_action :logged_in_only, only: [:edit]
  before_action :vets_only, only: [:edit]
  before_action :set_screening, only: [:edit, :update, :show]
  before_action :set_pet, only: [:index]


  def index
    if @pet 
      if params[:status]
        @status = params[:status]
        @health_screenings = @pet.health_screenings.send(@status)
      else
        @health_screenings = HealthScreening.all.select{|hs| hs.pet == @pet}
      end
    else
      flash[:alert] = "Sorry, we were unable to locate that pet in our database."
      redirect_to pets_path
    end
    conditional_render(:index, @health_screenings)
  end

  def show
    if @health_screening
      render json: @health_screening
    else
      flash[:alert] = "Invalid request"
      redirect_to pets_path
    end
  end

  def edit
    if !@health_screening || @health_screening.pet != Pet.find_by(:id => params.require(:pet_id))
      flash[:alert] = "Invalid request"
      redirect_to pets_path
    end
    render :partial => "health_screenings/form", locals: {health_screening: @health_screening}
  end

  def update
    if @health_screening.update(screening_params)
      @health_screening.pet.veterinarians << current_user unless @health_screening.pet.veterinarians.include?(current_user)
      @health_screening.pet.save
      redirect_to pet_health_screenings_path(@health_screening.pet)
    else
      render :edit
    end
  end

  private
  def screening_params
    params.require(:health_screening).permit(:last_updated)
  end

  def set_screening
    @health_screening = HealthScreening.find_by(:id => params.require(:id))
  end

  def set_pet
    @pet = Pet.find_by(:id => params.require(:pet_id))
  end

end
