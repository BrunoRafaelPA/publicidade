class CreateCadPublicidadeEstado < ActiveRecord::Migration[6.1]
  def change
    create_table :cad_publicidade_estado do |t|
      t.bigint :id_publicidade, null: false
      t.bigint :id_estado, null: false

      t.timestamps
    end

    add_index :cad_publicidade_estado, :id_publicidade
    add_index :cad_publicidade_estado, :id_estado
  end
end
