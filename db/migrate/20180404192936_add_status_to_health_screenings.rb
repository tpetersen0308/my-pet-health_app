class AddStatusToHealthScreenings < ActiveRecord::Migration[5.1]
  def change
    add_column :health_screenings, :status, :string, default: "Overdue"
  end
end
