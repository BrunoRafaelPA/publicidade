class CreatePublicidadeEstados < ActiveRecord::Migration[8.0]
  def change
    create_table :publicidade_estados do |t|
      t.timestamps
    end
  end
end
