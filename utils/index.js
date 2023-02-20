const fs = require("fs");

const readFile = (filename) => {
  return JSON.parse(fs.readFileSync(`./module/${filename}`));
}

const writeFile = (filename, data) => {
  return fs.writeFileSync(`./module/${filename}`, JSON.stringify(data), null, 4);
}

module.exports = {
  readFile,
  writeFile
}