'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('users', {
    id: {type: 'string', primaryKey:true},
    name: {type: "string", notNull: true},
    email: {type: "string", notNull: true},
    faculty: {type: "string", notNull: true},
    tel: {type: "string", notNull: true},
    role: {type: "string", notNull: true, defaultValue: "user"}
  }).then(() => {
    db.runSql("ALTER TABLE users ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
  }).then(() => {
    db.runSql("ALTER TABLE users ADD COLUMN modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
