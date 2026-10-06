/**
 * Project features are stored as a flat string array. Items starting with "## "
 * are module headings (e.g. "## Merchandising") that group the items below them.
 */

export interface FeatureGroup {
  heading?: string
  items: string[]
}

const HEADING_RE = /^#{1,3}\s+/

export function isFeatureHeading(item: string) {
  return HEADING_RE.test(item.trim())
}

/** Feature items without headings — for cards and short lists. */
export function plainFeatures(items?: string[]) {
  return (items || []).filter((item) => item && !isFeatureHeading(item))
}

/** Groups features under their "## Heading" items. Items before any heading get no heading. */
export function groupFeatures(items?: string[]): FeatureGroup[] {
  const groups: FeatureGroup[] = []
  for (const raw of items || []) {
    const item = raw.trim()
    if (!item) continue
    if (isFeatureHeading(item)) {
      groups.push({ heading: item.replace(HEADING_RE, ''), items: [] })
    } else {
      if (!groups.length) groups.push({ items: [] })
      groups[groups.length - 1].items.push(item)
    }
  }
  return groups.filter((group) => group.items.length > 0)
}
