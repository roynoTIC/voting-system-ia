# Corriger PERMISSION_DENIED dans Firebase

## Le problème
Tu vois: `PERMISSION_DENIED: Permission denied`

Cela signifie que les règles de sécurité Firebase refusent l'accès en lecture/écriture.

---

## Solution: Changer les Règles Firebase

### Étape 1: Aller à Firebase Console
1. Va sur https://console.firebase.google.com
2. Clique sur ton projet "kiro-90012"
3. Clique sur "Realtime Database" dans le menu de gauche

### Étape 2: Ouvrir les Règles
```
┌─────────────────────────────────────────┐
│  Realtime Database                      │
├─────────────────────────────────────────┤
│  [Données] [Règles] ← CLIQUE ICI        │
└─────────────────────────────────────────┘
```

Clique sur l'onglet "Règles"

### Étape 3: Voir les Règles Actuelles
Tu verras probablement quelque chose comme:
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

Ou:
```json
{
  "rules": {
    ".read": "now < 1767416400000",
    ".write": "now < 1767416400000"
  }
}
```

### Étape 4: Remplacer les Règles

**IMPORTANT:** Copie-colle EXACTEMENT ceci (sans rien ajouter):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

**Étapes:**
1. Sélectionne TOUT le texte actuel (Ctrl+A)
2. Supprime-le
3. Copie-colle les nouvelles règles ci-dessus
4. Clique sur le bouton bleu "Publier"

### Étape 5: Attendre la Confirmation
Tu devrais voir:
```
✓ Règles publiées avec succès
```

---

## Vérifier que ça fonctionne

### Après avoir publié les règles:
1. Attends 30 secondes
2. Recharge `firebase-connection-test.html` (Ctrl+F5)
3. Tu devrais voir ✅ partout

---

## Explication des Règles

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

**Signification:**
- `.read` = Qui peut lire les données?
- `.write` = Qui peut écrire les données?
- `"auth != null"` = Seulement les utilisateurs authentifiés

**Cela signifie:**
- ✅ Les utilisateurs authentifiés peuvent lire
- ✅ Les utilisateurs authentifiés peuvent écrire
- ❌ Les utilisateurs non authentifiés ne peuvent rien faire

---

## Si tu vois toujours "PERMISSION_DENIED"

### Vérification 1: Les règles sont publiées?
1. Va à Firebase → Realtime Database → Règles
2. Vérifie que tu vois les nouvelles règles
3. Vérifie qu'il y a un ✓ vert (pas d'erreur)

### Vérification 2: L'authentification anonyme est activée?
1. Va à Firebase → Authentication
2. Cherche "Anonyme"
3. Vérifie que le bouton est bleu (activé)

Si ce n'est pas activé:
1. Clique sur "Anonyme"
2. Clique sur le bouton pour l'activer
3. Clique sur "Enregistrer"

### Vérification 3: Attendre la propagation
- Les règles peuvent prendre 1-2 minutes à se propager
- Attends 2 minutes
- Recharge la page (Ctrl+F5)
- Réessaie

---

## Résumé des Étapes

| Étape | Action | Où |
|-------|--------|-----|
| 1 | Aller à Firebase Console | https://console.firebase.google.com |
| 2 | Ouvrir Realtime Database | Menu de gauche |
| 3 | Cliquer sur "Règles" | Onglet en haut |
| 4 | Remplacer les règles | Copie-colle le JSON |
| 5 | Cliquer "Publier" | Bouton bleu |
| 6 | Attendre 30 secondes | Propagation |
| 7 | Recharger la page | Ctrl+F5 |

---

## Après avoir corrigé les règles

Une fois que tu vois ✅ dans le test:
1. Ouvre `rewrite-all-questions.html`
2. Clique sur "Réécrire les Questions"
3. Clique sur "Vérifier"
4. Ouvre `index.html` et teste le système de vote

Tout devrait fonctionner maintenant !
