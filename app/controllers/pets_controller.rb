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

  end

  def edit

  end

  def update

  end

  def destroy

  end

end
