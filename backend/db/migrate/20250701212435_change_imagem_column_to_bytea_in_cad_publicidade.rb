class ChangeImagemColumnToByteaInCadPublicidade < ActiveRecord::Migration[6.1]
  def change
    change_column :cad_publicidade, :imagem, :binary, using: 'imagem::bytea'
  end
end
