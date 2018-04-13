class SessionsController < ApplicationController

  def new
    @user = User.new
  end

  def create
    if auth
      user = User.find_or_create_by(uid: auth['uid']) do |u|
        u.first_name = auth['info']['name'].split(" ").first
        u.last_name = auth['info']['name'].split(" ").last
        u.email = auth['info']['email']
      end
      
      user.becomes("Owner")

      user.save

      session[:user_id] = user.id
   
      render redirect_to user_path(user)
    else
      user = User.ci_find("email", params[:email])

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
  end

  def destroy
    session.delete :user_id
    redirect_to root_path
  end

  private

    def auth
      request.env['omniauth.auth']
    end
end
