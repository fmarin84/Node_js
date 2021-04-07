class CompteController extends BaseFormController {

    constructor() {
        super()
        this.edit()
    }


    async edit() {
        try {
            const object = await this.modelUser.getThisUser()
            console.log(object.id)

            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }
            this.selectedUser = object

            $("#editTitleCompte").innerHTML = `<h3> Bonjour ${object.displayname}</h3>`
            $("#fieldNom").value = object.displayname
            $("#fieldAdresse").value = object.login

            //navigate('listedit')
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async save() {
        /*
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
                    if (await this.modelItem.insert(new Item(label, qte, false, window.idCurrentList)) === 200) {
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

         */
    }


}

window.compteController = new CompteController()
