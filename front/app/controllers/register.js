class RegisterController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
    }

    register(){

        let name = this.validateRequiredField('#fieldName', 'Nom')
        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')
        let password = this.validateRequiredField('#fieldPassword', 'Mot de passe')
        let confpassword = this.validateRequiredField('#fieldConfPassword', 'Conf mot de passe')

        if ((name != null) && (login != null) && (password != null) &&  (confpassword != null)) {
            if(password !== confpassword){
                this.toast("Les mots de passe ne sont pas identiques")
                return false
            }

            this.svc.register(name, login, password)
                .then(res => {
                    if(res==200){
                        this.toast("Inscription réussi ! Veuillez valider le compte via le lien dans le mail")
                        $("#fieldPassword").value=""
                        $("#fieldConfPassword").value=""
                    }
                    else{
                        this.toast("Adresse email déjà utilisé")
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.displayServiceError()

                })
        }
    }

    resendMe() {
        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')
        this.svc.reSendMailValidation(login).then(r => this.toast("Mail envoyer"))


    }
}

window.registerController = new RegisterController()