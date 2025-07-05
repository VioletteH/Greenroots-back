# step 1 : build 
FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# step 2 : execution
FROM node:lts
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "start"]