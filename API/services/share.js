const Sharedao = require("../datamodel/sharedao")

module.exports = class Shareservice {
    constructor(db) {
        this.dao = new Sharedao(db)
    }

    isValid(share) {
        return true
    }
}
