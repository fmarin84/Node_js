module.exports = class Notification {
    constructor(titre, text, islue, fk_useraccount_id) {
        this.titre = titre
        this.text = text
        this.islue = islue
        this.fk_useraccount_id = fk_useraccount_id
    }
}