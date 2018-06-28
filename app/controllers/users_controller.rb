class UsersController < ApplicationController

  def new
    @user = User.new
    render partial: "form", locals: {user: @user}
  end

  def create
    if params[:vet]
      @user = Veterinarian.new(user_params)
    else
      @user = Owner.new(user_params)
    end

    if @user.save
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      render :new
    end
  end

  def show
    @user = User.find_by(:id => params[:id])
    conditional_render(:show, @user)
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end
end
