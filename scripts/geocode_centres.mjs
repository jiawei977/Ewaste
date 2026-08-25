import fs from 'node:fs'

const inputPath = 'data/official_centres.json'
const outputPath = 'data/geocoded_centres.json'
const centres = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
const previous = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : []
const cache = new Map(previous.map((centre) => [`${centre.name}|${centre.address}`, centre]))

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

for (const [index, centre] of centres.entries()) {
  const cacheKey = `${centre.name}|${centre.address}`
  const cached = cache.get(cacheKey)
  if (cached?.latitude !== null && cached?.latitude !== undefined) continue

  const query = new URLSearchParams({ q: `${centre.name}, ${centre.address}`, format: 'jsonv2', limit: '1', countrycodes: 'my' })
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
    headers: { 'User-Agent': 'EWasteScannerStudentProject/1.0 (one-time official centre geocoding)' },
  })
  if (!response.ok) throw new Error(`Geocoder returned ${response.status} for ${centre.name}`)
  let matches = await response.json()

  if (!matches.length) {
    const addressQuery = new URLSearchParams({ q: centre.address, format: 'jsonv2', limit: '1', countrycodes: 'my' })
    await wait(1100)
    const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?${addressQuery}`, {
      headers: { 'User-Agent': 'EWasteScannerStudentProject/1.0 (one-time official centre geocoding)' },
    })
    if (!fallbackResponse.ok) throw new Error(`Geocoder returned ${fallbackResponse.status} for ${centre.name}`)
    matches = await fallbackResponse.json()
  }

  let quality = matches.length ? 'address' : null
  if (!matches.length) {
    const postcode = centre.address.match(/\b\d{5}\b/)?.[0]
    if (postcode) {
      const postcodeQuery = new URLSearchParams({ q: `${postcode}, ${centre.state}, Malaysia`, format: 'jsonv2', limit: '1', countrycodes: 'my' })
      await wait(1100)
      const postcodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?${postcodeQuery}`, {
        headers: { 'User-Agent': 'EWasteScannerStudentProject/1.0 (one-time official centre geocoding)' },
      })
      if (!postcodeResponse.ok) throw new Error(`Geocoder returned ${postcodeResponse.status} for ${centre.name}`)
      matches = await postcodeResponse.json()
      if (matches.length) quality = 'postcode'
    }
  }

  const match = matches[0]
  cache.set(cacheKey, {
    ...centre,
    latitude: match ? Number(match.lat) : null,
    longitude: match ? Number(match.lon) : null,
    geocoded_label: match?.display_name || null,
    coordinate_quality: quality,
  })
  fs.writeFileSync(outputPath, `${JSON.stringify([...cache.values()], null, 2)}\n`)
  console.log(`[${index + 1}/${centres.length}] ${match ? 'matched' : 'unmatched'}: ${centre.name}`)
  await wait(1100)
}

const results = [...cache.values()]
console.log(`Finished: ${results.filter((item) => item.latitude !== null).length}/${results.length} matched.`)
