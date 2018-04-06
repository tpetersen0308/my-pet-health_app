class SessionsController < ApplicationController

  def new
    @user = User.new
  end

  def create
    user = User.find_by(:email => params[:email])

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id

      redirect_to user_path(user)
    elsif user
      flash.now[:alert] = "Incorrect password for #{user.email}"
      render :new
    else
      flash.now[:alert] = "The email address #{params[:email]} does not exist in our records."
      render :new
    end
  end

  def destroy
    session.delete :user_id
    redirect_to root_path
  end

end
