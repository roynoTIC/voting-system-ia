# Guide Détaillé Firebase - Étape par Étape

## Étape 1: Créer un compte Google et accéder à Firebase

### 1.1 Aller sur Firebase
- Va sur https://console.firebase.google.com
- Clique sur "Connexion" en haut à droite
- Utilise ton compte Google (crée-en un si tu n'en as pas)

### 1.2 Créer un nouveau projet
```
┌─────────────────────────────────────────┐
│  Console Firebase                       │
├─────────────────────────────────────────┤
│  [+ Créer un projet]                    │
│                                         │
│  Mes projets:                           │
│  (liste vide si c'est la première fois) │
└─────────────────────────────────────────┘
```

- Clique sur le bouton bleu "+ Créer un projet"
- Une fenêtre s'ouvre

### 1.3 Remplir les informations du projet
```
┌─────────────────────────────────────────┐
│  Créer un projet                        │
├─────────────────────────────────────────┤
│  Nom du projet:                         │
│  [voting-system-ia____________]         │
│                                         │
│  ☐ Activer Google Analytics             │
│                                         │
│  [Continuer]                            │
└─────────────────────────────────────────┘
```

- Tape: `voting-system-ia`
- Laisse "Google Analytics" décochée (optionnel)
- Clique sur "Continuer"

### 1.4 Accepter les conditions
```
┌─────────────────────────────────────────┐
│  Conditions d'utilisation               │
├─────────────────────────────────────────┤
│  ☑ J'accepte les conditions             │
│                                         │
│  [Créer un projet]                      │
└─────────────────────────────────────────┘
```

- Coche la case
- Clique sur "Créer un projet"
- Attends 30 secondes que le projet se crée

---

## Étape 2: Configurer Realtime Database

### 2.1 Accéder à Realtime Database
Une fois le projet créé, tu vois le tableau de bord:

```
┌─────────────────────────────────────────┐
│  voting-system-ia                       │
├─────────────────────────────────────────┤
│  Menu à gauche:                         │
│  ├─ Accueil                             │
│  ├─ Tous les produits                   │
│  ├─ Build                               │
│  │  ├─ Authentication                   │
│  │  ├─ Realtime Database ← CLIQUE ICI   │
│  │  ├─ Firestore Database               │
│  │  └─ Storage                          │
│  └─ ...                                 │
└─────────────────────────────────────────┘
```

- Clique sur "Realtime Database" dans le menu de gauche

### 2.2 Créer une base de données
```
┌─────────────────────────────────────────┐
│  Realtime Database                      │
├─────────────────────────────────────────┤
│  [Créer une base de données]            │
│                                         │
│  Aucune base de données créée           │
└─────────────────────────────────────────┘
```

- Clique sur le bouton bleu "Créer une base de données"

### 2.3 Choisir la région
```
┌─────────────────────────────────────────┐
│  Créer une base de données              │
├─────────────────────────────────────────┤
│  Région:                                │
│  [europe-west1 (Belgique)] ▼            │
│                                         │
│  (Choisis la région la plus proche)     │
│                                         │
│  [Suivant]                              │
└─────────────────────────────────────────┘
```

- Sélectionne `europe-west1` (Belgique/Europe)
- Clique sur "Suivant"

### 2.4 Choisir le mode de sécurité
```
┌─────────────────────────────────────────┐
│  Règles de sécurité                     │
├─────────────────────────────────────────┤
│  ○ Mode verrouillé                      │
│    (Personne ne peut lire/écrire)       │
│                                         │
│  ○ Mode test                            │
│    (Tout le monde peut lire/écrire)     │
│    ⚠️ À utiliser seulement en dev       │
│                                         │
│  ● Mode personnalisé                    │
│    (Nous allons configurer)             │
│                                         │
│  [Créer]                                │
└─────────────────────────────────────────┘
```

- Sélectionne "Mode test" pour commencer
- Clique sur "Créer"
- Attends que la base se crée (30 secondes)

---

## Étape 3: Configurer les Règles de Sécurité

### 3.1 Accéder aux règles
Une fois la base créée, tu vois:

```
┌─────────────────────────────────────────┐
│  Realtime Database                      │
├─────────────────────────────────────────┤
│  Onglets:                               │
│  [Données] [Règles] ← CLIQUE ICI        │
│                                         │
│  Contenu:                               │
│  {                                      │
│    "null": null                         │
│  }                                      │
└─────────────────────────────────────────┘
```

- Clique sur l'onglet "Règles"

### 3.2 Voir les règles actuelles
Tu verras probablement ceci (mode test):
```
┌─────────────────────────────────────────┐
│  Règles                                 │
├─────────────────────────────────────────┤
│  {                                      │
│    "rules": {                           │
│      ".read": "now < 1767416400000",    │
│      ".write": "now < 1767416400000",   │
│      // 2026-1-3                        │
│    }                                    │
│  }                                      │
│                                         │
│  ⚠️ Ces règles expirent en 2026        │
│  ⚠️ Elles ne sont pas sécurisées       │
└─────────────────────────────────────────┘
```

Ou tu peux voir:
```
┌─────────────────────────────────────────┐
│  {                                      │
│    "rules": {                           │
│      ".read": true,                     │
│      ".write": true                     │
│    }                                    │
│  }                                      │
└─────────────────────────────────────────┘
```

### 3.3 Remplacer les règles
- Sélectionne TOUT le texte (Ctrl+A)
- Supprime-le
- Copie-colle ceci exactement:

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
        ".validate": "newData.isArray()"
      }
    }
  }
}
```

**Explication de ces règles:**
- `".read": "auth != null"` → Seuls les utilisateurs authentifiés peuvent lire
- `".write": "auth != null"` → Seuls les utilisateurs authentifiés peuvent écrire
- `".validate"` → Les données doivent avoir la bonne structure
- `"votes": { ".validate": "newData.isArray()" }` → Les votes doivent être un tableau
- `"comments": { ".validate": "newData.isArray()" }` → Les commentaires doivent être un tableau

### 3.4 Publier les règles
```
┌─────────────────────────────────────────┐
│  Règles                                 │
├─────────────────────────────────────────┤
│  [Publier] [Annuler]                    │
│                                         │
│  ✓ Règles valides                       │
└─────────────────────────────────────────┘
```

- Clique sur le bouton bleu "Publier"
- Attends la confirmation

---

## Étape 4: Activer l'Authentification Anonyme

### 4.1 Aller à Authentication
```
┌─────────────────────────────────────────┐
│  Menu à gauche:                         │
│  ├─ Build                               │
│  │  ├─ Authentication ← CLIQUE ICI      │
│  │  ├─ Realtime Database                │
│  │  └─ ...                              │
└─────────────────────────────────────────┘
```

- Clique sur "Authentication" dans le menu

### 4.2 Commencer la configuration
```
┌─────────────────────────────────────────┐
│  Authentication                         │
├─────────────────────────────────────────┤
│  [Commencer]                            │
│                                         │
│  Aucune méthode d'authentification      │
│  configurée                             │
└─────────────────────────────────────────┘
```

- Clique sur "Commencer"

### 4.3 Choisir l'authentification anonyme
```
┌─────────────────────────────────────────┐
│  Méthodes d'authentification             │
├─────────────────────────────────────────┤
│  ☐ Email/Mot de passe                   │
│  ☐ Téléphone                            │
│  ☐ Google                               │
│  ☐ Facebook                             │
│  ☐ GitHub                               │
│  ☐ Anonyme ← CLIQUE ICI                 │
│  ☐ ...                                  │
└─────────────────────────────────────────┘
```

- Clique sur "Anonyme"

### 4.4 Activer l'authentification anonyme
```
┌─────────────────────────────────────────┐
│  Authentification anonyme                │
├─────────────────────────────────────────┤
│  ○ Désactivée                           │
│  ● Activée ← SÉLECTIONNE CECI           │
│                                         │
│  [Enregistrer]                          │
└─────────────────────────────────────────┘
```

- Clique sur le bouton radio "Activée"
- Clique sur "Enregistrer"

---

## Étape 5: Récupérer les Clés de Configuration

### 5.1 Aller aux paramètres du projet
```
┌─────────────────────────────────────────┐
│  En haut à gauche:                      │
│  voting-system-ia [⚙️] ← CLIQUE ICI     │
│                                         │
│  Menu déroulant:                        │
│  ├─ Paramètres du projet                │
│  ├─ Utilisateurs et autorisations       │
│  └─ ...                                 │
└─────────────────────────────────────────┘
```

- Clique sur la roue dentée ⚙️ à côté du nom du projet
- Clique sur "Paramètres du projet"

### 5.2 Trouver la section "Vos applications"
```
┌─────────────────────────────────────────┐
│  Paramètres du projet                   │
├─────────────────────────────────────────┤
│  Onglets:                               │
│  [Général] [Intégrations] [...]         │
│                                         │
│  Scroll vers le bas...                  │
│                                         │
│  Vos applications:                      │
│  (liste vide)                           │
│                                         │
│  [</> Ajouter une application]          │
└─────────────────────────────────────────┘
```

- Scroll vers le bas de la page
- Cherche "Vos applications"

### 5.3 Ajouter une application web
```
┌─────────────────────────────────────────┐
│  Vos applications                       │
├─────────────────────────────────────────┤
│  [</> Ajouter une application]          │
│                                         │
│  Choisis la plateforme:                 │
│  ○ iOS                                  │
│  ○ Android                              │
│  ● Web ← SÉLECTIONNE CECI               │
│  ○ Unity                                │
│  ○ C++                                  │
│  ○ Flutter                              │
│                                         │
│  [Suivant]                              │
└─────────────────────────────────────────┘
```

- Clique sur l'icône web (</>) ou sélectionne "Web"
- Clique sur "Suivant"

### 5.4 Enregistrer l'application
```
┌─────────────────────────────────────────┐
│  Enregistrer une application web         │
├─────────────────────────────────────────┤
│  Surnom de l'application:               │
│  [voting-app_________________]          │
│                                         │
│  ☐ Aussi configurer Firebase Hosting    │
│                                         │
│  [Enregistrer l'application]             │
└─────────────────────────────────────────┘
```

- Tape: `voting-app`
- Laisse "Firebase Hosting" décochée
- Clique sur "Enregistrer l'application"

### 5.5 Copier la configuration
```
┌─────────────────────────────────────────┐
│  Configuration Firebase                 │
├─────────────────────────────────────────┤
│  const firebaseConfig = {               │
│    apiKey: "AIzaSyDvZ-5K8Q_8X9Y9Z9Z...", │
│    authDomain: "voting-system-ia...",   │
│    databaseURL: "https://voting-...",   │
│    projectId: "voting-system-ia",       │
│    storageBucket: "voting-system-ia...",│
│    messagingSenderId: "123456789",      │
│    appId: "1:123456789:web:abcdef..."   │
│  };                                     │
│                                         │
│  [Copier]                               │
└─────────────────────────────────────────┘
```

- Clique sur le bouton "Copier" (ou sélectionne et copie manuellement)
- Garde cette configuration à portée de main

---

## Étape 6: Remplir firebase-config.js

### 6.1 Ouvrir le fichier
- Ouvre `firebase-config.js` dans ton éditeur de code

### 6.2 Remplacer les valeurs
Tu vois:
```javascript
const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Remplace chaque `YOUR_*` par les vraies valeurs de Firebase:

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

### 6.3 Sauvegarder
- Sauvegarde le fichier (Ctrl+S)

---

## Étape 7: Tester la Configuration

### 7.1 Ouvrir l'application
- Ouvre `index.html` dans ton navigateur
- Ou si tu utilises GitHub Pages, va sur ton URL

### 7.2 Vérifier le statut
```
┌─────────────────────────────────────────┐
│  Questions sur l'IA                     │
│  Votez pour les questions...            │
│  🟢 Synchronisé                         │
│                                         │
│  (Les questions s'affichent)            │
└─────────────────────────────────────────┘
```

- Tu devrais voir "🟢 Synchronisé" en haut
- Si tu vois "🔴 Hors ligne", vérifie la console (F12)

### 7.3 Tester la synchronisation
- Ouvre l'app dans 2 navigateurs différents
- Vote pour une question dans le premier
- Regarde le deuxième navigateur - le vote devrait apparaître automatiquement

---

## Résumé des Étapes

| Étape | Action | Où |
|-------|--------|-----|
| 1 | Créer un projet Firebase | console.firebase.google.com |
| 2 | Créer Realtime Database | Build → Realtime Database |
| 3 | Configurer les règles de sécurité | Realtime Database → Règles |
| 4 | Activer authentification anonyme | Build → Authentication |
| 5 | Récupérer les clés | Paramètres du projet → Vos applications |
| 6 | Remplir firebase-config.js | Ton éditeur de code |
| 7 | Tester | Ouvrir index.html |

---

## Dépannage

### Problème: "Firebase config not loaded"
**Solution:**
- Vérifie que `firebase-config.js` est dans le même dossier que `index.html`
- Vérifie que les valeurs ne sont pas `YOUR_*`
- Recharge la page (Ctrl+F5)

### Problème: "🔴 Hors ligne"
**Solution:**
- Ouvre la console (F12)
- Cherche les erreurs rouges
- Vérifie que l'authentification anonyme est activée
- Vérifie que les règles de sécurité sont publiées

### Problème: "Permission denied"
**Solution:**
- Va à Realtime Database → Règles
- Vérifie que tu as `.read` et `.write` avec `auth != null`
- Clique sur "Publier"

### Problème: Les données ne se synchronisent pas
**Solution:**
- Ouvre la console (F12)
- Cherche les erreurs
- Vérifie que tu as 2 navigateurs/onglets ouverts
- Attends 2-3 secondes après avoir voté

---

## Prochaines Étapes

Une fois que tout fonctionne:
1. Déploie sur GitHub Pages
2. Partage le lien avec d'autres
3. Tous les votes seront synchronisés en temps réel
4. Les données sont sauvegardées dans Firebase (pas de perte)
