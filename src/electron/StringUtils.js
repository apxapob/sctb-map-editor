const { brotliCompress, brotliDecompress, constants } = require('node:zlib')
const { promisify } = require('node:util')

const decompressAsync = promisify(brotliDecompress)
const compressAsync = promisify(brotliCompress)

exports.compress = async (uncompressed, needBuffer = false) => {
  const buf = await compressAsync(
    uncompressed,
    {
      params: { [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT }
    }
  )
  return needBuffer ? buf : buf.toString("base64")
}

exports.decompress = async (compressed, needBuffer = false) => {
  const buf = await decompressAsync(
    Buffer.from(compressed, "base64"),
    {
      params: { [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT }
    }
  )
  return needBuffer ? buf : buf.toString()
}

exports.isTextFile = filePath => filePath.endsWith('.json') || filePath.endsWith('.hx') || filePath.endsWith('.txt')