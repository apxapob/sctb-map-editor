const { deflate, unzip } = require('node:zlib');
const { promisify } = require('node:util');

const do_unzip = promisify(unzip);
const do_deflate = promisify(deflate);

exports.compress = (uncompressed) => {
  const buffer = Buffer.from(uncompressed);
  return do_deflate(buffer)
    .then(buf => buf); 
}

exports.decompress = (compressed) => {
  return do_unzip(compressed)
    .then(buf => buf.toString());
}
