const BaseDAO = require('./basedao')

module.exports = class ShareDAO extends BaseDAO {
    constructor(db) {
        super(db, "share")
    }

    insert(share) {
        return this.db.query("INSERT INTO share(fk_id_list,useraccount_id,state) VALUES ($1,$2,$3)",
            [share.list_id, share.useraccount_id,share.state ])
    }

    getByUser(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM share WHERE useraccount_id=$1", [ user.id ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    delete(listId, userId) {
        return this.db.query(`DELETE FROM share WHERE fk_id_list=$1 and useraccount_id=$2`, [listId, userId])
    }

    deleteShareList(listId) {
        return this.db.query(`DELETE FROM share WHERE fk_id_list=$1`, [listId])
    }

}
