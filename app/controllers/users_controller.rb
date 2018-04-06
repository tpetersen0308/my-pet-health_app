class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    if params[:user][:vet]
      user = Veterinarian.new(user_params)
    else
      user = Owner.new(user_params)
    end

    if user.save
      session[:user_id] = user.id
      redirect_to user_path(user)
    else
      @user = User.new
      render :new
    end
  end

  def show

  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end
end
