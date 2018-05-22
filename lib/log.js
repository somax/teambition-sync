const db = require('./rdb');
const r = require('rethinkdbdash');

let log = {
    insert: function () {
        console.log('log module not ready...')
    }
}

/* let tableName = 'logs';
db.tableList().contains(tableName)
    .do(function (tableExists) {
        return r.branch(
            tableExists,
            { tables_created: 0 },
            db.tableCreate(tableName)
        );
    })
    .then(() => {
        db = db.table(tableName);
        log.insert = function (obj) {
                db.insert(obj)
            }
        }
    ) */

module.exports = log;