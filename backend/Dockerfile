FROM ruby:3.4.4

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    git \
    curl \
    build-essential \
    nodejs \
    npm \
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

# Criar diretórios necessários
RUN mkdir -p tmp/pids

# Expor porta
EXPOSE 3000

# Script de entrada
COPY docker-entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# Comando padrão
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]