const config = require('../config');
const r = require('rethinkdbdash')(config.db.server);
const log = require('solog');

let dbName = config.db.dbName;

// 如果 dbName 不存在就创建
r.dbList().contains(dbName)
    .do(function (dbExists) {
        return r.branch(
            dbExists,
            { dbs_created: 0 },
            r.dbCreate(dbName)
        );
    }).then(log);

module.exports = r.db(dbName);