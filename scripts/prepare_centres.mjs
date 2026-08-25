import fs from 'node:fs'

const source = JSON.parse(fs.readFileSync('data/centers_raw.json', 'utf8'))
const states = new Set([
  'KEDAH', 'PUTRAJAYA', 'SELANGOR', 'KUALA LUMPUR', 'MELAKA', 'JOHOR',
  'NEGERI SEMBILAN', 'PAHANG', 'TERENGGANU', 'KELANTAN', 'PULAU PINANG',
  'SARAWAK', 'PERLIS', 'PERAK',
])
const addressStart = /^(?:Lot|Plot|No\.?|G-|LG-|PS-|Unit|Cyberjaya|Berdekatan|Pusat Kitar|Park &|Bersebelahan|Berhadapan|F\d|L\d|PT\s?\d|\d|S\/L|Level|Ground Floor|Komtar|Queensbay|B\d|S\d)/i
const noise = /^(?:Updated until|LIST OF E-WASTE|NAME$|TYPES OF E-WASTE|CONTACT|NO$|NO OPERATING|OPERATING HOURS|PICKUP|E-WASTE|FROM|HOME|Washing|Machine|Dryer|Television|Air-|Conditoner|Refrigerator|Computer|\/Laptop|Mobile|Phone|-- \d+ of \d+ --)$/i

const lines = source.text
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !noise.test(line))

let state = ''
let current = null
const records = []

function finishRecord() {
  if (!current) return
  const useful = current.lines.slice(0, current.lines.findIndex((line) => line.includes('√') || line.includes('×')))
  if (!useful.length) {
    current = null
    return
  }

  let splitIndex = useful.findIndex((line, index) => index > 0 && addressStart.test(line))
  if (splitIndex < 1) splitIndex = Math.max(1, useful.length - 3)

  let nameLines = useful.slice(0, splitIndex)
  let addressLines = useful.slice(splitIndex)
  if (nameLines.length > 1 && /^\d+\s*&\s*\d+$/i.test(nameLines.at(-1)) && addressLines[0]?.startsWith(nameLines.at(-1))) {
    nameLines = nameLines.slice(0, -1)
  }

  const name = nameLines.join(' ').replace(/\s+/g, ' ').trim()
  const address = addressLines.join(' ').replace(/\s+/g, ' ').trim()
  if (name && address) records.push({ state: current.state, name, address: `${address}, ${current.state}, Malaysia` })
  current = null
}

for (let index = 0; index < lines.length; index += 1) {
  const combinedState = `${lines[index]} ${lines[index + 1] || ''}`
  if (states.has(combinedState)) {
    finishRecord()
    state = combinedState
    index += 1
    continue
  }
  if (states.has(lines[index])) {
    finishRecord()
    state = lines[index]
    continue
  }

  const match = lines[index].match(/^\d+\.\s*(.*)$/)
  if (match) {
    finishRecord()
    current = { state, lines: [match[1]] }
  } else if (current) {
    current.lines.push(lines[index])
  }
}
finishRecord()

fs.writeFileSync('data/official_centres.json', `${JSON.stringify(records, null, 2)}\n`)
console.log(`Prepared ${records.length} official centre records.`)
for (const record of records) console.log(`${record.state}\t${record.name}\t${record.address}`)
