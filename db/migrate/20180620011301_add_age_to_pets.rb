class AddAgeToPets < ActiveRecord::Migration[5.1]
  def change
    add_column :pets, :age, :string
  end
end
