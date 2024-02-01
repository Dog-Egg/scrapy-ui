#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const DBMigrate = require("db-migrate");
const path = require("path");

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

      dbmigrate(argv.dbfile, {
        callback: () => {
          require("../build/standalone/server");
        },
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
    default: "scrapy-ui.db",
    coerce(arg) {
      return path.resolve(arg);
    },
  });
}

/**
 * 向上迁移数据库。
 */
function dbmigrate(filename, { callback } = {}) {
  const dbm = DBMigrate.getInstance(true, {
    config: {
      prod: {
        driver: "sqlite3",
        filename,
      },
    },
    cmdOptions: {
      "migrations-dir": path.join(__dirname, "../migrations"),
    },
    env: "prod",
  });

  dbm.up().then(() => {
    callback && callback();
  });
}
