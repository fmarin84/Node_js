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

    getShare(listId, user) {
        return new Promise((resolve, reject) =>
         //   this.db.query("SELECT * FROM item WHERE fk_id_list in (SELECT id FROM list WHERE useraccount_id=$1) ORDER BY label", [userShare.id])
        this.db.query("SELECT item.*, share.state FROM list, item, useraccount, share WHERE list.id=share.fk_id_list and share.useraccount_id = $2 and  item.fk_id_list=list.id and useraccount.id= list.useraccount_id and item.fk_id_list in (SELECT share.fk_id_list FROM share WHERE fk_id_list=$1 and useraccount_id=$2) and item.fk_id_list=$1 and archived=false ORDER BY shop"
            , [listId,user.id])

                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    update(item) {
        return this.db.query("UPDATE item SET label=$2, quantity=$3, checked=$4, fk_id_list=$5 WHERE id=$1",
            [item.id, item.label, item.quantity, item.checked, item.idList ])
    }

}