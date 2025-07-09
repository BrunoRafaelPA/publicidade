class CreateCadPublicidade < ActiveRecord::Migration[8.0]
  def change
    create_table :cad_publicidade do |t|
      t.string :titulo, null: false
      t.text :descricao, null: false
      t.string :imagem, null: false
      t.string :botao_link, null: false
      t.string :titulo_botao_link, null: false
      t.date :dt_inicio, null: false
      t.date :dt_fim, null: false

      t.timestamps
    end
  end
end
