Rails.application.routes.draw do

  get "login" => "sessions#new", as: "login"
  post "login" => "sessions#create"
  get "logout" => "sessions#destroy", as: "logout"

  resources :pets, only: [:index, :show] do
    resources :health_screenings
  end

  resources :users do 
    resources :pets
    patch "/pets" => "pets#update"
  end

  resources :health_screenings

  root "welcome#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
