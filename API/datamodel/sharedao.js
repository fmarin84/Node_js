const BaseDAO = require('./basedao')

module.exports = class ShareDAO extends BaseDAO {
    constructor(db) {
        super(db, "share")
    }

    insert(list, useraccount, state) {
        return this.db.query("INSERT INTO share(list_id,useraccount_id,state) VALUES ($1,$2,$3)",
            [list.id, useraccount.id, state])
    }

    getByUser(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM share WHERE useraccount_id=$1", [ user.id ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

}
