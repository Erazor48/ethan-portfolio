const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

async function testGitHubToken() {
  console.log('🔍 Test du token GitHub...');
  
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('❌ Token GitHub manquant dans .env.local');
    return false;
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const user = await response.json();
      console.log('✅ Token GitHub valide');
      console.log(`   Utilisateur: ${user.login}`);
      console.log(`   Nom: ${user.name}`);
      return true;
    } else {
      console.log(`❌ Token GitHub invalide: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test du token GitHub:', error.message);
    return false;
  }
}

async function testLinkedInToken() {
  console.log('\n🔍 Test du token LinkedIn...');
  
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) {
    console.log('❌ Token LinkedIn manquant dans .env.local');
    return false;
  }

  try {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const profile = await response.json();
      console.log('✅ Token LinkedIn valide');
      console.log(`   Nom: ${profile.localizedFirstName} ${profile.localizedLastName}`);
      console.log(`   Headline: ${profile.headline || 'N/A'}`);
      return true;
    } else {
      console.log(`❌ Token LinkedIn invalide: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test du token LinkedIn:', error.message);
    return false;
  }
}

async function testOpenAIToken() {
  console.log('\n🔍 Test du token OpenAI...');
  
  const token = process.env.OPENAI_API_KEY;
  if (!token) {
    console.log('❌ Token OpenAI manquant dans .env.local');
    return false;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const models = await response.json();
      console.log('✅ Token OpenAI valide');
      console.log(`   Modèles disponibles: ${models.data.length}`);
      return true;
    } else {
      console.log(`❌ Token OpenAI invalide: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test du token OpenAI:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Test des tokens d\'API\n');
  
  const results = {
    github: await testGitHubToken(),
    linkedin: await testLinkedInToken(),
    openai: await testOpenAIToken()
  };

  console.log('\n📊 Résumé des tests:');
  console.log(`GitHub: ${results.github ? '✅' : '❌'}`);
  console.log(`LinkedIn: ${results.linkedin ? '✅' : '❌'}`);
  console.log(`OpenAI: ${results.openai ? '✅' : '❌'}`);

  const allValid = Object.values(results).every(Boolean);
  
  if (allValid) {
    console.log('\n🎉 Tous les tokens sont valides !');
  } else {
    console.log('\n⚠️  Certains tokens sont manquants ou invalides.');
    console.log('Consultez config/api-keys.md pour les instructions de configuration.');
  }
}

main().catch(console.error); 