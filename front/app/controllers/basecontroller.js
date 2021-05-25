class BaseController {
    constructor(secured) {
        if (secured) { this.checkAuthentication() }
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
        this.modelItem = new ModelItem()
        this.modelUser = new ModelUser()
        this.modelShare = new ModelShare()
        this.modelNotification = new ModelNotification()
    }
    checkAuthentication() {
        if (localStorage.getItem("token") === null) {
            window.location.replace("login.html")
        }
    }
    displayConfirmDelete(object, onclick) {
        if (object === undefined) {
            this.displayServiceError()
            return
        }
        if (object === null) {
            this.displayNotFoundError()
            return
        }

        $('#spanDeleteObject').innerText = object.toString()
        $('#btnDelete').onclick = onclick
        this.getModal('#modalConfirmDelete').open()
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayDeletedMessage(onUndo) {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }
    displayUndoDone() {
        this.toast('Opération annulée')
    }
    displayNotFoundError() {
        this.toast('Entité inexistante')
    }
    displayServiceError() {
        this.toast( 'Service injoignable ou problème réseau')
    }
    getModal(selector) {
        return M.Modal.getInstance($(selector))
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
}
