/**
 * Text clean-up for job descriptions from external feeds. Pure functions, so
 * they run both in the job finder (server) and on the admin page (for jobs
 * saved before a fix).
 */

// Windows-1252 characters for bytes 0x80–0x9F (the rest of the range maps 1:1 to Latin-1).
const CP1252: Record<string, number> = {
  '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89,
  'Š': 0x8a, '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95,
  '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f,
}

function toByte(ch: string) {
  const code = ch.charCodeAt(0)
  if (code <= 0xff) return code
  return CP1252[ch] ?? -1
}

// A UTF-8 lead byte (Â–ô as Latin-1) followed by continuation bytes shown as Windows-1252 characters.
const BROKEN_SEQUENCE = /[Â-ô][\u0080-¿€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]{1,3}/g

/**
 * Repairs UTF-8 text that was decoded as Windows-1252 somewhere upstream
 * ("â€”" → "—", "Weâ€™ve" → "We’ve"). Sequences that don't decode to valid UTF-8 are left alone.
 */
export function fixMojibake(text: string) {
  const decoder = new TextDecoder('utf-8', { fatal: true })
  return text
    // ” is E2 80 9D; 0x9D has no Windows-1252 character, so it often arrives as U+FFFD
    .replace(/â€\ufffd/g, '”')
    .replace(BROKEN_SEQUENCE, (match) => {
    const bytes = Array.from(match, toByte)
    if (bytes.some((b) => b < 0)) return match
    try {
      return decoder.decode(new Uint8Array(bytes))
    } catch {
      return match
    }
  })
}

export function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&amp;/g, '&')
}

// Some feeds (We Work Remotely) entity-escape their HTML, so decode first, then strip tags.
export function cleanJobText(html = '') {
  let text = html
  for (let i = 0; i < 2; i++) text = decodeEntities(text).replace(/<[^>]*>/g, ' ')
  return fixMojibake(text).replace(/\s+/g, ' ').trim()
}
