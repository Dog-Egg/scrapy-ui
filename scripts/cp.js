const fs = require("fs");

fs.cp(
  "build/static",
  "build/standalone/build/static",
  { recursive: true },
  (err) => {
    if (err) {
      throw err;
    }
  },
);
