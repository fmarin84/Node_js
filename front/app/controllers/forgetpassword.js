class ForgetpasswordController extends BaseFormController {
    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.has('token')){
            const token = urlParams.get('token')
            this.token = token
        }
        else{
            window.location.replace('login.html')
        }
    }

    async resetPwd(){
        let password = this.validateRequiredField('#fieldPassword', 'Mot de passe')
        let confpassword = this.validateRequiredField('#fieldConfPassword', 'Conf mot de passe')

        if ((password != null) &&  (confpassword != null)) {
            if(password !== confpassword){
                this.toast("Les mots de passe ne sont pas identiques")
                return false
            }
                if(await this.svc.getValidationChangePassword(this.token,password)){
                    this.toast("modification effectué")
                }
                else{
                    this.toast("mail expriré")
                }

        }

    }

}

window.forgetpasswordController  = new ForgetpasswordController()
