'use strict';

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

exports.up = async function (db) {

  await db.runSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  return db.createTable('duties', {
    id: { type: 'uuid', primaryKey: true, defaultValue: new String('uuid_generate_v4()') },
    name: 'string'
  });
};

exports.down = function (db) {
  return db.dropTable('duties');
};

exports._meta = {
  "version": 1
};
