const fs = require("fs");

const source = "build/static";
const destination = "build/standalone/build/static";

fs.cp(source, destination, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Copy successfully: ${source} -> ${destination}`);
});
