class UserEditController extends BaseFormController {

    constructor() {
        super()
        this.svc = new UserAccountAPI()
        const id = window.idEntity
        this.edit(id)
        this.displayAllNotif(id)
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

    async displayAllNotif(userId) {
        $('#btNotifications').innerHTML = `  
         <button class="waves-effect waveclassNameht btn" onclick="notificationController.add(${userId});">Envoyer</button> `

        let content = ''
        try {
            const notifications = await this.modelNotification.getAll(userId)

            for(let notification of notifications) {
                let date = new Date(notification.created_at)
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                date= date.toLocaleDateString('fr-FR', options)
                content += `<tr>
                        <td>${notification.titre}</td>
                        <td>${notification.text}</td>
                        <td>${notification.islue}</td>
                        </tr>`
            }
            $('#tableBodyAllNotifications').innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async edit(userId) {
        try {
            if(userId !== undefined) {
                const user = await this.modelUser.getUser(userId)
                let content = ''

                if (user === undefined) {
                    this.displayServiceError()
                    return
                }
                if (user === null) {
                    this.displayNotFoundError()
                    return
                }
                this.selectedUser = user

                if ($("#editTitleCompte")) {
                    $("#editTitleCompte").innerHTML = `<h4> Modification de ${user.displayname}</h4>`
                    $("#fieldAdresse").value = user.login

                    for (let role of await this.modelUser.getRolesToUser(user.id)) {
                        content += `<tr>
                        <td>${role.label}</td>
                        <td><button class="btn" onclick="userEditController.supRole( ${role.id})"><i class="material-icons">delete</i></button></td>
                        </tr>`
                    }

                    for (let role of await this.modelUser.getRolesNotToUser(user.id)) {
                        content += `<tr style=" background-color: #ff6262;">
                        <td>${role.label}</td>
                        <td><button class="btn" onclick="userEditController.addRole( ${role.id})"><i class="material-icons">add</i></button></td>
                        </tr>`
                    }

                    $("#tableBodyAllRoles").innerHTML = content
                }

            }

            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
    }

    async addRole(roleId) {
        try {
            if (this.selectedUser) {
                if (await this.modelUser.addRoleUser(this.selectedUser.id, roleId) === 200) {
                    this.toast("Le role a bien été ajouté")
                    this.edit(this.selectedUser.id)
                } else {
                    this.displayServiceError()
                }
            }

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }


    async supRole(roleId) {
        try {
            if (this.selectedUser) {

                if (await this.modelUser.deleteRoleUser(this.selectedUser.id, roleId) === 200) {
                    this.toast("Le role a bien été supprimer")
                    this.edit(this.selectedUser.id)
                } else {
                    this.displayServiceError()
                }
            }

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }


    async save() {
        let login = this.validateRequiredField("#fieldAdresse", 'Address')
        if (login != null) {
            try {
                if (this.selectedUser) {
                    this.selectedUser.login = login
                    if (await this.modelUser.update(this.selectedUser) === 200) {

                        this.toast("L'adresse email a bien été modifé")

                        this.svc.sendEmailForgetPwd(login)
                            .then(res => {
                                this.toast("Un email a bien été envoyer")
                            })
                            .catch(err => {
                                console.log(err)
                                if (err == 401) {
                                    this.toast("Adresse email invalide")
                                } else {
                                    this.displayServiceError()
                                }
                            })

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

window.userEditController = new UserEditController()
