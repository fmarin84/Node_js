const Notificationdao = require("../datamodel/notificationdao")

module.exports = class Notificationservice {
    constructor(db) {
        this.dao = new Notificationdao(db)
    }

    isValid(notification) {
        if (notification.titre === "") return false
        if (notification.text === "") return false
        if (notification.islue === null) return false
        if (notification.fk_useraccount_id === null) return false
        return true
    }

}

