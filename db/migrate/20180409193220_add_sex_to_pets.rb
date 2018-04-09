class AddSexToPets < ActiveRecord::Migration[5.1]
  def change
    add_column :pets, :sex, :string
  end
end
