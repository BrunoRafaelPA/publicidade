# class EstadosController < ApplicationController
#     def index
#         estados = Estado.all 
#         render json: estados, status: :ok 
#     end
    
#     def create
#         estado = Estado.new(estado_params)
    
#         if estado.save
#         render json: estado, status: :created 
#         else
#         render json: { errors: estado.errors.full_messages }, status: :unprocessable_entity
#         end
#     end

#     private
#     def estado_params
#         params.require(:estado).permit(:descricao, :sigla)
#     end

# end
module Api
  module V1
    class EstadosController < ApplicationController
      def index
        estados = Estado.all
        render json: estados, status: :ok
      end

      def create
        estado = Estado.new(estado_params)

        if estado.save
          render json: estado, status: :created
        else
          render json: { errors: estado.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def estado_params
        params.require(:estado).permit(:descricao, :sigla)
      end
    end
  end
end