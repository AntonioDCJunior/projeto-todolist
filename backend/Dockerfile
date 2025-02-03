# Usando a imagem oficial do Python
FROM python:3.9

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos de requisitos e instalando as dependências
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copiando o restante do código
COPY . .

# Expondo a porta 5000
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["python", "app.py"]