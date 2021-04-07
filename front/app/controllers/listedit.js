class ListEditController extends BaseFormController {

    constructor() {
        super()
        let title = `<h3> Ajout d'une liste </h3>`

        if (indexController.selectedList) {
            self.list = indexController.selectedList
            indexController.selectedList = null
            $("#fieldListMagasin").value = self.list.shop
            $("#fielListDate").value = self.list.date.toISOString().substr(0, 10)
            title = `<h3> Modification d'une liste </h3>`
        }

        $('#editTitleList').innerHTML = title
    }

    async save() {
        let shop = this.validateRequiredField('#fieldListMagasin', 'Magasin')
        let dateList = this.validateRequiredField("#fielListDate", 'Date')
        if ((shop != null) && (dateList != null)) {
            const date = new Date(dateList)
            try {
                if (self.list) {
                    self.list.shop = shop
                    self.list.date = date
                    if (await this.model.update(self.list) === 200) {
                        this.toast("La liste a bien été modifé")
                        if(self.list.archived === false){
                            navigate('index')
                        } else {
                            navigate('archive')
                        }
                        self.list = null
                    } else {
                        this.displayServiceError()
                    }
                } else {
                    if (await this.model.insert(new List(shop, date, false)) === 200) {
                        this.toast("La liste a bien été inséré")
                        navigate('index')
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

window.listeditController = new ListEditController()
