class List {
    constructor(shop, date, archived) {
        this.shop = shop
        this.date = date
        this.archived = archived
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