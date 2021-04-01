class List {
    constructor(shop, date, archived, useraccount_id) {
        this.shop = shop
        this.date = date
        this.archived = archived
        this.useraccount_id = useraccount_id
    }
    toString() {
        return `Liste du ${this.date}`
    }
}

class Item {
    constructor(label, quantity, checked, idList) {
        this.label = label
        this.quantity = quantity
        this.checked = checked
        this.idList = idList
    }
    toString() {
        return `${this.label} ${this.quantity} ${this.checked}`
    }
}


class User {
    constructor(displayname, login) {
        this.displayname = displayname
        this.login = login

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