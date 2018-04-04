class AddForeignKeyToPets < ActiveRecord::Migration[5.1]
  def change
    add_column :pets, :owner_id, :integer
  end
end
