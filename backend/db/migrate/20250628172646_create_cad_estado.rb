class CreateCadEstado < ActiveRecord::Migration[6.1]
  def change
    create_table :cad_estado do |t|
      t.string :descricao
      t.string :sigla

      t.timestamps
    end
  end
end