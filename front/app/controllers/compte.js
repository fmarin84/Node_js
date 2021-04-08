class CompteController extends BaseFormController {

    constructor() {
        super()
        this.edit()
    }


    async edit() {
        try {
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
                        //navigate('compte')
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

window.compteController = new CompteController()
