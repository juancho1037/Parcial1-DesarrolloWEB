# Dockerfile
FROM node:lts

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto de la aplicación (asumiendo que corre en el 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
