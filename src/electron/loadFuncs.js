const fs = require('fs')
const { isTextFile } = require('./StringUtils')

const loadMapDir = async (path, dirs, files, replacer, gameFile) => {
  const entries = await fs.promises.readdir(path, { withFileTypes: true })
  for (const entry of entries) {
    const entryPath = path + '\\' + entry.name
    const entryId = replacer( entryPath.replaceAll("\\", "/") )
    if (entry.isDirectory()) {
      dirs.push({
        gameFile,
        path: entryId
      })
      await loadMapDir(entryPath, dirs, files, replacer)
    } else {
      files.push({
        gameFile,
        content: await fs.promises.readFile(entryPath, isTextFile(entryPath) ? { encoding: 'utf8' } : null),
        path: entryId
      })
    }
  }
}
exports.loadMapDir = loadMapDir