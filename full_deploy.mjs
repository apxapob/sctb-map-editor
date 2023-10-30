import { promisify } from "util";
import { exec } from "node:child_process"
import fs from "fs"
import archiver from "archiver"

const resSource = "../sctb-client/res/"
const mapsSource = "../sctb-client/maps/"
const win64packagePath = "./out/sctb-map-editor-win32-x64/"
const asarDir = win64packagePath + "resources/"
const resDest = win64packagePath + "res/"
const mapsDest = win64packagePath + "maps/"
const savesDest = win64packagePath + "saves/"

const shell = promisify(exec);

const removeExcept = async (dir, exceptions) => {
  const entries = await fs.promises.readdir(dir)
  while(entries.length > 0){
    const entry = entries.pop()
    if(exceptions[entry]){ continue }

    await fs.promises.rm(dir + entry, { recursive: true, force: true })
  }
}

const makeMapFile = async (mapDir, dest) => {
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

console.log("!!! FULL DEPLOY STARTED !!!")

console.log("1) Building static files...")
await shell('npm run build')

console.log("2) Fixing the html...")
const html = await fs.promises.readFile("./dist/index.html", { encoding: 'utf8' })
await fs.promises.writeFile(
  "./dist/index.html", 
  html.replaceAll(`="/assets`, `="./assets`)
)

console.log("3) Packaging electron...")
await shell('npm run package')

console.log("4) Copying maps and resources...")
await fs.promises.mkdir(savesDest)
await fs.promises.mkdir(resDest)
await fs.promises.mkdir(mapsDest)

const entries = await fs.promises.readdir(resSource)
while(entries.length > 0){
  const entry = entries.pop()
  if(entry === ".tmp"){ continue }
  var stats = await fs.promises.stat(resSource + entry)
  if(stats.isDirectory()){
    await fs.promises.mkdir(resDest + entry)

    const subEntries = await fs.promises.readdir(resSource + entry)
    entries.push(
      ...subEntries.map(s => entry + "/" + s)
    )
  } else {
    await fs.promises.copyFile(resSource + entry, resDest + entry)
  }
}

const maps = await fs.promises.readdir(mapsSource)
while(maps.length > 0){
  const map = maps.pop()
  var stats = await fs.promises.stat(mapsSource + map)
  if(!stats.isDirectory()){ continue }

  await makeMapFile(mapsSource + map, mapsDest + map + ".map")
}

console.log("5) Removing garbage from app.asar...")
await shell(`npx asar extract ${asarDir + "app.asar"} ${asarDir + "app"}`)
await fs.promises.rm(asarDir + "app.asar")

await fs.promises.rm(asarDir + "app/public/", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/.vscode/", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/.eslintrc", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/README.md", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/dist/game/sctb.js.map", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/.gitignore", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/tsconfig.json", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/index.html", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/forge.config.js", { recursive: true, force: true })
await fs.promises.rm(asarDir + "app/full_deploy.mjs", { recursive: true, force: true })

await removeExcept(asarDir + "app/src/", { electron: true })
await removeExcept(asarDir + "app/node_modules/", {
  "archiver": true, 
  "archiver-utils": true, 
  "unzipper": true,
  "readdir-glob": true,
  "balanced-match": true,
  "async": true,
  "isarray": true,
  "graceful-fs": true,
  "lazystream": true,
  "process-nextick-args": true,
  "core-util-is": true,
  "inherits": true,
  "util-deprecate": true,
  "normalize-path": true,
  "lodash": true,
  "readable-stream": true,
  "fs.realpath": true,
  "inflight": true,
  "wrappy": true,
  "once": true,
  "zip-stream": true,
  "tar-stream": true,
  "compress-commons": true,
  "crc-32": true,
  "crc32-stream": true,
  "streamx": true,
  "queue-tick": true,
  "fast-fifo": true,
  "b4a": true,
  "buffer-crc32": true,
  "listenercount": true,
  "buffer-indexof-polyfill": true,
  "setimmediate": true,
  "binary": true,
  "chainsaw": true,
  "traverse": true,
  "buffers": true,
  "bluebird": true,
  "duplexer2": true,
  "fstream": true,
  "mkdirp": true,
  "big-integer": true,
})

await shell(`npx asar pack ${asarDir + "app"} ${asarDir + "app.asar"}`)
await fs.promises.rm(asarDir + "app/", { recursive: true, force: true })

console.log("!!! FULL DEPLOY FINISHED !!!")
