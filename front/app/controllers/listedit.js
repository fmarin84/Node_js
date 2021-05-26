class ListEditController extends BaseFormController {

    constructor() {
        super()
        let title = `<h3> Ajout d'une liste </h3>`

        if (indexController.selectedList) {
            self.list = indexController.selectedList
            indexController.selectedList = null
            $("#fieldListMagasin").value = self.list.shop
            const date = new Date(self.list.date)
            date.setDate(date.getDate()+1)
            $("#fielListDate").value = date.toISOString().substr(0, 10)
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

                    //Notification
                    /*
                    Une liste partagée a été modifiée par un autre utilisateur (ne pas générer de notifications supplémentaires sur cette modification
                    de liste pour cet utilisateur tant que l'utilisateur propriétaire de la liste n'aura pas lu la notification)

                    if(la list est partager)
                        if(le proprietaire a lue la notif ou s'il n'en a pas ) Ajout de l'id de la liste dans la table des notifs
                             On envoie une notif a tout les utilisateurs de la liste
                     */

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
