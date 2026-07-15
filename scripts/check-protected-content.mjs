import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const assetsDirectory = path.resolve('dist/assets')
const protectedSentinels = [
  'Copa do Mundo',
  'Parque Aquatico',
  'BACIA',
  'ABACAXI',
  'TRAVESSEIRO'
]

const assetNames = await readdir(assetsDirectory)
const javascriptAssets = assetNames.filter((name) => name.endsWith('.js'))
const violations = []

for (const name of javascriptAssets) {
  const content = await readFile(path.join(assetsDirectory, name), 'utf8')
  for (const sentinel of protectedSentinels) {
    if (content.includes(sentinel)) violations.push(`${name}: ${sentinel}`)
  }
}

if (violations.length > 0) {
  throw new Error(`Protected game content found in public bundle:\n${violations.join('\n')}`)
}

process.stdout.write('Protected game content is absent from the public bundle.\n')
