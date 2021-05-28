class SubscribeController extends BaseFormController {

    constructor() {
        super()
        this.svc = new UserAccountAPI()
    }

    async subscribSendEmail(){

        const currentUser = await this.modelUser.getThisUser()

        if ((currentUser.login != null)) {
            this.svc.sendEmailSubscrib(currentUser.login)
                .then(res => {
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


    async add(){
        const currentUser = await this.modelUser.getThisUser()

        let first_name = this.validateRequiredField("#first_name", 'prenom')
        let last_name = this.validateRequiredField("#last_name", 'nom')
        let fieldCB = this.validateRequiredField("#fieldCB", 'cb')
        let fieldCVV = this.validateRequiredField("#fieldCVV", 'cvv')

        if ( (first_name != null) && (last_name != null) &&(fieldCB != null) &&(fieldCVV != null)) {
            try {

                const payment = await this.modelPayment.getByUserId(currentUser.id)
                if (payment.length === 0) {
                    if (await this.modelPayment.insert(new Payment(first_name, last_name, currentUser.id)) === 200) {

                        if (await this.modelUser.addRoleUser(currentUser.id, 3) === 200) {
                            this.toast("Merci ! Votre paiement à bien été accepté")
                            this.toast("Félicitation ! Vous êtes maintenent abonné.")
                            await this.subscribSendEmail()
                        }

                    } else {
                        this.displayServiceError()
                    }

                } else {
                    this.toast("Vous êtes déjà abonné.")

                }




            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
        }
    }


}

window.subscribeController = new SubscribeController()
