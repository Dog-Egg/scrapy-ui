#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const DBMigrate = require("db-migrate");
const path = require("path");

// process.env.PORT = 3010;
const SCRAPY_UI_DATABASE = path.join(process.cwd(), "scrapy-ui.db");

process.env.SCRAPY_UI_DATABASE = SCRAPY_UI_DATABASE;

yargs(hideBin(process.argv))
  .command(
    "run",
    "run ScrapyUI web.",
    (yargs) => {
      return yargs.option("port", {
        describe: "web service port number",
        type: "number",
        default: 8600,
      });
    },
    (argv) => {
      // set service port
      process.env.PORT = argv.port;

      const dbm = DBMigrate.getInstance(true, {
        config: {
          prod: {
            driver: "sqlite3",
            filename: SCRAPY_UI_DATABASE,
          },
        },
        cmdOptions: {
          "migrations-dir": path.join(__dirname, "../migrations"),
        },
        env: "prod",
      });

      dbm.up().then(() => {
        require("../build/standalone/server");
      });
    },
  )
  .demandCommand()
  .version()
  .help()
  .parse();
