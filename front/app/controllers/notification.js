class NotificationController extends BaseFormController {

    constructor() {
        super()
    }

    async add(userId) {
        let title = this.validateRequiredField("#fieldTitle", 'Titre')
        let text = this.validateRequiredField("#fieldText", 'Texte')

        if ( (title != null) && (text != null)) {
            try {
                if (await this.modelNotification.insert(new Notif(title, text, false, userId)) === 200) {
                    this.toast("Le role a bien été ajouté")
                } else {
                    this.displayServiceError()
                }
            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
        }
    }

    async displayNotif() {

        let content = ''
        try {
            const user = await this.modelUser.getThisUser()
            const notifications = await this.modelNotification.getNotification(user.id)
            for(let notification of notifications) {

                let date = new Date(notification.created_at)
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                date= date.toLocaleDateString('fr-FR', options)

                content += ` <li>
                                <div class="collapsible-header"><i class="material-icons">filter_drama</i>${notification.titre} - ${date}
                                    <a onclick="notificationController.updateIsLue(${notification.id}, true)"><i class="material-icons right">emails</i></a>
                                </div>
                                <div class="collapsible-body"><span>${notification.text}</span></div>
                            </li>`
                }

            $('.collapsible').innerHTML = content

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async updateIsLue(notificationId, islue) {

        const notification = await this.modelNotification.getById(notificationId)
        notification.islue = islue
        try {
            if (await this.modelNotification.update(notification) === 200) {
                if(islue){
                    this.toast("Notification marquer comme lue.")
                } else{
                    this.toast("Notification marquer comme non lue.")
                }
                this.displayNotif();

            } else {
                this.displayServiceError()
            }
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }


}

window.notificationController = new NotificationController()
