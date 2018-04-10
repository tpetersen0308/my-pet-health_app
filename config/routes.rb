Rails.application.routes.draw do

  get "login" => "sessions#new", as: "login"
  post "login" => "sessions#create"
  get "logout" => "sessions#destroy", as: "logout"
  post "pets/search" => "pets#search"
  
  resources :pets, only: [:index, :show] do
    resources :health_screenings, only: [:index, :edit, :update] 
    get "health_screenings/:status" => "health_screenings#index"
  end

  resources :users, only: [:new, :create, :show] do 
    resources :pets
  end

  resources :health_screenings, only: [:edit, :update]

  root "welcome#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
