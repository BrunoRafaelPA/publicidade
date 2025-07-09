Rails.application.configure do
  # Configurações existentes...
  
  # Adicionar no final do arquivo:
  
  # Permitir hosts do Docker
  config.hosts.clear
  
  # Ou especificar hosts permitidos:
  # config.hosts << "backend"
  # config.hosts << "localhost"
  # config.hosts << "0.0.0.0"
end