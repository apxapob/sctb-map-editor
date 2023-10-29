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

exports.loadMapInfo = async (mapFilePath) => {
  const zip = fs.createReadStream(mapFilePath).pipe(unzipper.Parse({ forceStream: true }))
  for await (const entry of zip) {
    if(entry.path !== "info.json"){
      entry.autodrain()
    } else {
      const content = await entry.buffer()
      return content + ""
    }
  }
}

let fileChanges = {}
exports.removeMapFile = (curMapPath, filePath, dirFiles) => {
  fileChanges[filePath] = null
  if(dirFiles){
    for(const i in dirFiles){
      fileChanges[filePath + "/" + dirFiles[i]] = null
    }
  }
  startSaving(curMapPath)
}

exports.renameMapFile = (curMapPath, oldName, newName) => {
  fileChanges[oldName] = { newName }
  startSaving(curMapPath)
}

exports.saveMapFile = (curMapPath, filePath, text) => {
  fileChanges[filePath] = text
  startSaving(curMapPath)
}

let isSaving = false
const startSaving = async (curMapPath) => {
  if(isSaving) { return }
  isSaving = true

  console.log("saving map file", curMapPath)
  const filesToChange = fileChanges
  fileChanges = {}

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
    if(filesToChange[entry.path] !== undefined){
      const changeInfo = filesToChange[entry.path]
      delete filesToChange[entry.path]
      if(typeof changeInfo === "string"){//change file contents
        archive.append(changeInfo, { name: entry.path })
      } else if(typeof changeInfo === "object"){
        if(changeInfo?.newName !== undefined){//rename file
          const entryBuf = await entry.buffer()
          archive.append(entryBuf, { name: changeInfo.newName })
          continue
        }
      }

      //delete file
      entry.autodrain()
    } else {
      const entryBuf = await entry.buffer()
      archive.append(entryBuf, { name: entry.path })
    }
  }

  for(const path in filesToChange){
    const content = filesToChange[path]
    if(content !== null){
      archive.append(content, { name: path.includes(".") ? path : path + ".txt" })
    }
  }

  await archive.finalize()
  await fs.promises.rm(curMapPath)
  await fs.promises.rename(tempName, curMapPath)

  isSaving = false

  if(Object.keys(fileChanges).length > 0){
    startSaving(curMapPath)
  }
}