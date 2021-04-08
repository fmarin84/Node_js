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
                    if (err == 401) {
                        this.toast("Adresse e-mail ou mot de passe incorrect")
                    } else {
                        this.displayServiceError()
                    }
                })
        }
    }

    async register() {

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
                    //window.location.replace("index.html")
                })
                .catch(err => {
                    console.log(err)
                    if (err == 401) {
                        this.toast("Adresse email déjà utilisé ")
                    } else {
                        this.displayServiceError()
                    }
                })
        }

    }

    async sendLink(){

        let name = this.validateRequiredField('#fieldName', 'Nom')
        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')
        let password = this.validateRequiredField('#fieldPassword', 'Mot de passe')
        let confpassword = this.validateRequiredField('#fieldConfPassword', 'Conf mot de passe')

        if ((name != null) && (login != null) && (password != null) &&  (confpassword != null)) {
            if(password !== confpassword){
                this.toast("Les mots de passe ne sont pas identiques")
                return false
            }
/*
            const user = await this.modelUser.getByLogin(login)
            if (user === undefined) {
                this.displayServiceError()
                return
            }
            if (user === null) {
                this.displayNotFoundError()
                return
            }
 */
            this.svc.sendLink(login)
                .then(res => {
                    //window.location.replace("index.html")
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
