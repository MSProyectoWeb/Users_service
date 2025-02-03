FROM node:18

WORKDIR /app

# Copiar solo package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar dependencias (se compilarán en el contenedor)
RUN npm install --legacy-peer-deps
RUN npm install @nestjs/config --legacy-peer-deps

# Forzar recompilación de bcrypt
RUN npm rebuild bcrypt --build-from-source

# Copiar el resto del código (asegúrate de que .dockerignore excluya node_modules)
COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start"]