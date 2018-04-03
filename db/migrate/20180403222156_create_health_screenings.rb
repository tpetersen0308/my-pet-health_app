class CreateHealthScreenings < ActiveRecord::Migration[5.1]
  def change
    create_table :health_screenings do |t|
      t.string :kind
      t.string :species
      t.string :renewal_interval
      t.datetime :last_updated

      t.timestamps
    end
  end
end
