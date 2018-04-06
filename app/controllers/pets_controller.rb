class PetsController < ApplicationController

  def index
    if params[:user_id]
      @user = User.find_by(:id => params.require(:user_id))
      if @user
        if @user.owner?
          @pets = Pet.all.select{|pet| pet.owner_id == @user.id}
        elsif @user.vet?
          @pets = Pet.all.select{|pet| pet.veterinarian_id == @user.id}
        end
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
