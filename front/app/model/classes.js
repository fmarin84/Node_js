class List {
    constructor(shop, date, archived, useraccount_id) {
        this.shop = shop
        this.date = date
        this.archived = archived
        this.useraccount_id = useraccount_id
    }
    toString() {
        return `${this.shop} du ${this.date.toLocaleDateString()}`
    }
}

class Item {
    constructor(label, quantity, checked, idList) {
        this.label = label
        this.quantity = quantity
        this.checked = checked
        this.fk_id_list = idList
    }
    toString() {
        return `${this.label} ${this.quantity} ${this.checked}`
    }
}


class User {
    constructor(displayname, login, isactived) {
        this.displayname = displayname
        this.login = login
        this.isactived = isactived

    }

    toString() {
        return `${this.displayname} ${this.login}`
    }
}


class Share {
    constructor(listId, userId, state) {
        this.list_id = listId
        this.useraccount_id = userId
        this.state = state

    }
    toString() {
        return `${this.list_id} ${this.useraccount_id} ${this.state}`
    }
}

class Role {
    constructor(label, level) {
        this.label = label
        this.level = level
    }
    toString() {
        return `${this.label} ${this.level} `
    }
}

class Notif {

    constructor(titre, text, islue, useraccount_id, listshareid = null) {
        this.titre = titre
        this.text = text
        this.islue = islue
        this.fk_useraccount_id = useraccount_id
        this.listshareid = listshareid
    }
    toString() {
        return `${this.titre} ${this.text} `
    }
}
class Payment {

    constructor(nom, prenom, fk_fk_useraccount_id) {
        this.nom = nom
        this.prenom = prenom
        this.fk_useraccount_id = fk_fk_useraccount_id
    }

    toString() {
        return `${this.nom} ${this.prenom} `
    }
}