class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user
  helper_method :logged_in?
  helper_method :vets_only
  helper_method :owners_only

  private
    def current_user
      User.find_by(:id => session[:user_id])
    end

    def logged_in?
      session[:user_id] ? true : false
    end

    def vets_only
      if !current_user.vet?
        flash[:alert] = "Sorry, that action is only available to veterinarians."
        redirect_to user_path(current_user)
      end
    end

    def owners_only
      if !current_user.owner?
        flash[:alert] = "Sorry, that action is only available to pet owners."
        redirect_to user_path(current_user)
      end
    end

    def logged_in_only
      if !logged_in?
        flash[:alert] = "Please log in to view that page."
        redirect_to login_path
      end
    end

    def conditional_render(view, obj)
      respond_to do |format|
        format.html { render view.to_sym }
        format.json { render json: obj, status: 201 }
      end
    end
end
