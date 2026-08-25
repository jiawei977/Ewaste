import fs from 'node:fs'

const centres = JSON.parse(fs.readFileSync('data/geocoded_centres.json', 'utf8'))
const corrections = new Map([
  ['Pusat Kitar Semula Presint', ['Pusat Kitar Semula Presint 18 (Cawangan AFES)', 'Opposite Futsal 1 Malaysia, Presint 18, Putrajaya, Malaysia']],
  ['SenQ 1 Utama LG 102,1 Utama Shopping Centre Lebuh Bandar Utama, Bandar Utama', ['SenQ 1 Utama', 'LG102, 1 Utama Shopping Centre, Lebuh Bandar Utama, 47800 Petaling Jaya, Selangor, Malaysia']],
  ['Tan Boon Ming Sdn Bhd Cheras Sentral Cheras Sentral Shopping Mall, KM10,', ['Tan Boon Ming Sdn Bhd, Cheras Sentral', 'Cheras Sentral Shopping Mall, KM10, 56000 Cheras, Kuala Lumpur, Malaysia']],
  ['Yayasan Taiwan Buddhist Tzu Chi KL Jing Si Hall, 359, Jalan Kepong,', ['Yayasan Taiwan Buddhist Tzu Chi', 'KL Jing Si Hall, 359 Jalan Kepong, 52000 Kuala Lumpur, Malaysia']],
  ['Senheng Gombak Diamond Square No. 15 & 17 Jalan 2/50, Bt. 3 ½, Jalan Gombak', ['Senheng Gombak', 'No. 15 & 17, Diamond Square, Jalan 2/50, Jalan Gombak, 53000 Setapak, Kuala Lumpur, Malaysia']],
  ['Senheng Sri Petaling 95-', ['Senheng Sri Petaling 95-97-99', '95-99, Jalan 1/149D, 57000 Sri Petaling, Kuala Lumpur, Malaysia']],
  ['SenQ AEON Seremban', ['SenQ AEON Seremban 2', 'First Floor, AEON Seremban 2, 112 Persiaran S2 B1, 70200 Seremban, Negeri Sembilan, Malaysia']],
  ['Senheng Bentong P10 (Ground & Second Floor) & P11 (Ground Floor) Jalan MGI Pusat Perniagaan Mutiara Gemilang', ['Senheng Bentong', 'P10 & P11, Jalan MGI, Pusat Perniagaan Mutiara Gemilang, 28700 Bentong, Pahang, Malaysia']],
  ['ICT Digital Mall @', ['ICT Digital Mall @ KOMTAR', 'Level 3, KOMTAR, 10000 Georgetown, Pulau Pinang, Malaysia']],
  ['Senheng Ipoh Station', ['Senheng Ipoh Station 18', 'No. 9-13A, Jalan Pengkalan Utama 1, Taman Pengkalan Utama, 31650 Ipoh, Perak, Malaysia']],
])

function sql(value) {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL'
  return `'${String(value).replaceAll("'", "''")}'`
}

const rows = centres.map((centre) => {
  const correction = corrections.get(centre.name)
  const name = correction?.[0] || centre.name.replace('Prseint', 'Presint')
  const address = correction?.[1] || centre.address
  const quality = centre.coordinate_quality || (centre.latitude === null ? null : 'address')
  return `(${[name, address, titleCase(centre.state), centre.latitude, centre.longitude, quality, 'Government e-waste collection centres PDF', '2021-02-05'].map(sql).join(', ')})`
})

const schema = `-- Official household e-waste collection centres (government list updated 5 February 2021).
CREATE TABLE \`recycling_centres\` (
  \`centre_id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(180) NOT NULL,
  \`address\` varchar(500) NOT NULL,
  \`state\` varchar(100) NOT NULL,
  \`latitude\` decimal(10,8) DEFAULT NULL,
  \`longitude\` decimal(11,8) DEFAULT NULL,
  \`coordinate_quality\` enum('address','postcode') DEFAULT NULL,
  \`source_name\` varchar(255) NOT NULL,
  \`source_date\` date DEFAULT NULL,
  PRIMARY KEY (\`centre_id\`),
  KEY \`idx_recycling_centres_coordinates\` (\`latitude\`, \`longitude\`),
  KEY \`idx_recycling_centres_state\` (\`state\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO \`recycling_centres\`
  (\`name\`, \`address\`, \`state\`, \`latitude\`, \`longitude\`, \`coordinate_quality\`, \`source_name\`, \`source_date\`)
VALUES
${rows.join(',\n')};`

fs.writeFileSync('migrations/004_add_recycling_centres.sql', `${schema}\n`)

const databasePath = 'ewaste_db.sql'
let database = fs.readFileSync(databasePath, 'utf8')
if (!database.includes('CREATE TABLE `recycling_centres`')) {
  const marker = '-- --------------------------------------------------------\n\n--\n-- Table structure for table `recycling_guidelines`'
  database = database.replace(marker, `${schema}\n\n-- --------------------------------------------------------\n\n--\n-- Table structure for table \`recycling_guidelines\``)
  fs.writeFileSync(databasePath, database)
}

console.log(`Generated SQL for ${centres.length} centres (${centres.filter((centre) => centre.latitude !== null).length} with coordinates).`)

function titleCase(value) {
  return value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}
