const Roledao = require("../datamodel/roledao")

module.exports = class Roleservice {
    constructor(db) {
        this.dao = new Roledao(db)
    }

    isValid(role) {
        if (role.label === "") return false
        if (role.level === null) return false

        return true
    }

}

