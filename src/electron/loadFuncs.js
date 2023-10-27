const fs = require('fs')
const archiver = require('archiver')
const unzipper = require("unzipper")
const { isTextFile } = require('./StringUtils')

const loadMapDir = async (path, dirs, files, replacer) => {
  const entries = await fs.promises.readdir(path, { withFileTypes: true })
  for (const entry of entries) {
    const entryPath = path + '\\' + entry.name
    const entryId = replacer( entryPath.replaceAll("\\", "/") )
    if (entry.isDirectory()) {
      dirs.push(entryId)
      await loadMapDir(entryPath, dirs, files, replacer)
    } else {
      files.push({
        content: await fs.promises.readFile(entryPath, isTextFile(entryPath) ? { encoding: 'utf8' } : null),
        path: entryId
      })
    }
  }
}
exports.loadMapDir = loadMapDir

exports.loadMapFile = async (path, dirs, files) => {
  const zip = fs.createReadStream(path).pipe(unzipper.Parse({ forceStream: true }))
  for await (const entry of zip) {
    if(entry.type === "Directory"){
      dirs.push(entry.path.substring(0, entry.path.length-1))
      entry.autodrain()
    } else {
      let content = await entry.buffer()
      
      if(content.buffer.byteLength !== entry.size && !isTextFile(entry.path)){
        //sometimes this happens and heaps can't parse such files
        content = new Uint8Array(content)
      }
      files.push({ content, path: entry.path })
    }
  }
}

let unsavedFiles = {}
exports.saveMapFile = (curMapPath, filePath, text) => {
  unsavedFiles[filePath] = text
  console.log("saving map file", curMapPath, filePath, isSaving)
  if(!isSaving){
    startSaving(curMapPath)
  }
}

let isSaving = false
const startSaving = async (curMapPath) => {
  isSaving = true
  const filesToSave = unsavedFiles
  unsavedFiles = {}

  const tempName = curMapPath + '_'
  const output = fs.createWriteStream(tempName)
  const archive = archiver('zip', { zlib: { level: 9 } })
  output.on('close', () => console.log("map saved:", archive.pointer() + " total bytes"))
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

  const zip = fs.createReadStream(curMapPath).pipe(unzipper.Parse({ forceStream: true }))
  for await (const entry of zip) {
    if(filesToSave[entry.path] !== undefined){
      archive.append(filesToSave[entry.path], { name: entry.path })
      entry.autodrain()
    } else {
      const entryBuf = await entry.buffer()
      archive.append(entryBuf, { name: entry.path })
    }
  }

  await archive.finalize()
  await fs.promises.rm(curMapPath)
  await fs.promises.rename(tempName, curMapPath)

  isSaving = false

  if(Object.keys(unsavedFiles).length > 0){
    startSaving(curMapPath)
  }
}