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
            this.db.query("SELECT role.id, role.label, role.level FROM user_role, role WHERE user_role.fk_user_id=$1 and fk_role_id=role.id", [ userId ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

    getNotRoleByUser(userId) {
        return new Promise((resolve, reject) =>
            this.db.query("select * FROM role WHERE role.id not in (select fk_role_id from user_role where user_role.fk_user_id = $1)", [ userId ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

    isAdmin(userId) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT role.label, role.level FROM user_role, role WHERE user_role.fk_user_id=$1 and fk_role_id=role.id and role.level=100", [ userId ])
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
            this.db.query("SELECT id,displayname,login FROM useraccount WHERE login LIKE $1 and id != $2", [ '%'+login+ '%', userId])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

    getUserByLoginAbonne(login, userId) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT id,displayname,login FROM useraccount, user_role WHERE login LIKE $1 and id != $3 and user_role.fk_user_id=useraccount.id and user_role.fk_role_id=3", [ '%'+login+ '%', userId])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

    getUsersByAbonne() {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT id,displayname,login FROM useraccount, user_role WHERE user_role.fk_user_id=useraccount.id and user_role.fk_role_id=3")
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

    getAll() {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount ORDER BY login")
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    deleteRoleUser(userId, roleId) {
        return this.db.query(`DELETE FROM user_role WHERE fk_user_id=$1 and fk_role_id=$2`, [userId, roleId])
    }

    addRoleUser(userId, roleId) {
        return this.db.query("INSERT INTO user_role(fk_user_id,fk_role_id) VALUES ($1,$2)",[userId, roleId])
    }

}