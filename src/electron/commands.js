const { dialog } = require('electron')
const { mainWindow } = require('./main')
const fs = require('fs')

exports.openMap = async () => {
  const dir = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory']
  })
  console.log('!!! open map', dir)
  if (!dir) { return }
  
  try {
    const files = await fs.promises.readdir(dir[0])
    for (const file of files) {
      console.log(file)
      if (file.indexOf('.json') === -1) continue
      const fileText = await fs.promises.readFile(dir[0] + '\\' + file, { encoding: 'utf8' })
      //console.log('!!! json', fileText)
    }
  } catch (err) {
    console.error(err)
  }
}
