# Dépannage: "Parse error" dans Firebase

## Le problème
Tu vois: `Erreur lors de l'enregistrement des règles - Line 1: Parse error.`

Cela signifie que Firebase ne peut pas lire le JSON que tu as copié.

---

## Solutions (essaie dans cet ordre)

### Solution 1: Copier depuis le fichier texte
1. Ouvre le fichier `REGLES_FIREBASE_SIMPLES.txt` dans ce dossier
2. Sélectionne TOUT (Ctrl+A)
3. Copie (Ctrl+C)
4. Va à Firebase → Realtime Database → Règles
5. Sélectionne TOUT (Ctrl+A)
6. Supprime
7. Colle (Ctrl+V)
8. Clique sur "Publier"

### Solution 2: Taper manuellement
Si copier-coller ne fonctionne pas, tape ceci manuellement:

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

**Attention:** Tape exactement comme c'est écrit, y compris les espaces et les accolades.

### Solution 3: Utiliser le mode test temporaire
Si tu veux tester rapidement:

1. Va à Firebase → Realtime Database → Règles
2. Remplace par:

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Clique sur "Publier"

⚠️ **ATTENTION:** Ce mode n'est pas sécurisé! À utiliser seulement pour tester.

---

## Vérifier que ça fonctionne

### Étape 1: Vérifier les règles
1. Va à Firebase → Realtime Database → Règles
2. Tu devrais voir tes règles affichées
3. En bas à droite, tu devrais voir "✓ Règles valides"

### Étape 2: Vérifier l'authentification
1. Va à Firebase → Authentication
2. Vérifie que "Anonyme" est activée (bouton bleu)

### Étape 3: Tester l'app
1. Ouvre `index.html` dans ton navigateur
2. Ouvre la console (F12)
3. Tu devrais voir "🟢 Synchronisé" en haut
4. Pas d'erreurs rouges dans la console

---

## Erreurs courantes

### "Parse error" persiste
- Vérifie qu'il n'y a pas d'accents ou de caractères spéciaux
- Vérifie que tu as bien fermé toutes les accolades `{}`
- Essaie de copier depuis `REGLES_FIREBASE_SIMPLES.txt`

### "Permission denied"
- Vérifie que l'authentification anonyme est activée
- Attends 30 secondes après avoir publié les règles
- Recharge la page (Ctrl+F5)

### Les données ne se synchronisent pas
- Ouvre la console (F12)
- Cherche les erreurs rouges
- Vérifie que tu as bien publié les règles
- Vérifie que l'authentification anonyme est activée

---

## Besoin d'aide?

Si rien ne fonctionne:
1. Utilise le mode test temporaire (Solution 3)
2. Teste que l'app fonctionne
3. Une fois que ça marche, remplace par les vraies règles

Le mode test te permettra de vérifier que tout le reste fonctionne (authentification, synchronisation, etc.) avant de te préoccuper des règles de sécurité.
