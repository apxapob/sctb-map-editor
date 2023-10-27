const fs = require('fs')
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
  const zip = fs.createReadStream(path).pipe(unzipper.Parse({forceStream: true}));
  for await (const entry of zip) {
    if(entry.type === "Directory"){
      dirs.push(entry.path.substring(0, entry.path.length-1))
      entry.autodrain();
    } else {
      let content = await entry.buffer()
      
      if(content.buffer.byteLength !== entry.size && !isTextFile(entry.path)){
        content = new Uint8Array(content)
      }
      files.push({ content, path: entry.path })
    }
  }
}