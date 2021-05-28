module.exports = class Payment {
    constructor(nom, prenom, fk_useraccount_id) {
        this.nom = nom
        this.prenom = prenom
        this.fk_useraccount_id = fk_useraccount_id
    }
}