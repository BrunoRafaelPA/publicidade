FROM ruby:3.4.4


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


RUN gem update --system && gem install bundler


WORKDIR /app


COPY Gemfile Gemfile.lock ./


RUN bundle install


COPY . .


RUN find . -type f \( -name "*.rb" -o -name "*.sh" -o -name "rails" -o -name "rake" \) -exec dos2unix {} \;


RUN chmod +x ./docker-entrypoint.sh
RUN chmod +x bin/rails bin/rake bin/setup || true


RUN mkdir -p tmp/pids


EXPOSE 3000


ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]