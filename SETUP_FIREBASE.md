# Configuration Firebase pour la Synchronisation Multi-Utilisateurs

## Vue d'ensemble
Cette application utilise Firebase Realtime Database pour synchroniser les votes et commentaires en temps réel entre tous les utilisateurs, peu importe l'ordinateur ou le navigateur utilisé.

## Étapes de configuration

### 1. Créer un projet Firebase
1. Va sur [Firebase Console](https://console.firebase.google.com)
2. Clique sur "Créer un projet"
3. Donne un nom à ton projet (ex: "voting-system-ia")
4. Accepte les conditions et crée le projet

### 2. Configurer Realtime Database
1. Dans la console Firebase, va à "Realtime Database"
2. Clique sur "Créer une base de données"
3. Choisis la région la plus proche (ex: europe-west1)
4. Sélectionne "Démarrer en mode test" (pour développement)
5. Clique sur "Activer"

### 3. Activer l'authentification anonyme
1. Va à "Authentication" dans la console Firebase
2. Clique sur "Commencer"
3. Clique sur "Authentification anonyme"
4. Active-la et clique sur "Enregistrer"

### 4. Configurer les règles de sécurité
1. Va à "Realtime Database" → onglet "Règles"
2. Remplace le contenu par:

```json
{
  "rules": {
    "questions": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".validate": "newData.hasChildren(['id', 'text', 'votes', 'createdAt'])"
    }
  }
}
```

3. Clique sur "Publier"

**Explication des règles:**
- `.read` et `.write` nécessitent une authentification (même anonyme)
- `.validate` s'assure que les données ont la bonne structure
- Cela empêche les modifications malveillantes

### 5. Récupérer les clés de configuration
1. Va à "Paramètres du projet" (roue dentée en haut à gauche)
2. Clique sur "Paramètres du projet"
3. Scroll jusqu'à "Vos applications"
4. Clique sur l'icône web (</>) pour ajouter une application web
5. Donne un nom à l'application
6. Coche "Aussi configurer Firebase Hosting"
7. Clique sur "Enregistrer l'application"
8. Copie la configuration Firebase (les valeurs entre les accolades)

### 6. Remplir firebase-config.js
1. Ouvre le fichier `firebase-config.js` dans ton éditeur
2. Remplace les valeurs `YOUR_*` par celles copiées:
   - `YOUR_API_KEY` → apiKey
   - `YOUR_PROJECT` → projectId
   - `YOUR_MESSAGING_SENDER_ID` → messagingSenderId
   - `YOUR_APP_ID` → appId
   - Assure-toi que `databaseURL` correspond à ta région

Exemple:
```javascript
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDvZ-5K8Q_8X9Y9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z",
    authDomain: "voting-system-ia.firebaseapp.com",
    databaseURL: "https://voting-system-ia-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "voting-system-ia",
    storageBucket: "voting-system-ia.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 7. Déployer sur GitHub Pages
1. Pousse tous les fichiers (y compris `firebase-config.js`) sur GitHub
2. Va aux paramètres du repo → Pages
3. Sélectionne la branche `main` (ou `master`)
4. Clique sur "Save"

Ton app sera disponible à: `https://[ton-username].github.io/[nom-du-repo]`

## Fonctionnement

- **Synchronisation en temps réel**: Tous les votes et commentaires sont synchronisés instantanément
- **Mode hors ligne**: Si Firebase n'est pas accessible, l'app utilise le localStorage local
- **Indicateur de statut**: Un indicateur en haut montre si tu es connecté à Firebase
- **Identifiant utilisateur unique**: Chaque utilisateur reçoit un ID unique pour tracer ses votes

## Dépannage

### "Firebase config not loaded"
- Vérifie que `firebase-config.js` est dans le même dossier que `index.html`
- Vérifie que les valeurs ne sont pas `YOUR_*`

### "Erreur de synchronisation"
- Vérifie que ta base de données Firebase est active
- Vérifie les règles de sécurité
- Ouvre la console du navigateur (F12) pour voir les erreurs

### Les données ne se synchronisent pas
- Vérifie la connexion internet
- Vérifie que Firebase est initialisé (regarde la console)
- Essaie de recharger la page

## Sécurité

L'app utilise déjà:
- **Authentification anonyme**: Chaque utilisateur est authentifié anonymement
- **Règles de validation**: Les données doivent avoir la bonne structure
- **Contrôle d'accès**: Seuls les utilisateurs authentifiés peuvent lire/écrire

Pour renforcer la sécurité en production, tu peux:
1. Ajouter une limite de taille des données
2. Ajouter des timestamps de validation
3. Implémenter une modération des commentaires
4. Ajouter des limites de débit (rate limiting)

Exemple de règles avancées:

```json
{
  "rules": {
    "questions": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".validate": "newData.hasChildren(['id', 'text', 'votes', 'createdAt'])",
      "votes": {
        ".validate": "newData.isArray()"
      },
      "comments": {
        ".validate": "newData.isArray()",
        "$index": {
          ".validate": "newData.hasChildren(['text', 'userId', 'createdAt']) && newData.child('text').val().length <= 500"
        }
      }
    }
  }
}
```
