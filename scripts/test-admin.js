// scripts/test-admin.js
// Script pour tester la connexion admin et les APIs

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testAdminLogin() {
  console.log('🔐 Test de connexion admin...');

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erreur de connexion: ${error.error}`);
    }

    const data = await response.json();
    console.log('✅ Connexion réussie!');
    console.log('👤 Utilisateur:', data.user.email);
    console.log('🎫 Token généré');

    return data.token;
  } catch (error) {
    console.error('❌ Échec de connexion:', error.message);
    process.exit(1);
  }
}

async function testAdminAPIs(token) {
  console.log('\n📊 Test des APIs admin...');

  const endpoints = [
    { method: 'GET', path: '/api/projects', name: 'Projets' },
    { method: 'GET', path: '/api/experiences', name: 'Expériences' },
    { method: 'GET', path: '/api/education', name: 'Formation' },
    { method: 'GET', path: '/api/certifications', name: 'Certifications' },
    { method: 'GET', path: '/api/volunteer', name: 'Bénévolat' },
    { method: 'GET', path: '/api/contact', name: 'Messages' },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}${endpoint.path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${data.length} élément(s)`);
      } else {
        console.log(`❌ ${endpoint.name}: Erreur ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 Test du Dashboard Admin');
  console.log(`📍 URL: ${API_URL}`);
  console.log('----------------------------\n');

  // Test de connexion
  const token = await testAdminLogin();

  // Test des APIs
  await testAdminAPIs(token);

  console.log('\n✨ Tests terminés!');
  console.log(`\n👉 Accédez au dashboard: ${API_URL}/admin`);
}

// Lancer les tests
main().catch(console.error);