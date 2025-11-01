import crypto from 'crypto'

// Generate a strong JWT secret (128 characters)
const jwtSecret = crypto.randomBytes(64).toString('hex')

console.log('\n🔐 Generated JWT Secret:')
console.log('=' .repeat(80))
console.log(jwtSecret)
console.log('=' .repeat(80))
console.log('\n✅ Copy this and add to your backend/.env file:')
console.log(`JWT_SECRET=${jwtSecret}`)
console.log('\n💡 This secret is cryptographically secure and suitable for production use.\n')

