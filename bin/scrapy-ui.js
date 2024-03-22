#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const dbmigrate = require("../lib/migration").dbmigrate;

yargs(hideBin(process.argv))
  .command(
    "run",
    "Run ScrapyUI web.",
    (yargs) => {
      return dbCmdOptions(
        yargs.option("port", {
          describe: "web service port number",
          type: "number",
          default: 8600,
        }),
      );
    },
    (argv) => {
      // envirments
      process.env.SCRAPY_UI_DATABASE = argv.dbfile;
      process.env.PORT = argv.port;

      dbmigrate(argv.dbfile, () => {
        require("../build/standalone/server");
      });
    },
  )
  .command(
    "migrate",
    "Upward migration database",
    (yargs) => {
      return dbCmdOptions(yargs);
    },
    (argv) => {
      dbmigrate(argv.dbfile);
    },
  )
  .demandCommand()
  .version()
  .help()
  .parse();

function dbCmdOptions(yargs) {
  return yargs.option("dbfile", {
    describe: "Specify database file.",
    default: path.resolve("scrapy-ui.db"),
    coerce(arg) {
      return path.resolve(arg);
    },
  });
}
