class ListShareController extends BaseFormController {
    constructor() {
        super()
        this.idList = window.idCurrentList
        this.displayUsers()
    }

    async displayUsers() {
        const list =indexController.selectedList

        const title = `${list.shop}`

        $('#titlesharelist').append(title)
// <td><button class="btn" onclick='listshareController.contenuModal("${list.id}", "${user.id}")'><i class="material-icons">send</i></button></td>
        let content = ''
        if(this.users){
            let users = this.users
            try {
                for(let user of users) {
                    content += `
                <td>${user.displayname}</td>
                <td>${user.login}</td>
               
               <td><a class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick='listshareController.contenuModal("${list.id}", "${user.id}")'><i class="material-icons">send</i></a></td>`

                }

                $('#usersTable').innerHTML = content

            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
        }

    }


    async contenuModal(listid, userid) {

        let content = ''
        content += `<a href="#!" class="modal-close waves-effect waves-red btn-flat" onclick='listshareController.share("${listid}", "${userid}",0)'>Non</a>
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat" onclick='listshareController.share("${listid}", "${userid}", 1)'>Oui</a>`

        $('#footerAcces').innerHTML = content
    }

    async share(listid, userid, state) {

        try {
            await this.modelShare.insert(listid, userid, state)
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }

    async search() {
        try {
            let login = this.validateRequiredField('#fieldLogin', 'Login')
            const object = await this.modelUser.getByLogin(login)
            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }
            this.users = object
            this.displayUsers()
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}

window.listshareController = new ListShareController()
