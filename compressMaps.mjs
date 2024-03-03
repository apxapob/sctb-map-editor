import fs from "fs"
import archiver from "archiver"

const mapsSource = "../sctb-client/maps/"

const compressFolder = async (mapDir, dest) => {
  const output = fs.createWriteStream(dest)
  const archive = archiver('zip', { zlib: { level: 9 } })
  output.on('close', () => {})
  output.on('end', () => console.log('Data has been drained'))
  archive.on('warning', err => {
    if (err.code === 'ENOENT') {
      console.log("err", err.message)
    } else {
      console.error(err)
    }
  })
  archive.on('error', err => console.error(err))
  archive.pipe(output)

  archive.directory(mapDir, false)

  await archive.finalize()
}

const maps = await fs.promises.readdir(mapsSource)
while(maps.length > 0){
  const map = maps.pop()
  var stats = await fs.promises.stat(mapsSource + map)
  if(!stats.isDirectory()){ continue }

  console.log("compressing", map)
  if(fs.existsSync(mapsSource + map + ".map")){
    await fs.promises.rm(mapsSource + map + ".map")
  }
  
  await compressFolder(mapsSource + map, mapsSource + map + ".map")
}