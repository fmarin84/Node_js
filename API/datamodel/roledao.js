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

}