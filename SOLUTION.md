# Solution complète pour résoudre le problème

## Problème identifié
L'API ne démarre pas car `prisma generate` échoue avec "Conflicting env vars"

## Solution

### Étape 1: Nettoyer les fichiers .env en conflit
```powershell
# Dans le terminal, exécutez:
cd "C:\Users\alaza\Desktop\factuer fr"
Remove-Item "packages\database\.env" -ErrorAction SilentlyContinue
```

### Étape 2: Générer le Prisma Client
```powershell
npx prisma generate --schema="packages/database/schema.prisma"
```

### Étape 3: Lier les données
```powershell
node packages/database/fix-link.js
```

### Étape 4: Redémarrer le serveur
```powershell
npm run dev
```

### Étape 5: Se connecter
- URL: http://localhost:3001/login
- Email: expert@cabinet.fr
- Password: password123

## Si le problème persiste
Le fichier `.env` racine contient probablement des clés dupliquées. Vérifiez qu'il n'y a pas de lignes en double (ex: DATABASE_URL apparaît 2 fois).
