# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180405001427) do

  create_table "health_screenings", force: :cascade do |t|
    t.string "kind"
    t.string "species"
    t.integer "renewal_interval"
    t.datetime "last_updated"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "pet_id"
    t.string "status", default: "Overdue"
  end

  create_table "pets", force: :cascade do |t|
    t.string "name"
    t.string "species"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "owner_id"
    t.datetime "birth_date"
  end

  create_table "pets_veterinarians", force: :cascade do |t|
    t.integer "pet_id"
    t.integer "veterinarian_id"
    t.index ["pet_id"], name: "index_pets_veterinarians_on_pet_id"
    t.index ["veterinarian_id"], name: "index_pets_veterinarians_on_veterinarian_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "type"
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
