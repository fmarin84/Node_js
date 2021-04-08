class ForgetpasswordController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()

    }


    async resetPwd() {

        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')
        let password = this.validateRequiredField('#fieldPassword', 'Mot de passe')
        let confpassword = this.validateRequiredField('#fieldConfPassword', 'Conf mot de passe')

        if ((login != null) && (password != null) &&  (confpassword != null)) {
            if(password !== confpassword){
                this.toast("Les mots de passe ne sont pas identiques")
                return false
            }

            let urlcourante = document.location.href;
            const time30m = urlcourante.substring (urlcourante.lastIndexOf( "=" )+1 );

            const date = new Date()
            const dateTime = date.getTime()

            if(time30m < dateTime){
                this.toast("Votre délai de 30 minutes est écouler")
            } else {
                try {
                    const user = new User()
                    user.login = login
                    user.challenge = password
                    if (await this.svc.updateforgetPwd(user) === 200) {
                        this.toast("Votre mot de passe a bien été modifé")

                    } else {
                        this.displayServiceError()
                    }

                } catch (err) {
                    console.log(err)
                    this.displayServiceError()
                }
            }
        }
    }


}

window.forgetpasswordController  = new ForgetpasswordController()
