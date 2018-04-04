class ChangeIntervalDataTypeAndAddForeignKeyToHealthScreenings < ActiveRecord::Migration[5.1]
  def change
    add_column :health_screenings, :pet_id, :integer
    change_column :health_screenings, :renewal_interval, :integer
  end
end
