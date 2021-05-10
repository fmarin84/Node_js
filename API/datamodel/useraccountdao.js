const BaseDAO = require('./basedao')

module.exports = class UserAccountDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    }

    insert(useraccount) {
        return this.db.query("INSERT INTO useraccount(displayname,login,challenge,isactived) VALUES ($1,$2,$3,$4)",
            [useraccount.displayName, useraccount.login, useraccount.challenge,useraccount.isactived])
    }

    getRoleByUser(userId) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT role.label, role.level FROM user_role, role WHERE user_role.fk_user_id=$1 and fk_role_id=role.id", [ userId ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }
    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getUserByLogin(login, userId) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT id,displayname,login FROM useraccount WHERE login = $1 and id != $2", [ login, userId])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

    update(useraccount){
        return this.db.query("UPDATE useraccount SET displayname=$1,login=$2,challenge=$3,isactived=$4 where id=$5",
            [useraccount.displayname, useraccount.login, useraccount.challenge,useraccount.isactived,useraccount.id])
    }

    updatePwd(useraccount) {
        return this.db.query("UPDATE useraccount SET challenge=$2 WHERE id=$1 and login=$3",
            [useraccount.id, useraccount.challenge, useraccount.login])
    }

}