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

## Tests avec authorization

se reconnecter sur le front avec un compte admin
- email : master@greenroots.com
- mot de passe : masterGreenroots#1
aller dans l'inspecteur > appli
copier le token
remplacer la valeur de @authToken dans le fichier de test en collant le token

## TODO BACKEND

bugs 
- user ou arbre ou foret modifié arrive ensuite en dernier
- modifier arbre > afficher message d'erreur si on sélectionner une forêt sans préciser de stock

todo
- vérifier les tests KO
- vérifier les status dans le plan de test
- vérifier les messages d'erreur (fr / en) dans le plan de test
- enlever dotenv (package.json + app)

## TODO BO

todo
- rassembler les pages erreur

to see
- simplification forestController et treeController > create et update
- revoir userController > update
- revoir orderController
- revoir isLogged et requiredAuth

bugs
- on ne peut pas voir ou modifier certains orders (orders avec plusieurs arbres? ex : la 13)
- check le message d'erreur du delete user 
- on ne peut pas modifier les arbres associés à une forêt (et inverse)

## TODO BDD

Todo : 

Améliorations possibles : 
- passer les noms des tables au pluriel
- utiliser TIMESTAMPTZ au lieu de TIMESTAMP > OK
- ajouter NOT NULL pour created_at et updated_at > OK
- ajouter DEFAULT status 1 pour order > OK
- rendre le name des tree and forests unique (+ dans schema joi) > OK SQL

## seeding


