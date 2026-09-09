import mongoose from 'mongoose'
import dns from 'dns'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Detect the broken-resolver case: some dev machines (behind a VPN, or with a
// stopped local DNS forwarder like dnscrypt/AdGuard) leave node's c-ares resolver
// pointing at a loopback address that refuses connections. That makes Atlas SRV
// lookups fail with "querySrv ECONNREFUSED". Global dns.setServers() does NOT help,
// because the MongoDB driver creates its own dns.Resolver() which re-reads the
// system servers. So when we detect this, we resolve SRV/TXT ourselves against a
// public DNS server and hand mongoose a plain (non-srv) connection string. The
// resulting shard hostnames are then resolved via dns.lookup() (the OS resolver),
// which works. Production/normal machines skip all of this.
function hasLoopbackResolver(): boolean {
  return dns.getServers().some((s) => {
    const host = s.replace(/:\d+$/, '').replace(/^\[|\]$/g, '')
    return host === '127.0.0.1' || host === '::1' || host === '0.0.0.0'
  })
}

async function resolveConnectionUri(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://') || process.env.NODE_ENV === 'production' || !hasLoopbackResolver()) {
    return uri
  }

  console.log('[db] Loopback DNS resolver detected; resolving Atlas SRV via public DNS')
  const resolver = new dns.promises.Resolver()
  resolver.setServers(['8.8.8.8', '1.1.1.1'])

  const u = new URL(uri)
  const host = u.hostname
  const srv = await resolver.resolveSrv(`_mongodb._tcp.${host}`)
  const params = new URLSearchParams(u.search)
  try {
    const txt = await resolver.resolveTxt(host)
    for (const kv of txt.map((c) => c.join('')).join('&').split('&').filter(Boolean)) {
      const [k, v] = kv.split('=')
      if (k && !params.has(k)) params.set(k, v)
    }
  } catch {
    // No TXT record — fine, defaults below cover the essentials.
  }
  if (!params.has('ssl') && !params.has('tls')) params.set('ssl', 'true')
  if (!params.has('authSource')) params.set('authSource', 'admin')

  const hosts = srv.map((r) => `${r.name}:${r.port}`).join(',')
  const userinfo = u.username ? `${u.username}:${u.password}@` : ''
  const db = u.pathname && u.pathname !== '/' ? u.pathname : ''
  return `mongodb://${userinfo}${hosts}${db}?${params.toString()}`
}

let cached = global as any

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.mongoose.promise = resolveConnectionUri(MONGODB_URI!)
      .then((uri) => mongoose.connect(uri, opts))
      .then((mongoose) => {
        console.log('MongoDB connected')
        return mongoose
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err)
        throw err
      })
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise
  } catch (e) {
    cached.mongoose.promise = null
    throw e
  }

  return cached.mongoose.conn
}

export default connectDB
