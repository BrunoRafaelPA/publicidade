class Estado < ApplicationRecord
    self.table_name = "cad_estado"
    has_many :publicidade_estados, class_name: "PublicidadeEstado", foreign_key: "id_estado"
    has_many :publicidades, through: :publicidade_estados
end
