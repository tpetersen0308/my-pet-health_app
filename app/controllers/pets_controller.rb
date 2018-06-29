class PetsController < ApplicationController
  before_action :logged_in_only, only: [:new, :edit, :destroy]
  before_action :owners_only, only: [:new, :edit, :destroy]
  before_action :set_pet, only: [:show, :edit, :update, :destroy]
  
  def new
    if User.find_by(:id => params.require(:user_id)) == current_user
      @pet = current_user.pets.build
      render :partial => "pets/form", locals: {pet: @pet}
    elsif current_user
      flash[:alert] = "New pets may only be added to the current user account."
      redirect_to pets_path
    end
  end

  def index
    if params[:user_id]
      @user = User.find_by(:id => params.require(:user_id))
      if @user
        if params[:species]
          @pets = @user.pets.send(params[:species].pluralize)
        else
          @pets = Pet.get_pets_by_user_type(@user)
        end
      else
        flash[:alert] = "Cannot find user."
        redirect_to pets_path
      end
      conditional_render(:index, @pets)
    else
      render partial: "search"
    end 
  end


  def show
    if @pet
      if params[:user_id]
        user = User.find_by(:id => params.require(:user_id))
        if @pet.owner != user || @pet.veterinarians.include?(user)
          flash[:alert] = "The request's pet and user do not match."
          redirect_to pets_path
        end
      end
    else
      flash[:alert] = "Sorry, we were unable to locate that pet in our database."
      redirect_to pets_path
    end
    conditional_render(:show, @pet)
  end


  def create
    @pet = Pet.new(pet_params)

    if @pet.save
      render json: @pet, status: 201
    else
      render :partial => "pets/form", locals: {pet: @pet}
    end
  end

  def edit
    if @pet && @pet.owner != current_user
      flash[:alert] = "Only a pet's owner may edit their information!"
      redirect_to user_path(current_user)
    elsif !@pet
      flash[:alert] = "Sorry, we were unable to locate that pet in our database."
      redirect_to user_path(current_user)
    end
    render :partial => "pets/form", locals: {pet: @pet}
  end

  def update

    if @pet.update(pet_params)
      render json: @pet, status: 201
    else
      render :partial => "pets/form", locals: {pet: @pet}
    end
  end

  def destroy
    @pet.destroy
    render json: Pet.new, status: 201
  end

  def search
    #pets = Pet.ci_search("name", params[:pet][:name])
    #if !pets.empty? 
    #  render json: pets, status: 201
    #end
    binding.pry
    if [params[:pet][:name], params[:pet][:owner_first_name], params[:pet][:owner_last_name]]
      pets = Pet.where(owner_id: Owner.ci_find("last_name", params[:pet][:owner_last_name]).ci_find("first_name", params[:pet][:owner_first_name]).ids).ci_find("name", params[:pet][:name])
      render json: pets, status: 201
    end
  end

private
  def pet_params
    params.require(:pet).permit(:name, :birth_date, :species, :sex, :owner_id)
  end

  def pet_search_criteria
    params.require(:pet).permit(:name, :owner_first_name, :owner_last_name).values
  end

  def set_pet
    @pet = Pet.find_by(:id => params.require(:id))
  end

end
