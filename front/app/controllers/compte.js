class CompteController extends BaseFormController {

    constructor() {
        super()
        this.edit()
        this.svc = new UserAccountAPI()
        this.displayNotif()

    }
    async displayNotif() {
        const currentUser = await this.modelUser.getThisUser()
        const nbNotifs = await this.modelNotification.countNotification(currentUser.id)
        $('#notification').innerText = nbNotifs
        $('#notificationMenu').innerText = nbNotifs
    }

    async edit() {
        try {
            this.selectedUser = null
            const object = await this.modelUser.getThisUser()
            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }
            this.selectedUser = object

            if($("#editTitleCompte")){
                $("#editTitleCompte").innerHTML = `<h3> Bonjour ${object.displayname}</h3>`
                $("#fieldNom").value = object.displayname
                $("#fieldAdresse").value = object.login
            }

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async save() {

        let nom = this.validateRequiredField('#fieldNom', 'Name')
        let login = this.validateRequiredField("#fieldAdresse", 'Address')
        if ((nom != null) && (login != null)) {
            try {
                if (this.selectedUser) {
                    const loginOld = this.selectedUser.login
                    this.selectedUser.displayname = nom
                    this.selectedUser.login = login
                    if (await this.modelUser.update(this.selectedUser) === 200) {
                        this.toast("Votre compte a bien été modifé")
                        this.selectedUser = null
                        if(loginOld !== login){
                            logout()
                        }else {
                            this.edit()
                        }
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


    async resetPwd() {

        let oldPassword = this.validateRequiredField('#fieldOldMdp', 'old')
        let password = this.validateRequiredField('#fieldMdp', 'Mot de passe')
        let confpassword = this.validateRequiredField('#fieldconfMdp', 'Conf mot de passe')

        if ((oldPassword != null) && (password != null) &&  (confpassword != null)) {

            if(password !== confpassword){
                this.toast("Les mots de passe ne sont pas identiques")
                return false
            }

            try {
                if (this.selectedUser) {
                    this.selectedUser.challenge = password
                    this.selectedUser.old = oldPassword
                    if ( await this.modelUser.updatePwd(this.selectedUser) === 200) {
                        this.toast("Votre mot de passe a bien été modifé")
                    } else {
                        if (await this.modelUser.updatePwd(this.selectedUser) === 401) {
                            this.toast("Mot de passe incorrect")

                        } else {
                            this.displayServiceError()
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }

        }
    }


}

window.compteController = new CompteController()
