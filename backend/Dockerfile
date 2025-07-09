FROM ruby:3.4.4

# Instalar dependências do sistema (incluindo dos2unix)
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    git \
    curl \
    build-essential \
    nodejs \
    npm \
    dos2unix \
    && rm -rf /var/lib/apt/lists/*

# Atualizar RubyGems e Bundler
RUN gem update --system && gem install bundler

# Definir diretório de trabalho
WORKDIR /app

# Copiar Gemfile e Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Instalar gems
RUN bundle install

# Copiar código da aplicação
COPY . .

# Corrigir line endings de TODOS os arquivos importantes
RUN find . -type f \( -name "*.rb" -o -name "*.sh" -o -name "rails" -o -name "rake" \) -exec dos2unix {} \;

# Dar permissões aos scripts
RUN chmod +x ./docker-entrypoint.sh
RUN chmod +x bin/rails bin/rake bin/setup || true

# Criar diretórios necessários
RUN mkdir -p tmp/pids

# Expor porta
EXPOSE 3000

# Definir entrypoint e comando
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]