class SessionsController < ApplicationController

  def new
    @user = User.new
  end

  def create
    user = user.find_by(:email => params[:email])

    return head(:forbidden) unless user.authenticate(params[:password])
    session[:user_id] = user.id

    redirect_to user_path(user)
  end



end
