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

  end

  def new

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
