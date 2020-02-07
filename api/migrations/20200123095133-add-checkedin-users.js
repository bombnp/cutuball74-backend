'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function(db) {
  return db.createTable('checkedin_users', {
      number: { type: 'int', primaryKey: true, autoIncrement: true },
      id: {
        type: 'string',
        notNull: true,
        unique: true,
        foreignKey: {
          name: 'checked_id_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE'
          },
          mapping: 'id'
        }
      }
    })
    .then(() => {
      db.runSql('ALTER TABLE checkedin_users ADD COLUMN checkedinAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    })
}

exports.down = function(db) {
  return null
}

exports._meta = {
  version: 1
}
