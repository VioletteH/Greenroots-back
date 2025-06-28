# Étape 1 : build (optionnel si transpilation TypeScript)
FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Étape 2 : exécution
FROM node:lts
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]