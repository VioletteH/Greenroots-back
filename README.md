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
- ajouter helmet app.ts
- vérifier les tests KO
- vérifier les status dans le plan de test
- vérifier les messages d'erreur (fr / en) dans le plan de test
- enlever dotenv (package.json + app)

## TODO BO

todo
- ajouter helmet
- check sanitize
- rassembler les pages erreur
- enlever dotenv + pg (package.json + app)

to see
- simplification forestController et treeController > create et update
- revoir userController > update
- revoir orderController
- revoir isLogged et requiredAuth

bugs
- on ne peut pas voir ou modifier certains orders (orders avec plusieurs arbres?)
- check le message d'erreur du delete user 

## TODO BDD

Todo : 
- modifier le seeding pour avoir des mots de passe hashés

Améliorations possibles : 
- passer les noms des tables au pluriel
- utiliser TIMESTAMPTZ au lieu de TIMESTAMP
- ajouter NOT NULL pour created_at et updated_at
- ajouter DEFAULT status 1 pour order
- rendre le name des tree and forests unique (+ dans schema joi)

## seeding

INSERT INTO "user" (firstname, lastname, email, password, phone, address, zipcode, city, role) VALUES
('John', 'Doe', 'john.doe@example.com', '$argon2id$v=19$m=65536,t=3,p=4$FqOpNH8Iiwc/CB9jPU95WQ$Jgt0j69li1j5bn4Pshl1n/6nThjYmF7cwiZqq+EkaTI', '01 23 45 67 89', '123 Rue Principale', '12345', 'Springfield', 'utilisateur'), -- password1
('Jane', 'Smith', 'jane.smith@example.com', '$argon2id$v=19$m=65536,t=3,p=4$w+zAaUsziLhKSk8pm3dTtw$uKGEy95VvvPDA0VR3QchM3zZ2dvWBRydH2V2M/ed6u4', '01 23 45 67 89', '456 Rue de l''Orme', '67890', 'Metropolis', 'admin'), -- password2
('Alice', 'Johnson', 'alice.johnson@example.com', '$argon2id$v=19$m=65536,t=3,p=4$up1cn7c+uE45b5+rU7uHHw$6t+c7lHlIDoUyGY+xpyR2fqYVgQ55pCd1OHu3ryytZ8', '01 23 45 67 89', '789 Rue du Chêne', '54321', 'Gotham', 'admin'), -- password3
('Bob', 'Brown', 'bob.brown@example.com', '$argon2id$v=19$m=65536,t=3,p=4$5DfKX+gtNRX7U97G4PbzVA$qRYQIgG9U9RbWXrdPt5dy7D8oOLrzQJ7+MoqiX0xDYA', '01 23 45 67 89', '321 Rue du Pin', '98765', 'Smallville', 'utilisateur'), -- password4
('Charlie', 'Davis', 'charlie.davis@example.com', '$argon2id$v=19$m=65536,t=3,p=4$DkV9xLV+2gzSuA79KZ8ScA$RdnSKwFQHQNQn4KGVqTb0qPVF6JGwuhe3d9Y8xI9G6o', '01 23 45 67 89', '654 Rue du Cèdre', '45678', 'Riverdale', 'utilisateur'), -- password5
('David', 'Wilson', 'david.wilson@example.com', '$argon2id$v=19$m=65536,t=3,p=4$HF0ZjK6m+2JXYBgcPZEX9A$U8CnsqANz06PaxRRGgxJkGeD8nZel0M1kiKtIqSnocQ', '01 23 45 67 89', '987 Rue du Bouleau', '78901', 'Starling', 'utilisateur'), -- password6
('Eve', 'Miller', 'eve.miller@example.com', '$argon2id$v=19$m=65536,t=3,p=4$LSMiLgMdvI6OL1TwOEDTog$6/m+8Kh6HokYiRV/ovWhmUVsMvH1nZwmeKokQVV0B6I', '01 23 45 67 89', '234 Rue de l''Érable', '23456', 'Keystone', 'utilisateur'), -- password7
('Frank', 'Moore', 'frank.moore@example.com', '$argon2id$v=19$m=65536,t=3,p=4$jqAHmo3zrymmNKdLUqOvWw$dZtOvObDJ7wSz+y96LGgoLr0cvW8RxI7jkA/F3EXN1E', '01 23 45 67 89', '567 Rue du Noyer', '89012', 'Côte', 'utilisateur'), -- password8
('Grace', 'Taylor', 'grace.taylor@example.com', '$argon2id$v=19$m=65536,t=3,p=4$WoAfPvYY08I/1rPzhGnRnw$JV5qfN5VxSROUNxyiV7g6jjNmheG+VgiB1Rz6SoLxj0', '01 23 45 67 89', '890 Rue de l''Épicéa', '34567', 'Centre', 'utilisateur'), -- password9
('Heidi', 'Clark', 'heidi.clark@example.com', '$argon2id$v=19$m=65536,t=3,p=4$qkNfRGzV+ap+DeU7Um4bgw$M7f9yNvjTkgI79HSCvml5Uqzv3T93o9RBZn5o9VEFuM', '01 23 45 67 89', '123 Rue du Tremble', '67890', 'Colline', 'utilisateur'), -- password10
('Admin', '', 'master@greenroots.com', '$argon2id$v=19$m=65536,t=3,p=4$+p6idzhGlx1E5Eoxp7TTkw$Uk4xOlghkt8h2Qsr7yFjDnWdll6m33BjJULgl0mgVh0', '', '', '', '', 'admin'); -- admin123

STRIPE=sk_test_51RGzPzE4bHLDpK05ParN1huD7atzPzwH74pzxvozjoTLtASaE4jcl67wfCndgDXxK6SIBOekg4R73gj3oiGT9tvb00KKisVLqp
