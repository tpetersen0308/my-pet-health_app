class ReplacePetsAgeWithBirthdate < ActiveRecord::Migration[5.1]
  def change
    remove_column :pets, :age, :string
    add_column :pets, :birth_date, :datetime
  end
end
