class PetsController < ApplicationController

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
  end

  def destroy

  end

private
  def pet_params
    params.require(:pet).permit(:name, :birth_date, :species, :sex, :owner_id)
  end

end
