const Paymentdao = require("../datamodel/paymentdao")

module.exports = class Paymentservice {
    constructor(db) {
        this.dao = new Paymentdao(db)
    }

    isValid(payment) {
        if (payment.nom === "") return false
        if (payment.prenom === "") return false
        if (payment.fk_useraccount_id === null) return false
        return true
    }

}

