class List {
    constructor(shop, date, archived, useraacount_id) {
        this.shop = shop
        this.date = date
        this.archived = archived
        this.useraacount_id = useraacount_id
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