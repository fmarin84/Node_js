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
        this.displayNotif()

    }
    async displayNotif() {
        const currentUser = await this.modelUser.getThisUser()
        const nbNotifs = await this.modelNotification.countNotification(currentUser.id)
        if(nbNotifs > 0){
            $('#notifiaction').innerText = nbNotifs
            $('#notificationMenu').innerText = nbNotifs
        }
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

                        const list = await this.model.getListsShareByList(self.list.id)
                        const currentUser = await this.modelUser.getThisUser()
                        const notifications = await this.modelNotification.getNotificationByListShareId(list[0].id)

                        let notif = null
                        for (let notification of notifications) {
                            if( (notification.titre === "Modification liste paratager") && (notification.listshareid === self.list.id) && (list[0].useraccount_id === notification.fk_useraccount_id)) {
                                notif = notification
                            }
                        }

                        if (list.length !== 0 ) {

                            if( (notif === null) || (notif.islue  === true) ) {
                                for (let user of await this.model.getUsersList(list[0].id)) {
                                    await this.modelNotification.insert(new Notif("Modification liste paratager", `La liste ${list.toString()} a été modifié par  ${currentUser.displayName}`, false, user.id, list[0].id))
                                }
                                await this.modelNotification.insert(new Notif("Modification liste paratager", `La liste ${list.toString()} + a été modifié par  ${currentUser.displayName}`, false, list[0].useraccount_id, list[0].id))
                            }
                        }

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
