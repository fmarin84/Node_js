const BaseDAO = require('./basedao')

module.exports = class itemdao extends BaseDAO {
    constructor(db) {
        super(db,"item")
    }
    insert(item) {
        return this.db.query("INSERT INTO item(label,quantity,checked, fk_id_list) VALUES ($1,$2,$3,$4)",
            [item.label, item.quantity, item.checked, item.idList])
    }
/*
    getAll() {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM item ORDER BY label")
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }
    */

    getAll(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM item WHERE fk_id_list in (SELECT id FROM list WHERE useraccount_id=$1) ORDER BY label", [user.id])

            .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    update(item) {
        return this.db.query("UPDATE item SET label=$2, quantity=$3, checked=$4, fk_id_list=$5 WHERE id=$1",
            [item.id, item.label, item.quantity, item.checked, item.idList ])
    }

}