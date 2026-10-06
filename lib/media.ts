/** Shared helpers for project/course media (images + demo videos). */

const VIDEO_FILE_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i

/** True when the URL points at a raw video file that a <video> tag can play. */
export function isDirectVideo(url?: string) {
  if (!url) return false
  return VIDEO_FILE_RE.test(url) || /res\.cloudinary\.com\/.+\/video\/upload\//.test(url)
}

/**
 * Converts YouTube / Vimeo / Loom / Google Drive share links into embeddable
 * player URLs. Returns '' when the URL is not a known embeddable provider.
 */
export function getEmbedUrl(url?: string) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host.endsWith('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) return url
      const shorts = parsed.pathname.match(/^\/(shorts|live)\/([^/]+)/)
      const videoId = shorts ? shorts[2] : parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }
    if (host === 'youtu.be') {
      const videoId = parsed.pathname.slice(1)
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }
    if (host.endsWith('vimeo.com')) {
      if (host === 'player.vimeo.com') return url
      const videoId = parsed.pathname.split('/').filter(Boolean).pop()
      return videoId ? `https://player.vimeo.com/video/${videoId}` : ''
    }
    if (host.endsWith('loom.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop()
      return videoId ? `https://www.loom.com/embed/${videoId}` : ''
    }
    if (host === 'drive.google.com') {
      const match = parsed.pathname.match(/\/file\/d\/([^/]+)/)
      return match ? `https://drive.google.com/file/d/${match[1]}/preview` : ''
    }
    return ''
  } catch {
    return ''
  }
}

/** Splits a newline/comma separated list (or array) into clean URL strings. */
export function toUrlList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  if (!value) return []
  return String(value)
    .split(/[\n,]+/)
    .map((v) => v.trim())
    .filter(Boolean)
}
