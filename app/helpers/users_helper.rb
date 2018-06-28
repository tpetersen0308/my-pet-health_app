module UsersHelper

  def user_pets_link(user)
    if user.owner?
      link_to "View #{user.first_name}'s Pets", user_pets_path(user), class: 'js-viewPets', data: {id: user.id, name: user.first_name}
    elsif user.vet?
      link_to "View Dr. #{user.first_name}'s Patients", user_pets_path(user), class: 'js-viewPets', data: {id: user.id, name: user.first_name}
    end
  end

end
