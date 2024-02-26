"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.runSql(
    `
    CREATE TABLE jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nodeid INTEGER NOT NULL,
      jobid TEXT NOT NULL,
      args TEXT NOT NULL,
      createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(nodeid) REFERENCES nodes(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_jobid on jobs(jobid);
    `,
    callback,
  );
};

exports.down = function (db, callback) {
  db.dropTable("jobs", callback);
};

exports._meta = {
  version: 1,
};
