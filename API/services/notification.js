const Notificationdao = require("../datamodel/notificationdao")

module.exports = class Notificationservice {
    constructor(db) {
        this.dao = new Notificationdao(db)
    }

}

