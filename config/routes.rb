Rails.application.routes.draw do

  get "login" => "sessions#new", as: "login"
  post "login" => "sessions#create"
  get "logout" => "sessions#destroy", as: "logout"

  resources :pets, only: [:index, :show]

  resources :users do 
    resources :pets
  end

  root "welcome#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
