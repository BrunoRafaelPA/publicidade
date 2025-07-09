#!/bin/bash
set -e

# Aguardar banco de dados
echo "Aguardando banco de dados..."
until PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d postgres -c '\q'; do
  echo "Banco de dados não está pronto - aguardando..."
  sleep 2
done

echo "Banco de dados está pronto!"

# Remover PID se existir
if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

# Criar e migrar banco
bundle exec rails db:create 2>/dev/null || true
bundle exec rails db:migrate 2>/dev/null || true

# Executar comando
exec "$@"