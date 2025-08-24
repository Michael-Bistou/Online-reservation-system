const http = require('http')

console.log('🧪 Test des API admin...\n')

const API_BASE = 'http://localhost:5000/api'

// Fonction pour faire une requête HTTP
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData)
          resolve({ status: res.statusCode, data: parsedData })
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

// Fonction pour se connecter en tant qu'admin
async function loginAsAdmin() {
  try {
    console.log('🔐 Connexion en tant qu\'admin...')
    const response = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@gastroreserve.com',
      password: 'admin123'
    })
    
    if (response.status === 200) {
      console.log('✅ Connexion réussie')
      return response.data.token
    } else {
      console.error('❌ Erreur de connexion:', response.data)
      return null
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
    return null
  }
}

// Fonction pour tester une API admin
async function testAdminAPI(token, endpoint, description) {
  try {
    console.log(`\n🔍 Test: ${description}`)
    const response = await makeRequest('GET', `/api/admin/${endpoint}`, null, {
      'Authorization': `Bearer ${token}`
    })
    
    console.log(`✅ ${description} - Status: ${response.status}`)
    if (response.status === 200) {
      console.log(`📊 Données reçues: ${JSON.stringify(response.data, null, 2)}`)
    } else {
      console.log(`❌ Erreur: ${JSON.stringify(response.data, null, 2)}`)
    }
    return response.data
  } catch (error) {
    console.error(`❌ Erreur ${description}:`, error.message)
    return null
  }
}

async function runTests() {
  const token = await loginAsAdmin()
  
  if (!token) {
    console.log('❌ Impossible de continuer sans token')
    return
  }
  
  // Test des différentes API
  await testAdminAPI(token, 'dashboard', 'Dashboard')
  await testAdminAPI(token, 'users', 'Utilisateurs')
  await testAdminAPI(token, 'restaurants', 'Restaurants')
  await testAdminAPI(token, 'logs', 'Logs d\'audit')
  await testAdminAPI(token, 'stats', 'Statistiques')
  
  console.log('\n🎉 Tests terminés !')
}

runTests()
