FROM node:18-alpine

WORKDIR /app

# Instalar dependencias necesarias para bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm install @nestjs/config --legacy-peer-deps
RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN npm run build

# Generate Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

CMD ["npm", "run", "start"]