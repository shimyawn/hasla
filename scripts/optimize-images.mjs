import sharp from 'sharp'
import { resolve } from 'node:path'

const PUBLIC = resolve(process.cwd(), 'public', 'images')
const srcMap = process.argv[2]

async function optimizeLogo() {
  const input = resolve(PUBLIC, 'logo.png')
  const out = resolve(PUBLIC, 'logo_optimized.png')
  await sharp(input)
    .resize({ width: 1024, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(out)
  console.log('logo optimized →', out)
}

async function optimizeMap() {
  if (!srcMap) return
  const out = resolve(PUBLIC, 'map.jpg')
  await sharp(srcMap)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, progressive: true })
    .toFile(out)
  console.log('map optimized →', out)
}

await optimizeLogo()
await optimizeMap()
