class ListShareController extends BaseFormController {
    constructor() {
        super()
        this.idList = window.idCurrentList
        this.displayUsers()
    }

    async displayUsers() {
        let content = ''

        if(this.users){
            let users = this.users
            try {
                for(let user of users) {
                    content += `
                <td>${user.displayname}</td>
                <td>${user.login}</td>
               
                <td><button class="btn" onclick=''><i class="material-icons">send</i></button></td>`

                }

                $('#usersTable').innerHTML = content

            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
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
