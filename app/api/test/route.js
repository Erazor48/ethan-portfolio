export async function GET(request) {
  // Affiche dans la console du serveur
  console.log('Clé serveur:', process.env.GEMINI_API_KEY);
  // Renvoie la clé dans la réponse (pour test local uniquement !)
  return new Response(
    JSON.stringify({ key: process.env.OPENAI_API_KEY }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}


/*export async function GET(request) {
  // Ici, ta logique
  return new Response(
    JSON.stringify({ key: process.env.OPENAI_API_KEY }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}*/