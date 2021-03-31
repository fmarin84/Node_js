const Itemdao = require("../datamodel/itemdao")

module.exports = class Itemservice {
    constructor(db) {
        this.dao = new Itemdao(db)
    }

    isValid(item) {
        // item.label = item.label.trim()
        // if (item.label === "") return false
        // if (item.quantity > 0) return false
        // if (item.checked == null) return false
        // if (item.idList == null) return false
        return true
    }
}

