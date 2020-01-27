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
  return db.createTable('selected_users', {
    number: {type: 'int', primaryKey: true},
    id: {
      type: 'string',
      length:13,
      notNull: true,
      unique: true,
      foreignKey: {
        name: "selected_id_fk",
        table: "users",
        rules: {
          onDelete: "CASCADE"
        },
        mapping: "id"
      }
    }
  }).then(() => {
    db.runSql("ALTER TABLE selected_users ADD COLUMN selectedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
