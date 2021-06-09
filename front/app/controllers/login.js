class LoginController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
    }
    async authenticate() {
        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')
        let password = this.validateRequiredField('#fieldPassword', 'Mot de passe')
        if ((login != null) && (password != null)) {
            this.svc.authenticate(login, password)
                .then(res => {
                    localStorage.setItem("token", res.token)
                    window.location.replace("index.html")
                })
                .catch(err => {
                    console.log(err)
                    if (err === 401) {
                        this.toast("Adresse e-mail ou mot de passe incorrect")
                    } else if (err === 400) {
                        this.toast("Votre est compte désactivé")
                    } else {
                        this.displayServiceError()
                    }
                })
        }
    }

    async forgetSendEmail(){
        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')

        if ((login != null)) {

            this.svc.sendEmailForgetPwd(login)
                .then(res => {
                    //window.location.replace("index.html")
                    this.toast("Un email vous a était envoyer")
                })
                .catch(err => {
                    console.log(err)
                    if (err == 401) {
                        this.toast("Adresse email invalide")
                    } else {
                        this.displayServiceError()
                    }
                })
        }
    }

}

window.loginController = new LoginController()
