# 🔑 Configuration des Tokens d'API

## GitHub API Token

1. **Allez sur** : https://github.com/settings/tokens
2. **Cliquez sur** "Generate new token (classic)"
3. **Sélectionnez les permissions** :
   - `repo` (accès complet aux repositories)
   - `read:user` (lecture du profil)
   - `read:org` (lecture des organisations)
4. **Copiez le token** et ajoutez-le dans `.env.local` :
   ```
   GITHUB_TOKEN=ghp_votre_token_ici
   ```

## LinkedIn API

### Option 1 : LinkedIn API v2 (Recommandé)

1. **Créez une application LinkedIn** :
   - Allez sur : https://www.linkedin.com/developers/
   - Cliquez sur "Create App"
   - Remplissez les informations

2. **Configurez les permissions** :
   - `r_liteprofile` (lecture du profil de base)
   - `r_emailaddress` (lecture de l'email)
   - `r_basicprofile` (lecture du profil complet)

3. **Générez un token d'accès** et ajoutez dans `.env.local` :
   ```
   LINKEDIN_CLIENT_ID=votre_client_id
   LINKEDIN_CLIENT_SECRET=votre_client_secret
   LINKEDIN_ACCESS_TOKEN=votre_access_token
   ```

### Option 2 : LinkedIn Scraping (Alternative)

Si l'API LinkedIn est trop complexe, nous pouvons utiliser une approche de scraping.

## OpenAI API Key

1. **Allez sur** : https://platform.openai.com/api-keys
2. **Créez une nouvelle clé API**
3. **Ajoutez dans `.env.local`** :
   ```
   OPENAI_API_KEY=sk-votre_clé_ici
   ```

## Fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec :

```env
# GitHub API Token
GITHUB_TOKEN=ghp_votre_token_github

# LinkedIn API Credentials
LINKEDIN_CLIENT_ID=votre_client_id
LINKEDIN_CLIENT_SECRET=votre_client_secret
LINKEDIN_ACCESS_TOKEN=votre_access_token

# OpenAI API Key
OPENAI_API_KEY=sk-votre_clé_openai

# Variables d'environnement
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Test des Tokens

Une fois configurés, testez vos tokens avec :

```bash
npm run test:tokens
``` 