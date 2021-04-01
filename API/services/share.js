const Sharedao = require("../datamodel/sharedao")

module.exports = class Shareservice {
    constructor(db) {
        this.dao = new Sharedao(db)
    }

    isValid(share) {


        if (share.list_id === 0) return false
        if (share.useraccount_id === 0) return false
        if (share.state === "") return false

        return true
    }

}
