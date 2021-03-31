const BaseDAO = require('./basedao')

module.exports = class listdao extends BaseDAO {
    constructor(db) {
        super(db,"list")
    }
    insert(list) {
        return this.db.query("INSERT INTO list(shop,date,archived, useraccount_id) VALUES ($1,$2,$3,$4)",
            [list.shop, list.date, list.archived, list.useraccount_id])
    }
/*
    getAll() {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM list WHERE archived=false ORDER BY shop")
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }
*/
    getAll(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM list WHERE useraccount_id=$1 and archived=false ORDER BY shop", [user.id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }
    getAchived(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM list WHERE useraccount_id=$1 and archived=true ORDER BY shop", [user.id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    update(list) {
        return this.db.query("UPDATE list SET shop=$2, date=$3, archived=$4 WHERE id=$1",
            [list.id, list.shop, list.date, list.archived])
    }

}