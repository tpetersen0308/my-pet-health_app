class PetsController < ApplicationController
  before_action :owners_only, only: [:new, :edit, :destroy]


  def index
    if params[:user_id]
      @user = User.find_by(:id => params.require(:user_id))
      if @user
        @pets = Pet.get_pets_by_user_type(@user)
      else
        flash[:alert] = "Cannot find user."
        redirect_to root_path
      end
    else
      @pets = Pet.all  
    end 
  end


  def show
    @pet = Pet.find_by(:id => params.require(:id))

    if @pet
      if params[:user_id]
        user = User.find_by(:id => params.require(:user_id))
        if @pet.owner != user || @pet.veterinarians.include?(user)
          flash[:alert] = "The requests pet and user do not match"
          redirect_to root_path
        end
      end
    else
      flash[:alert] = "Invalid request"
      redirect_to root_path
    end
  end

  def new
    if User.find_by(:id => params.require(:user_id)) == current_user
      @pet = current_user.pets.build
    elsif current_user
      flash[:alert] = "New pets may only be added to the current user account."
      redirect_to root_path
    end

  end

  def create
    pet = Pet.new(pet_params)

    if pet.save
      redirect_to user_pet_path(pet.owner, pet)
    else
      render :new
    end
  end

  def edit
    @pet = Pet.find_by(:id => params.require(:id))
    if @pet && @pet.owner != current_user
      flash[:alert] = "Only a pet's owner may edit their information!"
      render user_path(current_user)
    elsif !@pet
      flash[:alert] = "Sorry, we were unable to locate that pet in our database."
      render user_path(current_user)
    end
  end

  def update
    pet = Pet.find_by(:id => params.require(:id))
    if pet.update(pet_params)
      redirect_to user_pet_path(pet.owner, pet)
    else
      render :edit
    end
  end

  def destroy
    Pet.find_by(:id => params[:id]).destroy
    redirect_to user_path(current_user)
  end

  def search
    pet = Pet.find_by(pet_search_params)

    if pet && pet.owner == Owner.find_by(:last_name => params.require(:pet).require(:owner_name))
      redirect_to pet_health_screenings_path(pet)
    else
      flash[:alert] = "Sorry, we are unable to locate a pet that matches your search criteria"
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

end
