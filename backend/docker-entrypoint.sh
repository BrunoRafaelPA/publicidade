#!/bin/bash
set -e

until PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d postgres -c '\q' >/dev/null 2>&1; do
  sleep 2
done

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

bundle exec rails db:create >/dev/null 2>&1 || true
bundle exec rails db:migrate >/dev/null 2>&1 || true

# Verificar se a tabela cad_estado está vazia
ESTADO_COUNT=$(PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "${DATABASE_NAME:-publicidade_development}" -t -c "SELECT COUNT(*) FROM cad_estado;" 2>/dev/null | xargs || echo "0")

if [ "$ESTADO_COUNT" = "0" ]; then
  PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "${DATABASE_NAME:-publicidade_development}" -c "
    INSERT INTO cad_estado (descricao, sigla, created_at, updated_at) VALUES
    ('São Paulo', 'SP', NOW(), NOW()),
    ('Rio de Janeiro', 'RJ', NOW(), NOW()),
    ('Minas Gerais', 'MG', NOW(), NOW()),
    ('Bahia', 'BA', NOW(), NOW()),
    ('Paraíba', 'PB', NOW(), NOW()),
    ('Mato Grosso', 'MT', NOW(), NOW()),
    ('Ceará', 'CE', NOW(), NOW()),
    ('Sergipe', 'SE', NOW(), NOW());
  " >/dev/null 2>&1
fi

exec "$@"