# Comandos Docker úteis
.PHONY: up down build logs shell rails-console rails-migrate rails-routes rails-reset

# Subir ambiente
up:
    docker compose up -d

# Parar ambiente
down:
    docker compose down

# Build sem cache
build:
    docker compose build --no-cache

# Ver logs
logs:
    docker compose logs -f backend

# Entrar no container
shell:
    docker compose exec backend bash

# Rails console
rails-console:
    docker compose exec backend bundle exec rails console

# Executar migrações
rails-migrate:
    docker compose exec backend bundle exec rails db:migrate

# Ver rotas
rails-routes:
    docker compose exec backend bundle exec rails routes

# Reset completo do banco
rails-reset:
    docker compose exec backend bundle exec rails db:drop db:create db:migrate

# Instalar gems
bundle-install:
    docker compose exec backend bundle install

# Executar testes
test:
    docker compose exec backend bundle exec rails test