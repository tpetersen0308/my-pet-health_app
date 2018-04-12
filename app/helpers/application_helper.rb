module ApplicationHelper

  def nav_header
    nav_html = content_tag(:li, link_to("Home", root_path))
    if logged_in?
      nav_html += content_tag(:li, link_to("Sign Out", logout_path))
      if current_user.owner?
        nav_html += content_tag(:li, link_to("My Pets", user_pets_path(current_user))) +
                    content_tag(:li, link_to("Register a New Pet", new_user_pet_path(current_user)))
      elsif current_user.vet?
        nav_html += content_tag(:li, link_to("My Patients", user_pets_path(current_user)))
      end
    else
      nav_html += content_tag(:li, link_to("Sign Up", new_user_path)) +
                  content_tag(:li, link_to("Sign In", login_path)) +
                  content_tag(:li, link_to("Sign In With GitHub", "/auth/github"))
    end
    nav_html += content_tag(:li, link_to("Find a Pet", pets_path))
  end
end
