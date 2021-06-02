module.exports = class Item {
    constructor(label, quantity, checked, idList) {
        this.label = label
        this.quantity = quantity
        this.checked = checked
        this.fk_id_list = idList
    }
}