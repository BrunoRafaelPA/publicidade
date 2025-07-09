class CreatePublicidades < ActiveRecord::Migration[8.0]
  def change
    create_table :publicidades do |t|
      t.timestamps
    end
  end
end
