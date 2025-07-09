class Publicidade < ApplicationRecord
  self.table_name = "cad_publicidade"

  validates :titulo, :descricao, :botao_link, :titulo_botao_link, :dt_inicio, :dt_fim, presence: true
  validates :imagem, presence: true 

  validate :validar_vigencia

  has_many :publicidade_estados, class_name: "PublicidadeEstado", foreign_key: "id_publicidade", inverse_of: :publicidade, dependent: :destroy
  has_many :estados, through: :publicidade_estados

  accepts_nested_attributes_for :publicidade_estados, allow_destroy: true

  def imagem_base64
    return unless imagem.present?

    "data:image/jpeg;base64,#{Base64.strict_encode64(imagem)}"
  end

  private

  def validar_vigencia
    if dt_inicio.present? && dt_fim.present? && dt_fim <= dt_inicio
      errors.add(:dt_fim, "Data final de publicação deve ser maior que a data inicial")
    end
  end
end