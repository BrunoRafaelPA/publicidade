class Api::V1::PublicidadesController < ApplicationController
  before_action :set_publicidade, only: [:show, :update, :destroy]

  def index
    @publicidades = Publicidade.includes(:estados).all
    
    publicidades_with_images = @publicidades.map do |publicidade|
      publicidade_hash = publicidade.as_json(include: :estados)
      
      # Se a imagem existe e já está em formato base64, usa diretamente
      if publicidade.imagem.present? && publicidade.imagem.start_with?('data:')
        publicidade_hash['imagem_base64'] = publicidade.imagem
      else
        publicidade_hash['imagem_base64'] = nil
      end
      
      publicidade_hash
    end
    
    render json: publicidades_with_images
  end

  def show
    publicidade_hash = @publicidade.as_json(include: :estados)
    
    # Se a imagem existe e já está em formato base64, usa diretamente
    if @publicidade.imagem.present? && @publicidade.imagem.start_with?('data:')
      publicidade_hash['imagem_base64'] = @publicidade.imagem
    else
      publicidade_hash['imagem_base64'] = nil
    end
    
    render json: publicidade_hash
  end

  def create
    begin
      ActiveRecord::Base.transaction do
        # Processa a imagem se fornecida
        imagem_base64 = nil
        if params[:publicidade][:imagem].present?
          uploaded_file = params[:publicidade][:imagem]
          
          # Lê o arquivo e converte para base64
          if uploaded_file.respond_to?(:read)
            uploaded_file.rewind if uploaded_file.respond_to?(:rewind)
            file_content = uploaded_file.read
            encoded_image = Base64.strict_encode64(file_content)
            imagem_base64 = "data:#{uploaded_file.content_type};base64,#{encoded_image}"
          end
        end
        
        # Cria a publicidade com os parâmetros (exceto estados_ids e imagem)
        publicidade_params_clean = publicidade_params_without_estados_and_image
        publicidade_params_clean[:imagem] = imagem_base64 if imagem_base64
        
        @publicidade = Publicidade.new(publicidade_params_clean)
        
        if @publicidade.save
          # Associa os estados selecionados
          if params[:publicidade][:estados_ids].present?
            estado_ids = params[:publicidade][:estados_ids].map(&:to_i)
            estados = Estado.where(id: estado_ids)
            @publicidade.estados = estados
          end
          
          # Retorna apenas dados básicos sem a imagem binária
          publicidade_response = {
            id: @publicidade.id,
            titulo: @publicidade.titulo,
            descricao: @publicidade.descricao,
            dt_inicio: @publicidade.dt_inicio,
            dt_fim: @publicidade.dt_fim,
            botao_link: @publicidade.botao_link,
            titulo_botao_link: @publicidade.titulo_botao_link,
            created_at: @publicidade.created_at,
            updated_at: @publicidade.updated_at,
            estados: @publicidade.estados.as_json(only: [:id, :descricao]),
            tem_imagem: @publicidade.imagem.present?
          }
          
          render json: { 
            message: 'Publicidade criada com sucesso!', 
            publicidade: publicidade_response 
          }, status: :created
        else
          render json: { errors: @publicidade.errors.full_messages }, status: :unprocessable_entity
        end
      end
    rescue => e
      Rails.logger.error "Erro ao criar publicidade: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Erro interno do servidor ao criar publicidade' }, status: :internal_server_error
    end
  end

  def update
    begin
      ActiveRecord::Base.transaction do
        # Processa a imagem se fornecida
        update_params = publicidade_params_without_estados_and_image
        
        if params[:publicidade][:imagem].present?
          uploaded_file = params[:publicidade][:imagem]
          
          # Lê o arquivo e converte para base64
          if uploaded_file.respond_to?(:read)
            uploaded_file.rewind if uploaded_file.respond_to?(:rewind)
            file_content = uploaded_file.read
            encoded_image = Base64.strict_encode64(file_content)
            update_params[:imagem] = "data:#{uploaded_file.content_type};base64,#{encoded_image}"
          end
        end
        
        if @publicidade.update(update_params)
          # Atualiza os estados associados
          if params[:publicidade][:estados_ids].present?
            estado_ids = params[:publicidade][:estados_ids].map(&:to_i)
            estados = Estado.where(id: estado_ids)
            @publicidade.estados = estados
          end
          
          # Retorna apenas dados básicos sem a imagem binária
          publicidade_response = {
            id: @publicidade.id,
            titulo: @publicidade.titulo,
            descricao: @publicidade.descricao,
            dt_inicio: @publicidade.dt_inicio,
            dt_fim: @publicidade.dt_fim,
            botao_link: @publicidade.botao_link,
            titulo_botao_link: @publicidade.titulo_botao_link,
            created_at: @publicidade.created_at,
            updated_at: @publicidade.updated_at,
            estados: @publicidade.estados.as_json(only: [:id, :descricao]),
            tem_imagem: @publicidade.imagem.present?
          }
          
          render json: { 
            message: 'Publicidade atualizada com sucesso!', 
            publicidade: publicidade_response 
          }
        else
          render json: { errors: @publicidade.errors.full_messages }, status: :unprocessable_entity
        end
      end
    rescue => e
      Rails.logger.error "Erro ao atualizar publicidade: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Erro interno do servidor ao atualizar publicidade' }, status: :internal_server_error
    end
  end

  def destroy
    begin
      if @publicidade.destroy
        render json: { message: 'Publicidade removida com sucesso!' }
      else
        render json: { errors: @publicidade.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "Erro ao remover publicidade: #{e.message}"
      render json: { error: 'Erro interno do servidor ao remover publicidade' }, status: :internal_server_error
    end
  end

  private

  def set_publicidade
    @publicidade = Publicidade.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Publicidade não encontrada' }, status: :not_found
  end

  def publicidade_params
    params.require(:publicidade).permit(
      :titulo, 
      :descricao, 
      :dt_inicio, 
      :dt_fim, 
      :botao_link, 
      :titulo_botao_link, 
      :imagem,
      estados_ids: []
    )
  end

  def publicidade_params_without_estados
    params.require(:publicidade).permit(
      :titulo, 
      :descricao, 
      :dt_inicio, 
      :dt_fim, 
      :botao_link, 
      :titulo_botao_link, 
      :imagem
    )
  end

  def publicidade_params_without_estados_and_image
    params.require(:publicidade).permit(
      :titulo, 
      :descricao, 
      :dt_inicio, 
      :dt_fim, 
      :botao_link, 
      :titulo_botao_link
    )
  end
end