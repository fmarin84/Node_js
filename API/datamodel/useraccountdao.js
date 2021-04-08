const BaseDAO = require('./basedao')

module.exports = class UserAccountDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    }

    insert(useraccount) {
        return this.db.query("INSERT INTO useraccount(displayname,login,challenge) VALUES ($1,$2,$3)",
            [useraccount.displayName, useraccount.login, useraccount.challenge])

    }

/*
    insert(useraccount) {
        return new Promise((resolve, reject) => {
            return this.db.query("INSERT INTO useraccount(displayname,login,challenge) VALUES ($1,$2,$3)",
                [useraccount.displayName, useraccount.login, useraccount.challenge])
                .then(res => resolve(res.rows[0]))
                .catch(err => reject(err))
        })
    }
*/
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

    setIsActived(userId){
        return this.db.query("UPDATE useraccount SET isactived=true WHERE id=$1",
            [userId])
    }

    update(useraccount) {
        return this.db.query("UPDATE useraccount SET displayname=$2, login=$3 WHERE id=$1",
            [useraccount.id, useraccount.displayname, useraccount.login])
    }

}