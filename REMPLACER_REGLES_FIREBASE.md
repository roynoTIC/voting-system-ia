# Remplacer les Règles Firebase - Instructions Rapides

## Tu as actuellement ceci:
```json
{
  "rules": {
    ".read": "now < 1767416400000",
    ".write": "now < 1767416400000"
  }
}
```

## Voici ce que tu dois faire:

### Étape 1: Aller à Realtime Database
1. Va sur https://console.firebase.google.com
2. Clique sur ton projet "voting-system-ia"
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

### Étape 3: Remplacer le contenu
1. Sélectionne TOUT (Ctrl+A ou Cmd+A)
2. Supprime tout
3. Copie-colle ceci EXACTEMENT (sans rien ajouter):

```
{
  "rules": {
    "questions": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

**IMPORTANT:** 
- Pas de commentaires
- Pas d'espaces supplémentaires
- Pas de caractères spéciaux
- Copie-colle exactement comme c'est écrit

### Étape 4: Vérifier la syntaxe
Avant de publier, Firebase doit dire "✓ Règles valides" en bas à droite.

Si tu vois une erreur "Parse error", c'est qu'il y a un problème de syntaxe:
- Vérifie qu'il n'y a pas de caractères invisibles
- Essaie de copier-coller à nouveau
- Vérifie que tu as bien fermé toutes les accolades

### Étape 5: Publier
```
┌─────────────────────────────────────────┐
│  [Publier] [Annuler]                    │
│                                         │
│  ✓ Règles valides                       │
└─────────────────────────────────────────┘
```

Clique sur le bouton bleu "Publier"

### Étape 6: Attendre la confirmation
Tu devrais voir:
```
✓ Règles publiées avec succès
```

---

## C'est tout! 

Maintenant:
- ✅ Les règles sont sécurisées
- ✅ Seuls les utilisateurs authentifiés peuvent accéder
- ✅ Les données sont validées
- ✅ Pas d'expiration (contrairement au mode test)

Recharge ton app et tu devrais voir "🟢 Synchronisé" en haut.

---

## Si tu vois une erreur:

### "Erreur: Règles invalides"
- Vérifie que tu as copié exactement le JSON
- Vérifie qu'il n'y a pas de caractères supplémentaires
- Essaie de copier-coller à nouveau

### "Permission denied" après publication
- Attends 30 secondes
- Recharge la page (Ctrl+F5)
- Vérifie que l'authentification anonyme est activée (Build → Authentication)

### Les données ne se synchronisent pas
- Ouvre la console (F12)
- Cherche les erreurs rouges
- Vérifie que tu as bien publié les règles
