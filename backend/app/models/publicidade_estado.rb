class PublicidadeEstado < ApplicationRecord
  self.table_name = 'cad_publicidade_estado'

  belongs_to :publicidade, foreign_key: 'id_publicidade', inverse_of: :publicidade_estados
  belongs_to :estado, foreign_key: 'id_estado'

  validates :estado, presence: true
end