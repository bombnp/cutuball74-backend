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
  return db.createTable("checkedin_users", {
    id: {type: 'string', length:13, primaryKey:true},
    name: {type: "string", notNull: true},
    email: {type: "string", notNull: true},
    faculty: {type: "string", notNull: true},
    tel: {type: "string", notNull: true},
    createdAt: {type: "timestamp", defaultValue: new String("CURRENT_TIMESTAMP")},
    modifiedAt: {type: "timestamp", defaultValue: new String("CURRENT_TIMESTAMP")}
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
