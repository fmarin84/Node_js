const BaseDAO = require('./basedao')

module.exports = class paymentdao extends BaseDAO {
    constructor(db) {
        super(db,"payment")
    }

    getByUserId(userId) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM payment WHERE fk_useraccount_id=$1", [ userId ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }


    insert(payment) {
        return this.db.query("INSERT INTO payment(nom,prenom,fk_useraccount_id) VALUES ($1,$2,$3)",
            [payment.nom,payment.prenom, payment.fk_useraccount_id])
    }

}