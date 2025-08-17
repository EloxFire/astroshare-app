export function extractYouTubeId(url: string): string | null {
  // Gère .../watch?v=, /embed/, youtu.be/
  const patterns = [
    /[?&]v=([^&#]+)/, // watch?v=
    /youtu\.be\/([^?&#/]+)/, // youtu.be/
    /embed\/([^?&#/]+)/, // /embed/
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m?.[1]) return m[1]
  }
  return null
}