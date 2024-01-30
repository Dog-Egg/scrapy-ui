const { spawn } = require("child_process");
const fs = require("fs");

const builder = spawn("./node_modules/.bin/next", ["build"]);

builder.stdout.on("data", (data) => {
  console.log(`${data}`);
});

builder.stderr.on("data", (data) => {
  console.error(`${data}`);
});

builder.on("close", (code) => {
  if (code === 0) {
    fs.cp(
      "build/static",
      "build/standalone/build/static",
      { recursive: true },
      (err) => {
        if (err) {
          console.log(err);
        }
      },
    );
  }
});
