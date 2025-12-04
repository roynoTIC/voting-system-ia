# Vérifier et Corriger les Règles Firebase

## Le problème
Tu vois: `PERMISSION_DENIED: Permission denied`

Cela signifie que les règles de sécurité refusent l'accès à la base de données.

---

## Étapes pour corriger

### Étape 1: Aller à Firebase Console
1. Va sur https://console.firebase.google.com
2. Clique sur ton projet "kiro-90012"
3. Clique sur "Realtime Database" dans le menu de gauche

### Étape 2: Vérifier les règles actuelles
```
┌─────────────────────────────────────────┐
│  Realtime Database                      │
├─────────────────────────────────────────┤
│  [Données] [Règles] ← CLIQUE ICI        │
└─────────────────────────────────────────┘
```

Clique sur l'onglet "Règles"

### Étape 3: Voir ce que tu as actuellement
Tu verras probablement quelque chose comme:
```json
{
  "rules": {
    ".read": "now < 1767416400000",
    ".write": "now < 1767416400000"
  }
}
```

Ou:
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

### Étape 4: Remplacer par les bonnes règles

**IMPORTANT:** Copie-colle EXACTEMENT ceci (sans rien ajouter):

```json
{
  "rules": {
    "questions": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "test_connection": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### Étape 5: Publier
1. Clique sur le bouton bleu "Publier"
2. Attends la confirmation "✓ Règles publiées avec succès"

---

## Vérifier que ça fonctionne

### Après avoir publié les règles:
1. Recharge `firebase-diagnostic.html` (Ctrl+F5)
2. Tu devrais voir:
   - ✅ Authentification anonyme
   - ✅ Lecture de la base de données
   - ✅ Écriture dans la base de données

### Si tu vois toujours "PERMISSION_DENIED":
1. Attends 30 secondes
2. Recharge la page (Ctrl+F5)
3. Essaie à nouveau

---

## Vérifier l'authentification anonyme

Assure-toi aussi que l'authentification anonyme est activée:

1. Va à "Authentication" dans le menu de gauche
2. Cherche "Anonyme"
3. Vérifie que le bouton est bleu (activé)

Si ce n'est pas activé:
1. Clique sur "Anonyme"
2. Clique sur le bouton pour l'activer
3. Clique sur "Enregistrer"

---

## Résumé des règles

Les règles que tu dois utiliser:

```json
{
  "rules": {
    "questions": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "test_connection": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

**Explication:**
- `"auth != null"` = Seuls les utilisateurs authentifiés peuvent lire/écrire
- `"questions"` = Le chemin où sont stockées les questions
- `"test_connection"` = Le chemin utilisé pour tester la connexion

---

## Dépannage

### "Parse error" lors de la publication
- Vérifie qu'il n'y a pas d'accents ou de caractères spéciaux
- Vérifie que tu as bien fermé toutes les accolades
- Essaie de copier-coller à nouveau

### Toujours "PERMISSION_DENIED"
1. Vérifie que l'authentification anonyme est activée
2. Attends 1 minute après avoir publié les règles
3. Recharge la page (Ctrl+F5)
4. Essaie à nouveau

### La base de données est vide
C'est normal! Les questions seront créées quand tu utiliseras l'app.
