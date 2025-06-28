### @file ./.github/workflows/github-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "GreenRoots" ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v4

      - name: ⚙️ Setup de l'environnement Node.js
        uses: actions/setup-node@v4

      - name: 📦 Installation des dépendances
        run: npm clean-install

      - name: 🚀 Installer Biome
        uses: biomejs/setup-biome@v2
        with:
          version: latest
      
      - name: 🎨 Exécuter Biome pour formater et analyser le code
        run: biome ci .

      - name: 🏗️ Build du projet
        run: npm run build

      - name: 📤 Téléversement GitHub Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - name: 🚀 Déploiement sur GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

      - name: 🔗 URL du site déployé
        run: echo "🔗 Votre site est disponible à ${{ steps.deployment.outputs.page_url }}"