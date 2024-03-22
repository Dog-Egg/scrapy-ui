const path = require("path");
const DBMigrate = require("db-migrate");

/**
 * 向上迁移数据库。
 */
function dbmigrate(filename, callback) {
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

module.exports = {
  dbmigrate,
};
