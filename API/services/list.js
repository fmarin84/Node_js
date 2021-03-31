const Listdao = require("../datamodel/listdao")

module.exports = class Listservice {
    constructor(db) {
        this.dao = new Listdao(db)
    }

    isValid(list) {
        list.shop = list.shop.trim()
        if (list.shop === "") return false
        if (list.date != null) {
            if (list.date instanceof String) {
                list.date = new Date(list.date)
            }
            if (list.builddate >= new Date()) return false
        }
        if (list.archived == null)  return false
        return true
    }
}