#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
var DBMigrate = require("db-migrate");
const path = require("path");

// process.env.PORT = 3010;

var dbm = DBMigrate.getInstance(true, {
  config: {
    prod: {
      driver: "sqlite3",
      filename: "scrapy-ui.db",
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
