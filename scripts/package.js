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
      ".next/static",
      ".next/standalone/.next/static",
      { recursive: true },
      (err) => {
        if (err) {
          console.log(err);
        }
      },
    );
  }
});
