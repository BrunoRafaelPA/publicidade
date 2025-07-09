# Makefile

# Cores para output
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

.PHONY: help up down logs restart clean

help: ## Mostra esta ajuda
    @echo "Comandos disponíveis:"
    @grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Comandos principais - Desenvolvimento
up: ## Sobe o ambiente de desenvolvimento
    @echo "$(YELLOW)Subindo ambiente de desenvolvimento...$(NC)"
    docker-compose up --build

up-d: ## Sobe o ambiente em background
    @echo "$(YELLOW)Subindo ambiente em background...$(NC)"
    docker-compose up --build -d

down: ## Para o ambiente
    @echo "$(YELLOW)Parando ambiente...$(NC)"
    docker-compose down

logs: ## Mostra logs
    docker-compose logs -f

restart: ## Reinicia o ambiente
    @echo "$(YELLOW)Reiniciando ambiente...$(NC)"
    docker-compose restart

# Comandos principais - Produção
prod-up: ## Sobe o ambiente de produção
    @echo "$(YELLOW)Subindo ambiente de produção...$(NC)"
    docker-compose -f docker-compose.prod.yml up --build -d

prod-down: ## Para o ambiente de produção
    @echo "$(YELLOW)Parando ambiente de produção...$(NC)"
    docker-compose -f docker-compose.prod.yml down

prod-logs: ## Mostra logs de produção
    docker-compose -f docker-compose.prod.yml logs -f

# Comandos do Backend
backend-shell: ## Acessa shell do backend
    docker-compose exec backend sh

backend-console: ## Acessa console Rails
    docker-compose exec backend rails console

# Comandos do Frontend
frontend-shell: ## Acessa shell do frontend
    docker-compose exec frontend sh

frontend-install: ## Instala dependências do frontend
    docker-compose exec frontend npm install

frontend-build: ## Faz build do frontend
    docker-compose exec frontend npm run build

# Comandos do Banco de Dados
db-migrate: ## Executa migrações
    docker-compose exec backend rails db:migrate

db-seed: ## Executa seeds
    docker-compose exec backend rails db:seed

db-reset: ## Reseta banco de dados
    @echo "$(RED)ATENÇÃO: Isso irá apagar todos os dados!$(NC)"
    @read -p "Tem certeza? (y/N): " confirm && [ "$$confirm" = "y" ]
    docker-compose exec backend rails db:drop db:create db:migrate db:seed

db-console: ## Acessa console do PostgreSQL
    docker-compose exec database psql -U postgres -d publicidade_development

# Comandos de Limpeza
clean: ## Remove containers e volumes
    @echo "$(YELLOW)Limpando ambiente...$(NC)"
    docker-compose down -v

clean-prod: ## Remove containers e volumes de produção
    @echo "$(YELLOW)Limpando ambiente de produção...$(NC)"
    docker-compose -f docker-compose.prod.yml down -v

clean-all: ## Limpeza completa do Docker
    @echo "$(RED)ATENÇÃO: Isso irá remover TODOS os containers, imagens e volumes!$(NC)"
    @read -p "Tem certeza? (y/N): " confirm && [ "$$confirm" = "y" ]
    docker-compose down -v
    docker-compose -f docker-compose.prod.yml down -v
    docker system prune -af
    docker volume prune -f

# Comandos de Status
status: ## Mostra status dos containers
    @echo "$(GREEN)=== Desenvolvimento ====$(NC)"
    docker-compose ps
    @echo "$(GREEN)=== Produção ====$(NC)"
    docker-compose -f docker-compose.prod.yml ps

# Comandos de Build
build: ## Faz build das imagens
    docker-compose build

build-prod: ## Faz build das imagens de produção
    docker-compose -f docker-compose.prod.yml build

# Comandos de Teste
test: ## Executa testes do backend
    docker-compose exec backend rails test

test-frontend: ## Executa testes do frontend
    docker-compose exec frontend npm test

# Comandos de Rails
routes: ## Mostra rotas do Rails
    docker-compose exec backend rails routes

generate: ## Gera arquivos Rails (use: make generate model=User)
    docker-compose exec backend rails generate $(model)

# Gerar secret key
generate-secret: ## Gera uma nova secret key
    @echo "$(GREEN)Nova SECRET_KEY_BASE:$(NC)"
    @docker run --rm ruby:3.4.4-alpine ruby -e "require 'securerandom'; puts SecureRandom.hex(64)"

# URLs úteis
urls: ## Mostra URLs da aplicação
    @echo "$(GREEN)URLs da aplicação:$(NC)"
    @echo "Frontend: $(YELLOW)http://localhost:4200$(NC)"
    @echo "Backend:  $(YELLOW)http://localhost:3000$(NC)"
    @echo "Database: $(YELLOW)localhost:5432$(NC)"