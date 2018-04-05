class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  private
    def current_user
      User.find_by(:id => session[:user_id])
    end

    def logged_in?
      session[:user_id]
    end

    def vets_only
      if current_user.class.name != "Veterinarian"
        flash[:alert] = "Sorry, that action is only available to veterinarians."
        redirect_to user_path(current_user)
      end
    end

    def owners_only
      if current_user.class.name != "Owner"
        flash[:alert] = "Sorry, that action is only available to pet owners."
        redirect_to user_path(current_user)
      end
    end
end
