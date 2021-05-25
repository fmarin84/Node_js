class NotificationController extends BaseController {

    constructor() {
        super()
    }

    async displayNotif() {

        let content = ''
        try {
            const user = await this.modelUser.getThisUser()
            const notifications = await this.modelNotification.getNotification(user.id)
            for(let notification of notifications) {

                if(!notification.islue) {
                    content += ` <li>
                                    <div class="collapsible-header"><i class="material-icons">filter_drama</i>${notification.titre}
                                        <a onclick="notificationController.updateIsLue(${notification.id}, true)"><i class="material-icons right">drafts</i></a>
                                    </div>
                                    <div class="collapsible-body"><span>${notification.text}</span></div>
                                </li>`
                } else {
                    content += ` <li>
                                    <div class="collapsible-header"><i class="material-icons">filter_drama</i>${notification.titre}
                                        <a onclick="notificationController.updateIsLue(${notification.id}, false)"><i class="material-icons right">emails</i></a>
                                    </div>
                                    <div class="collapsible-body"><span>${notification.text}</span></div>
                                </li>`
                }
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
                    this.toast("Notification marquer comme non lue.")
                } else{
                    this.toast("Notification marquer comme lue.")
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
