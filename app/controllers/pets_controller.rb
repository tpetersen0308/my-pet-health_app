class PetsController < ApplicationController
  before_action :logged_in_only, only: [:new, :edit, :destroy]
  before_action :owners_only, only: [:new, :edit, :destroy]
  before_action :set_pet, only: [:show, :edit, :update, :destroy]
  
  def new
    if User.find_by(:id => params.require(:user_id)) == current_user
      @pet = current_user.pets.build
    elsif current_user
      flash[:alert] = "New pets may only be added to the current user account."
      redirect_to pets_path
    end
  end

  def index
    if params[:user_id]
      @search_ok = false
      @user = User.find_by(:id => params.require(:user_id))
      if @user
        if params[:species]
          @pets = @user.pets.send(params[:species].pluralize)
        else
          @pets = Pet.get_pets_by_user_type(@user)
        end
      else
        flash[:alert] = "Cannot find user."
        redirect_to pets_path
      end
    else
      @search_ok = true
      @pets = Pet.all
    end 
  end


  def show
    if @pet
      if params[:user_id]
        user = User.find_by(:id => params.require(:user_id))
        if @pet.owner != user || @pet.veterinarians.include?(user)
          flash[:alert] = "The request's pet and user do not match."
          redirect_to pets_path
        end
      end
      respond_to do |format|
        format.html { render :show }
        format.json { render json: @pet }
      end
    else
      flash[:alert] = "Sorry, we were unable to locate that pet in our database."
      redirect_to pets_path
    end
  end


  def create
    @pet = Pet.new(pet_params)

    if @pet.save
      redirect_to user_pet_path(@pet.owner, @pet)
    else
      render :new
    end
  end

  def edit
    if @pet && @pet.owner != current_user
      flash[:alert] = "Only a pet's owner may edit their information!"
      redirect_to user_path(current_user)
    elsif !@pet
      flash[:alert] = "Sorry, we were unable to locate that pet in our database."
      redirect_to user_path(current_user)
    end
  end

  def update

    if @pet.update(pet_params)
      redirect_to user_pet_path(@pet.owner, @pet)
    else
      render :edit
    end
  end

  def destroy
    @pet.destroy
    flash[:message] = "#{@pet.name} has been removed from your pets."
    redirect_to user_path(current_user)
  end

  def search
    pet = Pet.find_by(pet_search_params)
    if pet && pet.owner == Owner.find_by_first_and_last_name(params.require(:pet).permit(:owner_first_name, :owner_last_name).values)
      redirect_to pet_health_screenings_path(pet)
    else
      flash[:alert] = "Sorry, we are unable to locate a pet that matches your search criteria."
      redirect_to pets_path
    end
  end

private
  def pet_params
    params.require(:pet).permit(:name, :birth_date, :species, :sex, :owner_id)
  end

  def pet_search_params
    params.require(:pet).permit(:name, :species)
  end

  def set_pet
    @pet = Pet.find_by(:id => params.require(:id))
  end

end
