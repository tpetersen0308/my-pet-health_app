class CreatePetsVeterinarians < ActiveRecord::Migration[5.1]
  def change
    create_table :pets_veterinarians do |t|
      t.belongs_to :pet, index: true
      t.belongs_to :veterinarian, index: true
    end
  end
end
