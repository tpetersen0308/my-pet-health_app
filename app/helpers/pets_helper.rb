module PetsHelper

  def url_for_pet_form(pet)
    if pet.persisted?
      "/users/#{pet.owner.id}/pets/#{pet.id}"
    else
      "/users/#{params[:user_id]}/pets"
    end
  end
end
