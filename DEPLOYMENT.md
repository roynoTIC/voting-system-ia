# Guide de Déploiement

## Option 1: GitHub Pages (Recommandé - Gratuit)

### Étapes:

1. **Créer un compte GitHub** (si vous n'en avez pas)
   - Allez sur https://github.com

2. **Créer un nouveau repository**
   - Cliquez sur "New"
   - Nommez-le `voting-system-ia` (ou un autre nom)
   - Cochez "Add a README file"
   - Cliquez "Create repository"

3. **Cloner le repository localement**
   ```bash
   git clone https://github.com/votre-username/voting-system-ia.git
   cd voting-system-ia
   ```

4. **Copier les fichiers du projet**
   - Copiez `index.html`, `app.js`, `data.js`, `styles.css` dans le dossier

5. **Pousser vers GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

6. **Activer GitHub Pages**
   - Allez dans Settings du repository
   - Cliquez sur "Pages" dans le menu de gauche
   - Sous "Source", sélectionnez "Deploy from a branch"
   - Choisissez la branche `main` et le dossier `/ (root)`
   - Cliquez "Save"

7. **Accéder à votre site**
   - Attendez quelques minutes
   - Votre site sera accessible à: `https://votre-username.github.io/voting-system-ia`

---

## Option 2: Netlify (Très facile)

1. Allez sur https://netlify.com
2. Cliquez "Sign up"
3. Connectez-vous avec GitHub
4. Cliquez "New site from Git"
5. Sélectionnez votre repository
6. Cliquez "Deploy"
7. Votre site sera en ligne en quelques secondes!

---

## Option 3: Vercel

1. Allez sur https://vercel.com
2. Cliquez "Sign Up"
3. Connectez-vous avec GitHub
4. Cliquez "Import Project"
5. Sélectionnez votre repository
6. Cliquez "Deploy"

---

## Option 4: Serveur personnel

Si vous avez un serveur web:
1. Uploadez tous les fichiers via FTP/SFTP
2. Assurez-vous que `index.html` est accessible à la racine
3. C'est tout!

---

## Vérification

Une fois déployé, vérifiez que:
- ✅ La page se charge correctement
- ✅ Les étoiles de notation fonctionnent
- ✅ Les commentaires se sauvegardent
- ✅ La recherche fonctionne
- ✅ Les données persistent après un rechargement

Bon déploiement! 🚀
