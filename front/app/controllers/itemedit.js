class ItemEditController extends BaseFormController {

    constructor() {
        super()

        let title = `<h3> Ajout article </h3>`

        if (listcurentController.selectedItem) {
            self.item = listcurentController.selectedItem
            listcurentController.selectedItem = null
            $("#fieldItemQte").value = self.item.quantity
            $("#fieldItemName").value = self.item.label
            self.item.idList = self.item.fk_id_list
            title = `<h3> Modification article </h3>`
        }
        $('#editTitleItem').innerHTML = title
        this.displayNotif()

    }
    async displayNotif() {
        const currentUser = await this.modelUser.getThisUser()
        const nbNotifs = await this.modelNotification.countNotification(currentUser.id)
        $('#notification').innerText = nbNotifs
        $('#notificationMenu').innerText = nbNotifs
    }

    async save() {
        let qte = this.validateRequiredField('#fieldItemQte', 'Qte')
        let label = this.validateRequiredField("#fieldItemName", 'Name')
        if ((qte != null) &&  (qte > 0) && (label != null)) {
            try {
                if (self.item) {
                    self.item.quantity = qte
                    self.item.label = label
                    if (await this.modelItem.update(self.item) === 200) {
                        this.toast("La marchandise a bien été modifé")
                        self.item = null
                        navigate('listcurent')

                    } else {
                        this.displayServiceError()
                    }
                } else {
                    if (await this.modelItem.insert(new Item(label, qte, false, window.idEntity)) === 200) {
                        this.toast("La marchandise a bien été inséré")
                        navigate('listcurent')
                    } else {
                        this.displayServiceError()
                    }
                }
            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
        }
    }


}

window.itemeditController = new ItemEditController()
