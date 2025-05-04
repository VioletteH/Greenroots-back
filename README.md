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

- passer tous les with-count (utiles pour pagination) en query parameter
- voir les composants qui utilisent /trees/forests > est ce qu'ils ne peuvent pas utiliser trees slt?
- utiliser /forests/:id/trees pour le filtre par foret
- passer les with-stock en query parameters

router : 
- renommer les fonctions
- revoir les url

regarder 
- controllers
- mappers
- mw / utils