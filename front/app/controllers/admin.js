class AdminController extends BaseFormController {
    constructor() {
        super()
        this.tableBodyAllUsers = $('#tableBodyAllUsers')
        this.displayAllUsers()
    }

    async displayAllUsers() {
        let content = ''
        try {
            for (const user of await this.modelUser.getAllUsers()) {
                //const date = user.date.toLocaleDateString()

                content += `<tr>
                    <td>${user.login}</td>
                    <td>${user.displayname}</td>
                    <td>Role</td>`

                if(user.isactived === false){
                    content += `<td><p><label><input type="checkbox"  onclick='adminController.Check(${user.id})' /><span></span></label></p></td>`
                } else {
                    content += `<td><p><label><input type="checkbox" checked="checked"  onclick='adminController.Check(${user.id})' /><span></span></label></p></td>`
                }

                content +=
                    `<td class="icon">
                    <button class="btn" onclick="adminController.edit(${user.id})"><i class="material-icons">edit</i></button>
                    </td></tr>`
            }

           $('#tableBodyAllUsers').innerHTML = content
        } catch (err) {
            console.log(err)
            if(err == 401){
                logout()
            }
            this.displayServiceError()
        }
    }

    async Check(userId){
        const user = await this.modelUser.getUser(userId)
        if(user.isactived === false){
            user.isactived = true

        } else {
            user.isactived = false
        }

        if ( await this.modelUser.update(user) === 200) {
            if(user.isactived === false){
                this.toast("L'utilisateur a bien été activé")
            } else {
                this.toast("L'utilisateur a bien été désactivé")
            }
        } else {
            this.displayServiceError()
        }

    }

    async edit(id) {

        try {
            const object = await this.modelUser.getUserToAdmin(id)
            if (object === undefined) {
                this.displayServiceError()
                return
            }
            if (object === null) {
                this.displayNotFoundError()
                return
            }

            navigateParams('useredit', id)
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }

    async displayUsers() {
        const list =indexController.selectedList

        let content = ''
        if(this.users){
            let users = this.users
            try {
                for(let user of users) {
                    content += `<tr>
                    <td>${user.login}</td>
                    <td>${user.displayname}</td>
                    <td>Role</td>`
                    if(user.isactived === false){
                        content += `<td><p><label><input type="checkbox"  onclick='adminController.Check(${user.id})' /><span></span></label></p></td>`
                    } else {
                        content += `<td><p><label><input type="checkbox" checked="checked"  onclick='adminController.Check(${user.id})' /><span></span></label></p></td>`
                    }

                    content +=
                        `<td class="icon">
                    <button class="btn" onclick="adminController.edit(${user.id})"><i class="material-icons">edit</i></button>
                    </td></tr>`
                }

                $('#tableBodyAllUsers').innerHTML = content

            } catch (err) {
                console.log(err)
                this.displayServiceError()
            }
        }
    }

    async search() {
        try {
            //let login = this.validateRequiredField('#fieldLogin', 'Login')
            let login = $('#fieldLogin').value
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
            if(this.users.length === 0){
                this.toast("Login incorrect ")
            }
            this.displayUsers()
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}

window.adminController = new AdminController()
