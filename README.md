### MISE EN PLACE

## Base de données

# Créer la BDD

sudo -i -u postgres psql 
CREATE USER greenroots WITH PASSWORD 'greenroots'; 
CREATE DATABASE greenroots OWNER greenroots; 

# Accéder à la BDD

psql -U greenroots -d greenroots

## SERVEUR ET CONTAINERS

# Reconstruction des images

Si modification de package.json, .env, Dockerfile, docker-compose.yml
docker compose up -d --build

## Lancement du serveur et des containers

docker compose up -d

## TODO

bugs 
- user ou arbre ou foret modifié arrive ensuite en dernier
- modifier arbre > pas de message d'erreur si on sélectionner une forêt sans préciser de stock

regarder 
- controllers
- mappers
- mw / utils

Ajouter controller wrapper dans BO
Check sanitize front + BO
Mettre updateStock dans les mappers > changer itemController

Virer unslugify et updateStock dans utils
Virer Authorization dans controllers