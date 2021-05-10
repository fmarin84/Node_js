const Roledao = require("../datamodel/roledao")

module.exports = class Roleservice {
    constructor(db) {
        this.dao = new Roledao(db)
    }

}

