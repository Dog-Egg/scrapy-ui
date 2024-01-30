#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
var DBMigrate = require("db-migrate");
const path = require("path");

// process.env.PORT = 3010;
const SCRAPY_UI_DATABASE = path.join(process.cwd(), "scrapy-ui.db");

process.env.SCRAPY_UI_DATABASE = SCRAPY_UI_DATABASE;

var dbm = DBMigrate.getInstance(true, {
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

yargs(hideBin(process.argv))
  .command(
    "run",
    "run ScrapyUI web.",
    (yargs) => {
      return yargs;
    },
    () => {
      dbm.up().then(() => {
        require("../.next/standalone/server");
      });
    },
  )
  .demandCommand()
  .version(false)
  .help()
  .parse();
