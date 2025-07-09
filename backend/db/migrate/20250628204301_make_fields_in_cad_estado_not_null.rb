class MakeFieldsInCadEstadoNotNull < ActiveRecord::Migration[6.1]
  def change
    change_column_null :cad_estado, :descricao, false

    change_column_null :cad_estado, :sigla, false
  end
end