/*
  Admin password reset (works without email).
  Usage:
    node scripts/reset-password.js <email> <new-password>
  Reads MONGODB_URI from .env.local / .env, same as scripts/seed.js.
*/
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

for (const file of ['.env.local', '.env']) {
  const filePath = path.join(process.cwd(), file)
  if (!fs.existsSync(filePath)) continue
  fs.readFileSync(filePath, 'utf8').split(/\r?\n/).forEach((line) => {
    const t = line.trim()
    const i = t.indexOf('=')
    if (!t || t.startsWith('#') || i === -1) return
    const key = t.slice(0, i).trim()
    if (!process.env[key]) process.env[key] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')
  })
}

async function main() {
  const [email, password] = process.argv.slice(2)
  if (!email || !password) {
    console.error('Usage: node scripts/reset-password.js <email> <new-password>')
    process.exit(1)
  }
  if (password.length < 6) {
    console.error('Password must be at least 6 characters.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio')
  const hash = await bcryptjs.hash(password, await bcryptjs.genSalt(10))
  const result = await mongoose.connection
    .collection('users')
    .updateOne(
      { email: email.trim().toLowerCase() },
      { $set: { password: hash }, $unset: { resetPasswordToken: '', resetPasswordExpires: '' } }
    )
  console.log(result.matchedCount ? `Password updated for ${email}` : `No user found with email ${email}`)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
