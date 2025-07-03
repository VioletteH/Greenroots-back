# Projet GreenRoots

## Démarrer le projet

### Lancement du serveur et des containers

docker compose up -d

## Tester les routes avec authorization

Se connecter sur le back-office avec un compte admin
- email : master@greenroots.com
- mot de passe : masterGreenroots#1
Aller dans l'inspecteur > appli
Copier le token
Remplacer la valeur de @authToken dans le fichier de test en collant le token
