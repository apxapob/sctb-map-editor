const fs = require('fs')

exports.makeNewMap = async (dir) => {
  const mapId = dir.split(/[\\/]/gm).pop()

  await makeRootFiles(dir, mapId)

  await makeFieldsDir(dir, mapId)
  await makeImagesDir(dir, mapId)
  await makeLocaleDir(dir, mapId)
  await makeParticlesDir(dir, mapId)
  await makeScriptsDir(dir, mapId)
}

const makeRootFiles = async (dir, mapId) => {
  await fs.promises.writeFile(
    dir + '\\buffs.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\units.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\items.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\skills.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\upgrades.json',
    JSON.stringify({})
  )
  await fs.promises.writeFile(
    dir + '\\info.json',
    JSON.stringify({  
      mapId,
      name: mapId,
      author: 'unknown',
      version: 0.01,
      minPlayers: 1,
      maxPlayers: 6,
      countries: [
        {
          color: 16729156,
          minerals: 100,
          mana: 10
        },
        {
          color: 4474111,
          minerals: 100,
          mana: 10
        },
        {
          color: 4521796,
          minerals: 100,
          mana: 10
        },
        {
          color: 4521983,
          minerals: 100,
          mana: 10
        },
        {
          color: 16729343,
          minerals: 100,
          mana: 10
        },
        {
          color: 16777028,
          minerals: 100,
          mana: 10
        }
      ],
      tiles: [
        {
          image_h: "hex_h.png",
          image_v: "hex_v.png",
          color: 16777215
        },
        {
          image_h: "hex_h.png",
          image_v: "hex_v.png",
          color: 0
        }
      ],
    }, null, 2)
  )
}

const makeLocaleDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\locales')
  await fs.promises.writeFile(
    dir + '\\locales\\en.json',
    JSON.stringify({ mapName: mapId }, null, 2)
  )
}

const makeParticlesDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\particles')
}

const makeScriptsDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\scripts')
  await fs.promises.writeFile(
    dir + '\\scripts\\help.hx',
    testScriptText
  )
}

const makeImagesDir = async (dir, mapId) => {
  await fs.promises.mkdir(dir + '\\img')
  await fs.promises.mkdir(dir + '\\img\\units')
  await fs.promises.mkdir(dir + '\\img\\items')
  await fs.promises.mkdir(dir + '\\img\\tiles')
}

const makeFieldsDir = async (dir, mapId) => {
  const mapSize = 19

  await fs.promises.writeFile(
    dir + '\\field.json',
    JSON.stringify({
      size: mapSize,
      tiles: Array(mapSize * mapSize).fill([1, 0]),
      units: {},
      items: {},
    }, null, 2)
  )
}

const testScriptText = `
//This is a script file. The script language is Haxe.
//Check this for details: https://github.com/HaxeFoundation/hscript

//There are global variables and functions.
//Use trace function to write any information in the console. Like this:
trace("Hello World!");

//There are also global utility classes: Math and HexMath.
//See how other scripts use them.

//All game variables are stored in vars global object. 
//All game functions are stored in funcs global object.
//Look what's inside:
trace(vars);
trace(funcs);
trace(HexMath);
trace(Math);

//Sometimes the game waits for a script to return a value.
//For example, if you return false, it will be considered a failure and any changes made by the script will be reverted.
return false;
`
