const BaseDAO = require('./basedao')

module.exports = class roledao extends BaseDAO {
    constructor(db) {
        super(db,"role")
    }

    insert(role) {
        return this.db.query("INSERT INTO role(label,level) VALUES ($1,$2)",
            [role.label, role.level])
    }

    addRoleUser(userId, roleId) {
        return this.db.query("INSERT INTO user_role(fk_user_id, fk_role_id) VALUES ($1,$2)",
            [userId, roleId])
    }

 /*
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
     */

}